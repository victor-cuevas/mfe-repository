locals {
  aws_provider_assume_role_arn = "arn:aws:iam::${var.aws_account_id}:role/${var.assume_role_name == "" ? "${var.environment}-cicd-automation" : var.assume_role_name}"
  infrastructure_name          = var.demo_id != "" ? var.demo_id : var.environment
}
