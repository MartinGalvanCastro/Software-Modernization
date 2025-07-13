variable "name" {
  type        = string
  description = "Prefix for all networking resources"
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR block for the VPC"
}

variable "services" {
  description = <<EOF
A map of microservice names to their path prefixes and ports:
{
  products = { prefix = "/products", port = 8000 },
  sales    = { prefix = "/sales",    port = 8000 },
  sellers  = { prefix = "/sellers",  port = 8000 },
}
EOF
  type = map(object({ prefix = string, port = number }))
}
