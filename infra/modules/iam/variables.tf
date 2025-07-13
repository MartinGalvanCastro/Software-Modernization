variable "role_name" {
  type        = string
  description = "IAM role name for ECS task execution"
  default     = "ecsTaskExecutionRole"
}
