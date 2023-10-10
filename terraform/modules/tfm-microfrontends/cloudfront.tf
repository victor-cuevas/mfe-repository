module "cloudfront" {
  source     = "terraform-aws-modules/cloudfront/aws"
  version    = "~> 2.0"
  depends_on = [var.web_acl_id, var.lambda_edge_qualified_arn]

  aliases             = ["${var.host_name}.${var.domain}"]
  comment             = "Microfrontend ${var.environment}-${var.service_name} distribution"
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  http_version        = "http1.1"
  retain_on_delete    = false
  wait_for_deployment = false
  price_class         = "PriceClass_All"
  web_acl_id          = var.web_acl_id

  create_origin_access_identity = true
  origin_access_identities = {
    s3_bucket_one = "Origin Access Identity for ${var.environment}-${var.service_name}"
  }

  origin = {
    s3_one = {
      domain_name = module.s3_one.s3_bucket_bucket_regional_domain_name
      origin_id   = "${var.environment}-${var.service_name}-s3-origin"
      s3_origin_config = {
        origin_access_identity = "s3_bucket_one" # key in `origin_access_identities`
      }
      custom_header = [
        {
          name  = "custom-csp-src"
          value = trimspace(join("; ", [
            "default-src 'self'",
            "img-src ${trimspace("'self' https://*.${var.domain} ${var.custom_img_src}")}",
            "font-src ${trimspace("'self' https://*.${var.domain} ${var.custom_font_src}")}",
            "script-src 'self' 'unsafe-inline' https://*.${var.domain}",
            "style-src 'unsafe-inline' https://*.${var.domain}",
            "object-src 'none'",
            "connect-src ${trimspace("'self' ${join(" ", var.custom_connect_src)}")}",
            "frame-src ${trimspace(var.custom_frame_src)}",
            "worker-src blob:"
          ]))
        },
        {
          name  = "custom-stage",
          value = var.environment
        },
        {
          name  = "custom-id",
          value = var.aws_account_id
        }
      ]
    }
  }

  default_cache_behavior = {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "${var.environment}-${var.service_name}-s3-origin"

    forwarded_values = {
      query_string = false

      cookies = {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
    viewer_protocol_policy = "redirect-to-https"

    lambda_function_association = var.skip_lambda_edge ? {} : {
      # Valid keys: viewer-request, origin-request, viewer-response, origin-response
      origin-response = {
        lambda_arn = var.lambda_edge_qualified_arn
      }
    }
  }

  viewer_certificate = {
    acm_certificate_arn      = "${var.certificate_arn}"
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  geo_restriction = {
    restriction_type = "none"
    # restriction_type = "whitelist"
    # locations        = ["NO", "UA", "US", "GB"]
  }

  custom_error_response = [
    {
      "error_caching_min_ttl" = 300,
      "error_code"            = 403,
      "response_code"         = 200,
      "response_page_path"    = "/index.html",
    }
  ]

  tags = {
    ServiceName = var.service_name
  }
}
