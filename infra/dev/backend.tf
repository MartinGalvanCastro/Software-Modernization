terraform {
  backend "s3" {
    bucket         = "modernizacion-terraform-state"
    key            = "dev/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "modernizacion-locks"
    encrypt        = true
  }
}