client      = "ohp"
environment = "dev"
demo_id     = "<infrastructure_id>"
domain      = "portals.dev.project.tech"

aws_account_id         = "313871159238"
assume_role_name       = "dev-cicd-automation"
certificate_arn        = "arn:aws:acm:us-east-1:313871159238:certificate/0fff345c-dd5e-4096-ba6a-015712189cf6"
versioning_bucket_name = "mfe-versioning-<infrastructure_id>"

// Uncomment and fill only if you need to create a new Cognito appclient in the given user pool
// appclient_callback_urls = [ ]
// appclient_cognito_user_pool_name = "## name of the user pool ##"
// cognito_app_client_name = "## name for the app client ##"
// appclient_supported_identity_providers = [ ## list of identity providers ## ] i.e. ["COGNITO", "AZURE"]

create_lambda_edge = true

microfrontends = [
  {
    service_name = "mfe-broker-portal",
    host_name    = "<infrastructure_id>-mfe-broker-portal",
    allowed_origins = ["https://<infrastructure_id>.portals.dev.project.tech"]
  },
  {
    service_name = "mfe-broker-panel",
    host_name    = "<infrastructure_id>-mfe-broker-panel",
    allowed_origins = ["https://<infrastructure_id>.portals.dev.project.tech"]
  },
  {
    service_name = "app-shell",
    host_name    = "<infrastructure_id>",
    allowed_origins = ["https://<infrastructure_id>.portals.dev.project.tech"]
    custom_connect_src = [
      # Cognito connection
      "https://cognito-idp.eu-west-1.amazonaws.com",
      "https://elq-dev.auth.eu-west-1.amazoncognito.com",

      # Datadog
      "https://*.browser-intake-datadoghq.eu",

      # MFE URLs
      "https://*.portals.dev.project.tech",

      # MFE APIs
      "https://*.dev.davincicloud.nl",
      "https://*.execute-api.eu-west-1.amazonaws.com"
    ]
    custom_img_src = "data:"
    custom_frame_src = "https://pay.sandbox.realexpayments.com/pay"
  }
]

waf_enabled = true
waf_allowed_ips = [
  # project AWS Client VPN NAT GW IP
  "99.80.71.103/32",
  # DATADOG eu-west-1 IPs
  "63.35.33.198/32",
  "18.200.120.237/32",
  "63.34.100.178/32",
  # DAVINCI IP set
  "34.247.247.140/32",
  "54.154.149.156/32",
  "54.195.227.145/32",
  "52.214.32.160/32",
  "54.247.157.114/32",
  "61.12.35.115/32",
  "82.119.114.211/32",
  "82.119.114.212/32",
  "84.199.47.10/32",
  "86.110.242.35/32",
  "86.110.242.36/32",
  "99.80.71.103/32",
  "103.5.78.10/32",
  "212.89.233.194/32",
  "212.89.233.195/32",
  "212.89.239.26/32",
  "212.89.239.28/32",
  "217.195.117.36/32",
  # Minerva Tests
  "52.208.144.163/32"
]
