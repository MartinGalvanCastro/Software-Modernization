variable "role_name" {
  type        = string
  description = "Base name for all IAM roles/policies"
}

variable "aws_region" {
  type        = string
  description = "AWS region"
}

variable "dynamodb_tables" {
  type        = list(string)
  description = "List of DynamoDB table names that tasks need access to"
  default     = []
}
