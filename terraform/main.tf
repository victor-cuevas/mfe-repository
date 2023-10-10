module "versioning_bucket" {

  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "~> 2.0"

  bucket = "${var.environment}-${var.versioning_bucket_name}-${data.aws_caller_identity.current.account_id}"

  force_destroy = true

  versioning = {
    enabled = true
  }

}

data "aws_iam_policy_document" "s3_policy" {
  statement {
    actions = ["s3:*"]
    resources = [
      "${module.versioning_bucket.s3_bucket_arn}/*",
      "${module.versioning_bucket.s3_bucket_arn}"
    ]

    principals {
      type        = "AWS"
      identifiers = [local.aws_provider_assume_role_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "bucket_policy" {
  bucket = module.versioning_bucket.s3_bucket_id
  policy = data.aws_iam_policy_document.s3_policy.json
}

module "cognito_app_client" {
  count = var.appclient_cognito_user_pool_name == null ? 0 : 1

  source = "./modules/cognito-app-client"

  app_name                     = var.cognito_app_client_name
  cognito_user_pool_name       = var.appclient_cognito_user_pool_name
  callback_urls                = var.appclient_callback_urls
  supported_identity_providers = var.appclient_supported_identity_providers
}
