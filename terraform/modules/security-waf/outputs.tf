output "web_acl" {
  value = aws_wafv2_web_acl.main
}

output "ip_rule_set_addresses" {
  value = aws_wafv2_ip_set.main.addresses
}

output "web_acl_id" {
  value = aws_wafv2_web_acl.main.id
}

output "web_acl_arn" {
  value = aws_wafv2_web_acl.main.arn
}
