resource "aws_wafv2_ip_set" "main" {
  lifecycle {
    create_before_destroy = true
  }

  name               = var.ip_set_name
  description        = var.ip_set_description
  scope              = var.ip_set_scope
  ip_address_version = var.ip_set_ip_addr_version
  addresses          = var.ip_set_addresses
  tags               = var.tags
}


resource "aws_wafv2_web_acl" "main" {
  name        = var.waf_web_acl_name
  description = var.waf_web_acl_description
  scope       = var.waf_web_acl_scope

  depends_on = [
    aws_wafv2_ip_set.main
  ]
  lifecycle {
    create_before_destroy = true
  }

  default_action {
    block {}
  }

  rule {
    name     = "ip-whitelist"
    priority = 0

    action {
      allow {}
    }

    statement {
      ip_set_reference_statement {
        arn = aws_wafv2_ip_set.main.arn
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = var.waf_enable_web_acl_rule_metrics
      metric_name                = "${var.waf_web_acl_name}-ip-whitelist"
      sampled_requests_enabled   = var.waf_enable_web_acl_rule_request_sampling
    }
  }

  dynamic "rule" {
    for_each = var.waf_rate_based_statement_rules != null ? var.waf_rate_based_statement_rules : []
    content {
      name     = rule.value.name
      priority = rule.value.priority
      dynamic "action" {
        for_each = rule.value.action == "allow" ? [1] : []
        content {
          allow {}
        }
      }
      dynamic "action" {
        for_each = rule.value.action == "block" ? [1] : []
        content {
          block {}
        }
      }
      statement {
        dynamic "rate_based_statement" {
          for_each = lookup(rule.value, "statement", null) != null ? [rule.value.statement] : []
          content {
            limit              = rate_based_statement.value.limit
            aggregate_key_type = lookup(rate_based_statement.value, "aggregate_key_type", "IP")

            dynamic "forwarded_ip_config" {
              for_each = lookup(rate_based_statement.value, "forwarded_ip_config", null) != null ? [rate_based_statement.value.forwarded_ip_config] : []

              content {
                fallback_behavior = forwarded_ip_config.value.fallback_behavior
                header_name       = forwarded_ip_config.value.header_name
              }
            }
          }
        }
      }
      dynamic "visibility_config" {
        for_each = lookup(rule.value, "visibility_config", null) != null ? [rule.value.visibility_config] : []

        content {
          cloudwatch_metrics_enabled = lookup(visibility_config.value, "cloudwatch_metrics_enabled", true)
          metric_name                = "${var.waf_web_acl_name}-${visibility_config.value.metric_name}"
          sampled_requests_enabled   = lookup(visibility_config.value, "sampled_requests_enabled", true)
        }
      }
    }
  }

  dynamic "rule" {
    for_each = var.waf_byte_match_statement_rules != null ? var.waf_byte_match_statement_rules : []
    content {
      name     = rule.value.name
      priority = rule.value.priority
      dynamic "action" {
        for_each = rule.value.action == "allow" ? [1] : []
        content {
          allow {}
        }
      }
      dynamic "action" {
        for_each = rule.value.action == "block" ? [1] : []
        content {
          block {}
        }
      }

      statement {
        dynamic "byte_match_statement" {
          for_each = lookup(rule.value, "statement", null) != null ? [rule.value.statement] : []

          content {
            positional_constraint = byte_match_statement.value.positional_constraint
            search_string         = byte_match_statement.value.search_string

            dynamic "field_to_match" {
              for_each = lookup(rule.value.statement, "field_to_match", null) != null ? [rule.value.statement.field_to_match] : []

              content {
                dynamic "all_query_arguments" {
                  for_each = lookup(field_to_match.value, "all_query_arguments", null) != null ? [field_to_match.value] : []

                  content {}
                }

                dynamic "body" {
                  for_each = lookup(field_to_match.value, "body", null) != null ? [field_to_match.value] : []

                  content {}
                }

                dynamic "method" {
                  for_each = lookup(field_to_match.value, "method", null) != null ? [field_to_match.value] : []

                  content {}
                }

                dynamic "query_string" {
                  for_each = lookup(field_to_match.value, "query_string", null) != null ? [field_to_match.value] : []

                  content {}
                }

                dynamic "single_header" {
                  for_each = lookup(field_to_match.value, "single_header", null) != null ? [field_to_match.value.single_header] : []

                  content {
                    name = single_header.value.name
                  }
                }

                dynamic "single_query_argument" {
                  for_each = lookup(field_to_match.value, "single_query_argument", null) != null ? [field_to_match.value] : []

                  content {
                    name = single_query_argument.value.name
                  }
                }

                dynamic "uri_path" {
                  for_each = lookup(field_to_match.value, "uri_path", null) != null ? [field_to_match.value] : []

                  content {}
                }
              }
            }

            dynamic "text_transformation" {
              for_each = lookup(rule.value.statement, "text_transformation", null) != null ? [
                for rule in lookup(rule.value.statement, "text_transformation") : {
                  priority = rule.priority
                  type     = rule.type
              }] : []

              content {
                priority = text_transformation.value.priority
                type     = text_transformation.value.type
              }
            }
          }
        }
      }

      dynamic "visibility_config" {
        for_each = lookup(rule.value, "visibility_config", null) != null ? [rule.value.visibility_config] : []

        content {
          cloudwatch_metrics_enabled = lookup(visibility_config.value, "cloudwatch_metrics_enabled", true)
          metric_name                = "${var.waf_web_acl_name}-${visibility_config.value.metric_name}"
          sampled_requests_enabled   = lookup(visibility_config.value, "sampled_requests_enabled", true)
        }
      }
    }
  }

  tags = var.tags

  visibility_config {
    cloudwatch_metrics_enabled = var.waf_enable_web_acl_metrics
    metric_name                = var.waf_web_acl_name
    sampled_requests_enabled   = var.waf_enable_web_acl_request_sampling
  }
}
