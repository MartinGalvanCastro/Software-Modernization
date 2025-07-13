provider "aws" {
  region = var.aws_region
}

######
# Common Modules
######

module "cognito" {
  source        = "../modules/cognito"
  name          = "modernizacion-users"
  domain_prefix = "modernizacion-auth"    # must be globally unique
  callback_urls = ["https://app.example.com/auth/callback"]
  logout_urls   = ["https://app.example.com/"]
}

module "ecs_cluster" {
  source       = "../modules/ecs-cluster"
  cluster_name = "modernizacion-cluster"
}

module "iam" {
  source    = "../modules/iam"
  role_name = "modernizacion-ecs-exec-role"
}

module "networking" {
  source         = "../modules/networking"
  name           = "products"
  vpc_cidr       = var.vpc_cidr
  container_port = 8000
}



######
# Products Modules
######
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


module "dynamodb_products" {
  source       = "../modules/dynamodb"
  name         = "Products"
  hash_key     = "code"
}


module "ecs_service_products" {
  source               = "../modules/ecs-service"
  cluster_arn          = module.ecs_cluster.arn
  service_name         = "products"
  container_image      = "${module.ecr_products.repository_url}:latest"
  container_port       = 8000
  execution_role_arn   = module.iam.execution_role_arn
  subnet_ids           = module.networking.subnet_ids
  security_group_ids   = [module.networking.security_group_id]
  target_group_arn     = module.networking.target_group_arn
  aws_region = var.aws_region
  environment = {
    AWS_REGION            = var.aws_region
    PRODUCTS_TABLE_NAME   = module.dynamodb_products.name
    DYNAMODB_ENDPOINT_URL = "https://dynamodb.${var.aws_region}.amazonaws.com"
  }
}


######
# Sales Modules
######

module "ecr_sales" {
  source = "../modules/ecr"
  name   = "sales"
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

######
# Sellers Modules
######

module "ecr_sellers" {
  source = "../modules/ecr"
  name   = "sellers"
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

