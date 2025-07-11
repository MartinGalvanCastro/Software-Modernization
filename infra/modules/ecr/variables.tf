variable "name" {
  type        = string
  description = "ECR repository name"
}

variable "lifecycle_policy_json" {
  type        = string
  description = "JSON lifecycle policy document"
}
