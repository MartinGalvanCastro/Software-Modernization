output "vpc_id" {
  value = aws_vpc.this.id
}

output "subnet_ids" {
  value       = aws_subnet.public[*].id
  description = "List of public subnet IDs"
}

output "security_group_id" {
  value = aws_security_group.ecs_sg.id
}

output "alb_dns_name" {
  value = aws_lb.alb.dns_name
}

output "target_group_arn" {
  value = aws_lb_target_group.this.arn
}
