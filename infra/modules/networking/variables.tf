variable "name" {
  type        = string
  description = "Prefix for networking resources"
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR block for the VPC"
}

variable "container_port" {
  type        = number
  description = "Port the container listens on"
}

variable "health_path" {
  type        = string
  description = "Health-check path for target group"
  default     = "/health/ready"
}
