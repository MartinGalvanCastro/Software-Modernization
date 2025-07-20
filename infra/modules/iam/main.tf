data "aws_caller_identity" "current" {}

resource "aws_iam_role" "ecs_task_execution" {
  name = var.role_name

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "execution_policy" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role" "ecs_task" {
  name = "${var.role_name}-task"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })
}

# Inline policy granting CRUD on all listed tables
resource "aws_iam_policy" "dynamo_crud" {
  name        = "${var.role_name}-dynamo-crud"
  description = "Allow ECS tasks to CRUD DynamoDB tables"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = [
          "dynamodb:DescribeTable",
          "dynamodb:GetItem", 
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = [
          for tbl in var.dynamodb_tables : "arn:aws:dynamodb:${var.aws_region}:${data.aws_caller_identity.current.account_id}:table/${tbl}"
        ]
      },
      {
        Effect   = "Allow"
        Action   = [
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = [
          for tbl in var.dynamodb_tables : "arn:aws:dynamodb:${var.aws_region}:${data.aws_caller_identity.current.account_id}:table/${tbl}/index/*"
        ]
      }
    ]
  })

  # Force policy update by adding a lifecycle rule
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_iam_role_policy_attachment" "task_dynamo_attach" {
  role       = aws_iam_role.ecs_task.name
  policy_arn = aws_iam_policy.dynamo_crud.arn
}