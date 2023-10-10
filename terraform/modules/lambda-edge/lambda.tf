module "lambda_at_edge_security_headers" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "~> 2.0"

  function_name = "${var.stage}-${var.service_name}-lambda-at-edge"
  description   = "Adjust security headers"
  handler       = "security-lambda.handler"
  runtime       = var.lambda_runtime

  lambda_at_edge = true

  source_path = "./modules/lambda-edge/src"
}
