/*
  Route53
*/
module "records" {

  count = var.domain == "" ? 0 : 1

  providers = {
    aws = aws.network
  }

  source  = "terraform-aws-modules/route53/aws//modules/records"
  version = "~> 2.0"

  zone_id = data.aws_route53_zone.domain[count.index].zone_id

  records = [
    {
      name = var.host_name
      type = "A"
      alias = {
        name    = replace(module.cloudfront.cloudfront_distribution_domain_name, "/[.]$/", "")
        zone_id = module.cloudfront.cloudfront_distribution_hosted_zone_id
      }
    },
  ]
}
