module "lambda_edge" {
  count = var.create_lambda_edge ? 1 : 0

  source = "./modules/lambda-edge"

  providers = {
    aws = aws.network-us-east-1
  }

  stage        = local.infrastructure_name
  service_name = "mfe-angular-security"
}
