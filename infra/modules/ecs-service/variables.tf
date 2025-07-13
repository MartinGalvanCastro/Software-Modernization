variable "cluster_arn" {
  type        = string
  description = "ARN of the ECS cluster"
}

variable "service_name" {
  type        = string
  description = "Name to give the ECS service and container"
}

variable "container_image" {
  type        = string
  description = "ECR image URI (including tag) to run"
}

variable "container_port" {
  type        = number
  description = "Container port that the app listens on"
}

variable "execution_role_arn" {
  type        = string
  description = "IAM role ARN for ECS task execution"
}

variable "task_role_arn" {
  type = string
    description = "IAM role ARN for ECS task to access AWS services"
}

variable "subnet_ids" {
  type        = list(string)
  description = "List of subnet IDs for the Fargate tasks"
}

variable "security_group_ids" {
  type        = list(string)
  description = "List of security group IDs for the Fargate tasks"
}

variable "target_group_arn" {
  type        = string
  description = "ARN of the ALB target group to attach to the service"
}

variable "cpu" {
  type        = number
  default     = 256
  description = "Task CPU reservation"
}

variable "memory" {
  type        = number
  default     = 512
  description = "Task memory reservation"
}

variable "environment" {
  type        = map(string)
  default     = {}
  description = "Environment variables to inject into the container"
}

variable "desired_count" {
  type        = number
  default     = 1
  description = "How many tasks to run"
}

variable "aws_region" {
  type = string
}