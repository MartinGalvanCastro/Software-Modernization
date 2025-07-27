# Store environment variables in AWS SSM Parameter Store
# These will be fetched during CI/CD pipeline

resource "aws_ssm_parameter" "alb_dns_name" {
  name  = "/modernizacion/frontend/ALB_DNS_NAME"
  type  = "String"
  value = module.networking.alb_dns_name

  tags = {
    Purpose = "Frontend CI/CD"
  }
}

resource "aws_ssm_parameter" "cognito_user_pool_id" {
  name  = "/modernizacion/frontend/VITE_COGNITO_USER_POOL_ID"
  type  = "String"
  value = module.cognito.user_pool_id

  tags = {
    Purpose = "Frontend CI/CD"
  }
}

resource "aws_ssm_parameter" "cognito_app_client_id" {
  name  = "/modernizacion/frontend/VITE_COGNITO_APP_CLIENT_ID"
  type  = "String"
  value = module.cognito.user_pool_client_id

  tags = {
    Purpose = "Frontend CI/CD"
  }
}

resource "aws_ssm_parameter" "s3_bucket_name" {
  name  = "/modernizacion/frontend/S3_BUCKET_NAME"
  type  = "String"
  value = module.s3_static_website.bucket_name

  tags = {
    Purpose = "Frontend CI/CD"
  }
}

resource "aws_ssm_parameter" "s3_website_endpoint" {
  name  = "/modernizacion/frontend/S3_WEBSITE_ENDPOINT"
  type  = "String"
  value = module.s3_static_website.website_endpoint

  tags = {
    Purpose = "Frontend CI/CD"
  }
}

# App configuration (you can update these anytime)
resource "aws_ssm_parameter" "app_name" {
  name  = "/modernizacion/frontend/VITE_APP_NAME"
  type  = "String"
  value = "Shoppy App"

  tags = {
    Purpose = "Frontend CI/CD"
  }
}

resource "aws_ssm_parameter" "app_description" {
  name  = "/modernizacion/frontend/VITE_APP_DESCRIPTION"
  type  = "String"
  value = "Sistema de gestión integral para tiendas y negocios"

  tags = {
    Purpose = "Frontend CI/CD"
  }
}

resource "aws_ssm_parameter" "app_version" {
  name  = "/modernizacion/frontend/VITE_APP_VERSION"
  type  = "String"
  value = "1.0.0"

  tags = {
    Purpose = "Frontend CI/CD"
  }
}
