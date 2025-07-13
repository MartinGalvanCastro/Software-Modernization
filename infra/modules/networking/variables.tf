variable "name" {
  type        = string
  description = "Prefix for all networking resources"
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR block for the VPC"
}

variable "container_port" {
  type        = number
  description = "Port your containers listen on (e.g. 8000)"
}

variable "health_path" {
  type        = string
  description = "Health-check endpoint path"
  default     = "/health/ready"
}
