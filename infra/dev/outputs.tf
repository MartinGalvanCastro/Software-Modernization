output "cognito_user_pool_id" {
  value = module.cognito.user_pool_id
}

output "cognito_app_client_id" {
  description = "The App Client ID from the cognito module"
  value       = module.cognito.user_pool_client_id
}

output "alb_dns_name" {
  value = module.networking.alb_dns_name
}

# Frontend outputs
output "s3_bucket_name" {
  description = "S3 bucket name for static website hosting"
  value       = module.s3_static_website.bucket_name
}

output "s3_website_endpoint" {
  description = "S3 website endpoint URL"
  value       = module.s3_static_website.website_endpoint
}

