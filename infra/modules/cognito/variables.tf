variable "name" {
  type        = string
  description = "Base name for the Cognito User Pool"
}

variable "domain_prefix" {
  type        = string
  description = "Unique prefix for the Cognito hosted UI domain"
}

variable "callback_urls" {
  type        = list(string)
  description = "OAuth2 callback URLs (frontend URL)"
}

variable "logout_urls" {
  type        = list(string)
  description = "OAuth2 sign-out URLs"
}

variable "allowed_oauth_flows" {
  type        = list(string)
  default     = ["code"]
}

variable "allowed_oauth_scopes" {
  type        = list(string)
  default     = ["email", "openid", "profile"]
}
