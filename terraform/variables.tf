variable "microfrontends" {
  description = "(Required) List of configurations for microfrontend"
  type        = any
}

# variable "role_arn" {
#   description = "(Required) Role for versioning bucket for s3 bucket policy principal"
#   type = string
#   # default = "arn:aws:iam::951192163059:role/dev-cicd-automation"
# }

variable "client" {
  type        = string
  description = "name of the client to identify the infrastructure"
}

variable "environment" {
  type    = string
  default = "dev"
}

variable "demo_id" {
  type    = string
  default = ""
}

variable "aws_account_id" {
  type        = string
  description = "aws account id"
  sensitive   = true
}

variable "assume_role_name" {
  type        = string
  description = "aws role arn name that will be assumed during deployment"
  default     = ""
  sensitive   = true
}

variable "certificate_arn" {
  type        = string
  description = "aws certificate arn"
  sensitive   = true
}

variable "domain" {
  type        = string
  description = "aws domain"
}

variable "versioning_bucket_name" {
  type        = string
  description = "bucket name to deploy artifacts"
  default     = "mfe-versioning"
}

variable "create_lambda_edge" {
  type        = bool
  description = "enables/disables the creation of the lambda@edge"
  default     = true
}

# WAF
variable "waf_allowed_ips" {
  type        = list(any)
  default     = []
  description = "List of IP addresses allowed to connect to the application front-ends"
}

variable "waf_enabled" {
  type        = bool
  description = "Enables/disables the WAF module for private/public access"
  default     = true
}

variable "waf_rate_based_statement_rules" {
  type        = list(any)
  description = "WAF rate-based rules"
  default = [
    {
      name     = "rate-based-rule-0"
      priority = 1
      action   = "block"
      statement = {
        limit              = 2000
        aggregate_key_type = "IP"
      }
      visibility_config = {
        cloudwatch_metrics_enabled = false
        sampled_requests_enabled   = false
        metric_name                = "rate-based-rule-0"
      }
    }
  ]
}

variable "waf_byte_match_statement_rules" {
  type        = list(any)
  description = "WAF byte-match rules"
  default = [
    {
      name     = "allow-google-bots"
      priority = 2
      action   = "allow"
      statement = {
        positional_constraint = "EXACTLY"
        search_string         = "googlebot(at)googlebot.com"
        text_transformation = [
          {
            priority = 0
            type     = "NONE"
          }
        ]
        field_to_match = {
          single_header = {
            name = "from"
          }
        }
      }
      visibility_config = {
        cloudwatch_metrics_enabled = true
        sampled_requests_enabled   = true
        metric_name                = "allow-google-bots"
      }
    },
    {
      name     = "allow-cookie-bots"
      priority = 3
      action   = "allow"
      statement = {
        positional_constraint = "EXACTLY"
        search_string         = "http://cookiebot.com"
        text_transformation = [
          {
            priority = 0
            type     = "NONE"
          }
        ]
        field_to_match = {
          single_header = {
            name = "user-agent"
          }
        }
      }
      visibility_config = {
        cloudwatch_metrics_enabled = true
        sampled_requests_enabled   = true
        metric_name                = "allow-cookie-bots"
      }
    },
    {
      name     = "allow-lighthouse"
      priority = 4
      action   = "allow"
      statement = {
        positional_constraint = "CONTAINS"
        search_string         = "Chrome-Lighthouse"
        text_transformation = [
          {
            priority = 0
            type     = "NONE"
          }
        ]
        field_to_match = {
          single_header = {
            name = "user-agent"
          }
        }
      }
      visibility_config = {
        cloudwatch_metrics_enabled = true
        sampled_requests_enabled   = true
        metric_name                = "allow-lighthouse"
      }
    }
  ]
}

variable "appclient_callback_urls" {
  type        = list(string)
  description = "callback urls for cognito"
  default     = []
}

variable "appclient_cognito_user_pool_name" {
  description = "name of the cognito user pool to add the new appclient. if null or omitted the appclient will not be added to the user pool"
  default     = null
}

variable "cognito_app_client_name" {
  default = "mfe-app-client"
}

variable "appclient_supported_identity_providers" {
  type        = list(string)
  description = "list of identity providers to add to the appclient"
  default     = ["COGNITO"]
}
