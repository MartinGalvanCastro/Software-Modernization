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
  source           = "../modules/iam"
  role_name        = "modernizacion-ecs"
  aws_region       = var.aws_region
  dynamodb_tables  = [
    module.dynamodb_products.name,
    module.dynamodb_sales.name
    # add future service tables here…
  ]
}

module "networking" {
  source = "../modules/networking"

  services = {
    products = { prefix = "/products", port = 8000 }
    sales    = { prefix = "/sales",    port = 8000 }
    sellers  = { prefix = "/sellers",  port = 8000 }
  }

  vpc_cidr       = var.vpc_cidr
  name           = "modernizacion"
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
  global_secondary_indexes = [
    {
      name            = "name-index"
      hash_key        = "name"
      hash_key_type   = "S"
      projection_type = "ALL"
    }
  ]
}


module "ecs_service_products" {
  source               = "../modules/ecs-service"
  cluster_arn          = module.ecs_cluster.arn
  service_name         = "products"
  container_image      = "${module.ecr_products.repository_url}:latest"
  container_port       = 8000
  execution_role_arn   = module.iam.execution_role_arn
  task_role_arn       = module.iam.task_role_arn
  subnet_ids           = module.networking.subnet_ids
  security_group_ids = [module.networking.ecs_security_group_id]
  target_group_arn   = module.networking.target_group_arns["products"]
  aws_region = var.aws_region
  environment = {
    AWS_REGION            = var.aws_region
    PRODUCTS_TABLE_NAME   = module.dynamodb_products.name
    DYNAMODB_ENDPOINT_URL = "https://dynamodb.${var.aws_region}.amazonaws.com"
    COGNITO_USERPOOL_ID = module.cognito.user_pool_id
    COGNITO_APP_CLIENT_ID = module.cognito.user_pool_client_id
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

module "dynamodb_sales" {
  source = "../modules/dynamodb"

  name     = "Sales"
  hash_key = "id"
  global_secondary_indexes = [
    {
      name            = "invoice-index"
      hash_key        = "invoice_number"
      hash_key_type   = "S"
      projection_type = "ALL"
    }
  ]
}

module "ecs_service_sales" {
  source             = "../modules/ecs-service"
  cluster_arn        = module.ecs_cluster.arn
  service_name       = "sales"
  container_image    = "${module.ecr_sales.repository_url}:latest"
  container_port     = 8000
  execution_role_arn = module.iam.execution_role_arn
  task_role_arn      = module.iam.task_role_arn
  subnet_ids         = module.networking.subnet_ids
  security_group_ids = [module.networking.ecs_security_group_id]
  target_group_arn   = module.networking.target_group_arns["sales"]

  aws_region = var.aws_region

  environment = {
    AWS_REGION            = var.aws_region
    SALES_TABLE_NAME      = module.dynamodb_sales.name
    DYNAMODB_ENDPOINT_URL = "https://dynamodb.${var.aws_region}.amazonaws.com"
    COGNITO_USERPOOL_ID     = module.cognito.user_pool_id
    COGNITO_APP_CLIENT_ID   = module.cognito.user_pool_client_id
  }
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

module "dynamodb_sellers" {
  source = "../modules/dynamodb"

  name     = "Sellers"
  hash_key = "id"
  global_secondary_indexes = [
    {
      name            = "email-index"
      hash_key        = "email"
      hash_key_type   = "S"
      projection_type = "ALL"
    }
  ]
}

module "ecs_service_sellers" {
  source             = "../modules/ecs-service"
  cluster_arn        = module.ecs_cluster.arn
  service_name       = "sellers"
  container_image    = "${module.ecr_sales.repository_url}:latest"
  container_port     = 8000
  execution_role_arn = module.iam.execution_role_arn
  task_role_arn      = module.iam.task_role_arn
  subnet_ids         = module.networking.subnet_ids
  security_group_ids = [module.networking.ecs_security_group_id]
  target_group_arn   = module.networking.target_group_arns["sellers"]

  aws_region = var.aws_region

  environment = {
    AWS_REGION            = var.aws_region
    SALES_TABLE_NAME      = module.dynamodb_sellers.name
    DYNAMODB_ENDPOINT_URL = "https://dynamodb.${var.aws_region}.amazonaws.com"
    COGNITO_USERPOOL_ID     = module.cognito.user_pool_id
    COGNITO_APP_CLIENT_ID   = module.cognito.user_pool_client_id
  }
}

######
# GQL Modules
######

module "ecr_gql" {
  source = "../modules/ecr"
  name   = "gql"
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


