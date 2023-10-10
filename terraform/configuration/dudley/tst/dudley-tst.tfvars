certificate_arn        = "arn:aws:acm:us-east-1:716458657572:certificate/d4ab08b8-4c96-4ac0-b86b-24a9a42e3c5c"
versioning_bucket_name = "mfe-versioning"

// Uncomment and fill only if you need to create a new Cognito appclient in the given user pool
// appclient_callback_urls = [ ]
// appclient_cognito_user_pool_name = "## name of the user pool ##"
// cognito_app_client_name = "## name for the app client ##"
// appclient_supported_identity_providers = [ ## list of identity providers ## ] i.e. ["COGNITO", "AZURE"]

domain         = "dudley-test.project.cloud"
microfrontends = [
  {
    service_name    = "mfe-brokerportal",
    host_name       = "portal",
    allowed_origins = [
      "https://intermediary.dudley-test.project.cloud",
      "http://intermediary.dudley-test.project.cloud",
      "https://intermediary.dudley-test.project.cloud/*",
      "http://intermediary.dudley-test.project.cloud/*"
    ]
  },
  {
    service_name    = "mfe-brokerpanel",
    host_name       = "panel",
    allowed_origins = [
      "https://intermediary.dudley-test.project.cloud",
      "http://intermediary.dudley-test.project.cloud",
      "https://intermediary.dudley-test.project.cloud/*",
      "http://intermediary.dudley-test.project.cloud/*"
    ]
  },
  {
    service_name    = "app-shell",
    host_name       = "intermediary",
    allowed_origins = [
      "https://not-needed"
    ]
  }
]

environment = "tst"
client      = "dudley"

aws_account_id = "716458657572"

waf_allowed_ips = [
  # project AWS Client VPN NAT GW IP
  "99.80.71.103/32",
  # DATADOG eu-west-1 IPs
  "63.35.33.198/32",
  "18.200.120.237/32",
  "63.34.100.178/32",
  # DAVINCI IP set
  "34.247.247.140/32",
  "54.195.227.145/32",
  "54.247.157.114/32",
  "61.12.35.115/32",
  "84.199.47.10/32",
  "86.110.242.35/32",
  "86.110.242.36/32",
  "99.80.71.103/32",
  "103.5.78.10/32",
  "217.195.117.36/32"
]
