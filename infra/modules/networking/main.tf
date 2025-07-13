#── VPC + subnets ───────────────────────────────────────────────────────────────

resource "aws_vpc" "this" {
  cidr_block = var.vpc_cidr
}

data "aws_availability_zones" "available" {}

resource "aws_subnet" "public" {
  count                   = 2
  vpc_id                  = aws_vpc.this.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 8, count.index)
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.this.id
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.this.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }
}

resource "aws_route_table_association" "public_assoc" {
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

#── SECURITY GROUPS ────────────────────────────────────────────────────────────

# ALB SG: allow inbound HTTP/80 from anywhere
resource "aws_security_group" "alb_sg" {
  name        = "${var.name}-alb-sg"
  description = "Allow HTTP to ALB"
  vpc_id      = aws_vpc.this.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

locals {
  unique_ports = distinct([
    for svc in var.services : svc.port
  ])
}

# ECS tasks SG: allow traffic from the ALB on each service’s port
resource "aws_security_group" "ecs_sg" {
  name        = "${var.name}-ecs-sg"
  description = "Allow ALB to ECS tasks"
  vpc_id      = aws_vpc.this.id

  # 2) Only one rule per unique port:
  dynamic "ingress" {
    for_each = local.unique_ports
    content {
      from_port       = ingress.value
      to_port         = ingress.value
      protocol        = "tcp"
      security_groups = [aws_security_group.alb_sg.id]
      description     = "Allow ALB to ECS tasks on port ${ingress.value}"
    }
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

#── APPLICATION LOAD BALANCER ──────────────────────────────────────────────────

resource "aws_lb" "alb" {
  name               = "${var.name}-alb"
  internal           = false
  load_balancer_type = "application"
  subnets            = aws_subnet.public[*].id
  security_groups    = [aws_security_group.alb_sg.id]
}

#── PER-SERVICE TARGET GROUPS ─────────────────────────────────────────────────

resource "aws_lb_target_group" "svc_tg" {
  for_each     = var.services
  name         = "${each.key}-tg"
  port         = each.value.port
  protocol     = "HTTP"
  vpc_id       = aws_vpc.this.id
  target_type  = "ip"

  health_check {
    path                = "${each.value.prefix}/health/ready"
    port                = "traffic-port"
    matcher             = "200-399"
    interval            = 15
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

#── HTTP LISTENER + PATH-BASED ROUTING ─────────────────────────────────────────

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 80
  protocol          = "HTTP"
  default_action {
    type = "fixed-response"
    fixed_response {
      content_type = "text/plain"
      message_body = "Not Found"
      status_code  = "404"
    }
  }
}

resource "aws_lb_listener_rule" "svc_rule" {
  for_each     = var.services
  listener_arn = aws_lb_listener.http.arn
  # give each rule a unique priority (e.g. 100,101,102…)
  priority     = 100 + index(keys(var.services), each.key)

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.svc_tg[each.key].arn
  }

  condition {
    path_pattern {
      values = ["${each.value.prefix}/*"]
    }
  }
}
