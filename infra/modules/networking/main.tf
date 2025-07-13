# VPC & subnets (simplest single public subnet for demo)
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

# Security group for ECS tasks
resource "aws_security_group" "ecs_sg" {
  name        = "${var.name}-ecs-sg"
  vpc_id      = aws_vpc.this.id
  description = "ECS tasks SG"
  ingress {
    from_port   = var.container_port
    to_port     = var.container_port
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

# ALB
resource "aws_lb" "alb" {
  name               = "${var.name}-alb"
  internal           = false
  load_balancer_type = "application"
  subnets = aws_subnet.public[*].id
  security_groups    = [aws_security_group.ecs_sg.id]
}

# Target group for a service
resource "aws_lb_target_group" "this" {
  name     = "${var.name}-tg"
  port     = var.container_port
  protocol = "HTTP"
  vpc_id   = aws_vpc.this.id
  target_type = "ip"
  health_check {
    path                = var.health_path
    matcher             = "200-399"
    interval            = 15
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

# Listener on port 80
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.this.arn
  }
}
