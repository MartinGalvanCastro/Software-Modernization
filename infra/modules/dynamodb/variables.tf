variable "name" {
  type        = string
  description = "DynamoDB table name"
}

variable "hash_key" {
  type        = string
  description = "Partition key attribute name"
}

variable "hash_key_type" {
  type        = string
  description = "Attribute type (S | N)"
  default     = "S"
}
