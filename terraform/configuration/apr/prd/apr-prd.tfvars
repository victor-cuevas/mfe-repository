client      = "apr"
environment = "prd"
domain      = "april-prod.project.cloud" // TODO:

aws_account_id         = "755404668768"
certificate_arn        = "arn:aws:acm:us-east-1:755404668768:certificate/6ccd6cd9-407e-47e2-b705-4f31a9c3c61a" // TODO:
versioning_bucket_name = "mfe-versioning"

// Uncomment and fill only if you need to create a new Cognito appclient in the given user pool
// appclient_callback_urls = ["https://portal.april-prod.project.cloud"] // TODO:
// appclient_cognito_user_pool_name = "prod-closefo-apr-a-cognito" // TODO:
// cognito_app_client_name = "mfes-app-angular-april"
// appclient_supported_identity_providers = ["COGNITO"]

create_lambda_edge = true

microfrontends = [
   {
    service_name    = "mfe-brokerportal",
    host_name       = "brokerportal",
    allowed_origins = [
      "https://brokerportal.april-prod.project.cloud", // TODO:
    ]
  },
  {
    service_name    = "mfe-brokerpanel",
    host_name       = "brokerpanel",
    allowed_origins = [
      "https://brokerpanel.april-prod.project.cloud", // TODO:
    ]
  },
  {
    service_name    = "app-shell",
    host_name       = "portal",
    allowed_origins = [
      "https://portal.april-prod.project.cloud" // TODO:
    ]
    custom_connect_src = [
      # Cognito connection
      "https://cognito-idp.eu-west-1.amazonaws.com",

      # Datadog
      "https://*.browser-intake-datadoghq.eu",

      # MFE URLs
      "https://brokerportal.april-prod.project.cloud", // TODO: List of MFE access URLs
      "https://brokerpanel.april-prod.project.cloud", // TODO: List of MFE access URLs

      # MFE APIs
      "https://broker-api.april-prod.project.cloud", // TODO: List of BFF URLs
      "https://panel-api.april-prod.project.cloud", // TODO: List of BFF URLs
    ]
    custom_img_src = "data:"
    custom_frame_src = "https://pay.realexpayments.com"
  }
]

// TODO: remove WAF protection before going live
waf_enabled     = true
waf_allowed_ips = [
  # project AWS Client VPN NAT GW IP
  "99.80.71.103/32",
  # DATADOG eu-west-1 IPs
  "63.35.33.198/32",
  "18.200.120.237/32",
  "63.34.100.178/32",
]
