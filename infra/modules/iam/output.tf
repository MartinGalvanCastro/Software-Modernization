output "execution_role_arn" {
  value = aws_iam_role.ecs_task_execution.arn
  description = "ARN for the ECS Execution Role (ECS control-plane)"
}

output "task_role_arn" {
  value       = aws_iam_role.ecs_task.arn
  description = "ARN for the ECS Task Role (application code credentials)"
}