# Terraform Module - WAF Rules for MicroFrontends

## Maintainer

Platform Services / Portals

## Who/How to contact

* PLATFORM-SERVICES team
* Open an issue in the same repository.
* Contact us via Teams channel.

## Terraform docs

<!--- BEGIN_TF_DOCS --->
### Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | ~> 1.0 |
| <a name="requirement_aws"></a> [aws](#requirement\_aws) | >= 3.0 |

### Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | >= 3.0 |

### Modules

No modules.

### Resources

| Name | Type |
|------|------|
| [aws_wafv2_ip_set.main](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/wafv2_ip_set) | resource |
| [aws_wafv2_web_acl.main](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/wafv2_web_acl) | resource |

### Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_ip_set_addresses"></a> [ip\_set\_addresses](#input\_ip\_set\_addresses) | (Required) Contains an array of strings that specify one or more IP addresses or blocks of IP addresses in Classless Inter-Domain Routing (CIDR) notation. AWS WAF supports all address ranges for IP versions IPv4 and IPv6 | `list(any)` | `null` | no |
| <a name="input_ip_set_description"></a> [ip\_set\_description](#input\_ip\_set\_description) | Waf v2 IP Set description | `string` | `"Waf v2 IP set"` | no |
| <a name="input_ip_set_ip_addr_version"></a> [ip\_set\_ip\_addr\_version](#input\_ip\_set\_ip\_addr\_version) | (Required) Specify IPV4 or IPV6. Valid values are IPV4 or IPV6 | `string` | `"IPV4"` | no |
| <a name="input_ip_set_name"></a> [ip\_set\_name](#input\_ip\_set\_name) | Waf v2 IP Set name | `string` | n/a | yes |
| <a name="input_ip_set_scope"></a> [ip\_set\_scope](#input\_ip\_set\_scope) | (Required) Specifies whether this is for an AWS CloudFront distribution or for a regional application. Valid values are CLOUDFRONT or REGIONAL | `string` | `"CLOUDFRONT"` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | n/a | `map(any)` | `{}` | no |
| <a name="input_waf_byte_match_statement_rules"></a> [waf\_byte\_match\_statement\_rules](#input\_waf\_byte\_match\_statement\_rules) | (Optional) Map of byte-match WAF rules | `list(any)` | `null` | no |
| <a name="input_waf_enable_web_acl_metrics"></a> [waf\_enable\_web\_acl\_metrics](#input\_waf\_enable\_web\_acl\_metrics) | (Required) A boolean indicating whether the associated resource sends metrics to CloudWatch | `bool` | `false` | no |
| <a name="input_waf_enable_web_acl_request_sampling"></a> [waf\_enable\_web\_acl\_request\_sampling](#input\_waf\_enable\_web\_acl\_request\_sampling) | (Required) A boolean indicating whether AWS WAF should store a sampling of the web requests that match the rules. You can view the sampled requests through the AWS WAF console. | `bool` | `false` | no |
| <a name="input_waf_enable_web_acl_rule_metrics"></a> [waf\_enable\_web\_acl\_rule\_metrics](#input\_waf\_enable\_web\_acl\_rule\_metrics) | (Required) A boolean indicating whether the associated resource sends metrics to CloudWatch | `bool` | `false` | no |
| <a name="input_waf_enable_web_acl_rule_request_sampling"></a> [waf\_enable\_web\_acl\_rule\_request\_sampling](#input\_waf\_enable\_web\_acl\_rule\_request\_sampling) | (Required) A boolean indicating whether AWS WAF should store a sampling of the web requests that match the rules. You can view the sampled requests through the AWS WAF console. | `bool` | `false` | no |
| <a name="input_waf_rate_based_statement_rules"></a> [waf\_rate\_based\_statement\_rules](#input\_waf\_rate\_based\_statement\_rules) | (Optional) Map of rate-based WAF rules | `list(any)` | `null` | no |
| <a name="input_waf_web_acl_description"></a> [waf\_web\_acl\_description](#input\_waf\_web\_acl\_description) | (Optional) A friendly description of the WebACL | `string` | `"WebACL"` | no |
| <a name="input_waf_web_acl_name"></a> [waf\_web\_acl\_name](#input\_waf\_web\_acl\_name) | (Required) A friendly name of the WebACL | `any` | n/a | yes |
| <a name="input_waf_web_acl_scope"></a> [waf\_web\_acl\_scope](#input\_waf\_web\_acl\_scope) | (Required) Specifies whether this is for an AWS CloudFront distribution or for a regional application. Valid values are CLOUDFRONT or REGIONAL. To work with CloudFront, you must also specify the region us-east-1 (N. Virginia) on the AWS provider. | `string` | `"CLOUDFRONT"` | no |

### Outputs

| Name | Description |
|------|-------------|
| <a name="output_ip_rule_set_addresses"></a> [ip\_rule\_set\_addresses](#output\_ip\_rule\_set\_addresses) | n/a |
| <a name="output_web_acl"></a> [web\_acl](#output\_web\_acl) | n/a |
| <a name="output_web_acl_arn"></a> [web\_acl\_arn](#output\_web\_acl\_arn) | n/a |
| <a name="output_web_acl_id"></a> [web\_acl\_id](#output\_web\_acl\_id) | n/a |

<!--- END_TF_DOCS --->
