client      = "ohp"
environment = "dev"
domain      = "dev.davincicloud.nl"

aws_account_id         = "499636446108"
certificate_arn        = "arn:aws:acm:us-east-1:499636446108:certificate/2cdefafd-2134-4416-a515-b3d79cea54d3"
versioning_bucket_name = "mfe-versioning"

appclient_callback_urls = [ "https://portal.dev.davincicloud.nl" ]
appclient_cognito_user_pool_name = "dev-elq"
cognito_app_client_name = "portals-mfe-angular-dev"

create_lambda_edge = true

microfrontends = [
  {
    service_name = "mfe-brokerportal",
    host_name    = "portal",
    allowed_origins = [
      "https://broker.dev.davincicloud.nl",
      "https://closefo-d1-portalengine.dev.davincicloud.nl",
      "http://closefo-d1-portalengine.dev.davincicloud.nl",
      "https://closefo-d1-portalengine.dev.davincicloud.nl/*"
    ]
  },
  {
    service_name = "mfe-brokerpanel",
    host_name    = "panel",
    allowed_origins = [
      "https://broker.dev.davincicloud.nl",
      "https://closefo-d1-portalengine.dev.davincicloud.nl",
      "http://closefo-d1-portalengine.dev.davincicloud.nl",
      "https://closefo-d1-portalengine.dev.davincicloud.nl/*"
    ]
  },
  {
    service_name     = "mfe-authconfig",
    host_name        = "authconfig",
    disable_waf      = true
    skip_lambda_edge = true
    allowed_origins = [
      "https://broker.dev.davincicloud.nl",
      "https://closefo-dev-dconfig.dev.davincicloud.nl",
      "https://closefo-dev-dconfig.dev.davincicloud.nl/*"
    ]
  },
  {
    service_name     = "mfe-agendaconfig",
    host_name        = "agendaconfig",
    disable_waf      = true
    skip_lambda_edge = true
    allowed_origins = [
      "https://broker.dev.davincicloud.nl",
      "https://closefo-dev-dconfig.dev.davincicloud.nl",
      "https://closefo-dev-dconfig.dev.davincicloud.nl/*"
    ]
  },
  {
    service_name     = "mfe-processconfig",
    host_name        = "processconfig",
    disable_waf      = true
    skip_lambda_edge = true
    allowed_origins = [
      "https://broker.dev.davincicloud.nl",
      "https://closefo-dev-dconfig.dev.davincicloud.nl",
      "https://closefo-dev-dconfig.dev.davincicloud.nl/*"
    ]
  },
  {
    service_name     = "mfe-productconfig",
    host_name        = "productconfig",
    disable_waf      = true
    skip_lambda_edge = true
    allowed_origins = [
      "https://broker.dev.davincicloud.nl",
      "https://closefo-dev-dconfig.dev.davincicloud.nl",
      "https://closefo-dev-dconfig.dev.davincicloud.nl/*"
    ]
  },
  {
    service_name     = "mfe-assetconfig",
    host_name        = "assetconfig",
    disable_waf      = true
    skip_lambda_edge = true
    allowed_origins = [
      "https://broker.dev.davincicloud.nl",
      "https://closefo-dev-dconfig.dev.davincicloud.nl",
      "https://closefo-dev-dconfig.dev.davincicloud.nl/*"
    ]
  },
  {
    service_name       = "app-shell",
    host_name          = "broker",
    allowed_origins    = [ "https://closefo-dev-dconfig.dev.davincicloud.nl" ]
    custom_connect_src = [
      # Cognito connection
      "https://cognito-idp.eu-west-1.amazonaws.com",
      "https://dev-elq.auth.eu-west-1.amazoncognito.com",

      # Datadog
      "https://*.browser-intake-datadoghq.eu",

      # MFE URLs
      "https://*.dev.davincicloud.nl",

      # MFE APIs
      # Replace with actual API list when moving to production
      "https://*.dev.davincicloud.nl",
      "https://*.execute-api.eu-west-1.amazonaws.com",
    ]
    custom_img_src    = "data:"
    custom_frame_src  = "https://pay.sandbox.realexpayments.com/pay"
  },
  {
    service_name     = "mfe-appinstanceconfig",
    host_name        = "appinstanceconfig",
    disable_waf      = true
    skip_lambda_edge = true
    allowed_origins  = [
      "https://broker.dev.davincicloud.nl",
      "https://closefo-dev-dconfig.dev.davincicloud.nl",
      "https://closefo-dev-dconfig.dev.davincicloud.nl/*"
    ]
  },
  {
    service_name     = "mfe-accountingconfig",
    host_name        = "accountingconfig",
    disable_waf      = true
    skip_lambda_edge = true
    allowed_origins  = [
      "https://broker.dev.davincicloud.nl",
      "https://closefo-dev-dconfig.dev.davincicloud.nl",
      "https://closefo-dev-dconfig.dev.davincicloud.nl/*"
    ]
  },
  {
    service_name     = "mfe-financialconfigservice",
    host_name        = "financialconfigservice",
    disable_waf      = true
    skip_lambda_edge = true
    allowed_origins  = [
      "https://broker.dev.davincicloud.nl",
      "https://closefo-dev-dconfig.dev.davincicloud.nl",
      "https://closefo-dev-dconfig.dev.davincicloud.nl/*"
    ]
  },
  {
    service_name     = "mfe-runningaccountconfigservice",
    host_name        = "runningaccountconfigservice",
    disable_waf      = true
    skip_lambda_edge = true
    allowed_origins  = [
      "https://broker.dev.davincicloud.nl",
      "https://closefo-dev-dconfig.dev.davincicloud.nl",
      "https://closefo-dev-dconfig.dev.davincicloud.nl/*"
    ]
  },
  {
    service_name     = "mfe-taxstatementconfig",
    host_name        = "taxstatementconfig",
    disable_waf      = true
    skip_lambda_edge = true
    allowed_origins  = [
      "https://broker.dev.davincicloud.nl",
      "https://closefo-dev-dconfig.dev.davincicloud.nl",
      "https://closefo-dev-dconfig.dev.davincicloud.nl/*"
    ]
  },
  {
    service_name     = "mfe-communicationconfigservice",
    host_name        = "communicationconfigservice",
    disable_waf      = true
    skip_lambda_edge = true
    allowed_origins  = [
      "https://broker.dev.davincicloud.nl",
      "https://closefo-dev-dconfig.dev.davincicloud.nl",
      "https://closefo-dev-dconfig.dev.davincicloud.nl/*"
    ]
  },
  {
    service_name     = "mfe-planconfig",
    host_name        = "planconfig",
    disable_waf      = true
    skip_lambda_edge = true
    allowed_origins  = [
      "https://broker.dev.davincicloud.nl",
      "https://closefo-dev-dconfig.dev.davincicloud.nl",
      "https://closefo-dev-dconfig.dev.davincicloud.nl/*"
    ]
  },
  {
    service_name     = "mfe-collectionmeasureconfig",
    host_name        = "collectionmeasureconfig",
    disable_waf      = true
    skip_lambda_edge = true
    allowed_origins = [
      "https://broker.dev.davincicloud.nl",
      "https://closefo-dev-dconfig.dev.davincicloud.nl",
      "https://closefo-dev-dconfig.dev.davincicloud.nl/*"
    ]
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
