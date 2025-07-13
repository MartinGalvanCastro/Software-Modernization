output "cognito_user_pool_id" {
  value = module.cognito.user_pool_id
}

output "alb_dns_name" {
  value = module.networking.alb_dns_name
}