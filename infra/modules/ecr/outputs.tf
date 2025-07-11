output "repository_url" {
  value       = aws_ecr_repository.this.repository_url
  description = "Full URI (including registry) of the ECR repo"
}

output "repository_arn" {
  value       = aws_ecr_repository.this.arn
  description = "ARN of the ECR repository"
}
