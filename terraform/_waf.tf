module "waf" {
  source = "./modules/security-waf"

  count = var.waf_enabled ? 1 : 0

  providers = {
    aws = aws.network-us-east-1
  }

  ip_set_addresses               = var.waf_allowed_ips
  ip_set_name                    = "mfe-apps-angular-${var.client}-${local.infrastructure_name}"
  waf_web_acl_name               = "mfe-apps-angular-${var.client}-${local.infrastructure_name}"
  waf_rate_based_statement_rules = var.waf_rate_based_statement_rules
  waf_byte_match_statement_rules = var.waf_byte_match_statement_rules
}
