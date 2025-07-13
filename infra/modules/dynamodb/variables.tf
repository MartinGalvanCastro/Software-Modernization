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
  description = "Attribute type for the hash key (S | N)"
  default     = "S"
}

variable "global_secondary_indexes" {
  description = "List of GSIs to create. Each must specify name, hash_key, key_type and projection_type."
  type = list(object({
    name            = string
    hash_key        = string
    hash_key_type   = string   # "S" or "N"
    projection_type = string   # e.g. "ALL", "KEYS_ONLY", "INCLUDE"
  }))
  default = []
}