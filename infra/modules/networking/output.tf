output "vpc_id" {
  value       = aws_vpc.this.id
  description = "VPC ID"
}

output "subnet_ids" {
  value       = aws_subnet.public[*].id
  description = "List of public subnet IDs"
}

output "alb_dns_name" {
  value       = aws_lb.alb.dns_name
  description = "Shared ALB DNS name"
}

output "alb_arn" {
  value       = aws_lb.alb.arn
  description = "ALB ARN"
}

output "alb_security_group_id" {
  value       = aws_security_group.alb_sg.id
  description = "Security Group ID for ALB"
}

output "ecs_security_group_id" {
  value       = aws_security_group.ecs_sg.id
  description = "Security Group ID for ECS tasks"
}

# Map of service name → Target Group ARN
output "target_group_arns" {
  description = "Map of each service to its ALB target group ARN"
  value       = {
    for svc, tg in aws_lb_target_group.svc_tg :
    svc => tg.arn
  }
}