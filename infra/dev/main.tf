provider "aws" {
  region = var.aws_region
}


module "ecr_products" {
  source = "../modules/ecr"
  name   = "products"
  lifecycle_policy_json = jsonencode({
    rules = [
      {
        rulePriority = 1,
        description  = "Keep last 10 images",
        selection = {
          tagStatus       = "any",
          countType       = "imageCountMoreThan",
          countNumber     = 10,
        },
        action = { type = "expire" },
      }
    ]
  })
}

module "cognito" {
  source        = "../modules/cognito"
  name          = "modernizacion-users"
  domain_prefix = "modernizacion-auth"    # must be globally unique
  callback_urls = ["https://app.example.com/auth/callback"]
  logout_urls   = ["https://app.example.com/"]
}
