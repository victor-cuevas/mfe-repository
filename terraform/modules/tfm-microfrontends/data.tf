# data "aws_waf_web_acl" "mfes_app_acl" {
#   name = var.acl_name
# }

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}
data "aws_canonical_user_id" "current" {}

data "aws_route53_zone" "domain" {
  count = var.domain == "" ? 0 : 1

  provider = aws.network

  name = var.domain
}
