client      = "apr"
environment = "acc"
domain      = "april-acc.project.cloud"

aws_account_id         = "965381809141"
certificate_arn        = "arn:aws:acm:us-east-1:965381809141:certificate/98d27d47-b741-4eb5-8d66-f72e81e1b244"
versioning_bucket_name = "mfe-versioning"

// Uncomment and fill only if you need to create a new Cognito appclient in the given user pool
// appclient_callback_urls = [ ]
// appclient_cognito_user_pool_name = "## name of the user pool ##"
// cognito_app_client_name = "## name for the app client ##"
// appclient_supported_identity_providers = [ ## list of identity providers ## ] i.e. ["COGNITO", "AZURE"]

create_lambda_edge = true

microfrontends = [
  {
    service_name    = "mfe-brokerportal",
    host_name       = "portal",
    allowed_origins = [
      "https://portal.april-acc.project.cloud"
    ]
  },
  {
    service_name    = "mfe-brokerpanel",
    host_name       = "panel",
    allowed_origins = [
      "https://panel.april-acc.project.cloud"
    ]
  },
  {
    service_name    = "app-shell",
    host_name       = "portal-acc",
    allowed_origins = [
      "https://portal-acc.april-acc.project.cloud"
    ]
    custom_connect_src = [
      # Cognito connection
      "https://cognito-idp.eu-west-1.amazonaws.com",

      # Datadog
      "https://*.browser-intake-datadoghq.eu",

      # MFE URLs
      "https://*.april-acc.project.cloud",

      # MFE APIs
      "https://jwca74ruz6.execute-api.eu-west-1.amazonaws.com",
      "https://zrgzw1bfb2.execute-api.eu-west-1.amazonaws.com"
    ]
    custom_img_src = "data:"
    custom_frame_src = "https://pay.sandbox.realexpayments.com/pay"
  }
]

waf_enabled     = false
waf_allowed_ips = []
