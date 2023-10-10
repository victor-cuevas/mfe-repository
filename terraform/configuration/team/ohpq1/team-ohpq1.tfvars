client      = "ohp"
environment = "ohpq1"
domain      = "dev.davincicloud.nl"

aws_account_id         = "499636446108"
assume_role_name       = "dev-cicd-automation"
certificate_arn        = "arn:aws:acm:us-east-1:499636446108:certificate/2cdefafd-2134-4416-a515-b3d79cea54d3"
versioning_bucket_name = "mfe-versioning-q1"

// Uncomment and fill only if you need to create a new Cognito appclient in the given user pool
// appclient_callback_urls = [ ]
// appclient_cognito_user_pool_name = "## name of the user pool ##"
// cognito_app_client_name = "## name for the app client ##"
// appclient_supported_identity_providers = [ ## list of identity providers ## ] i.e. ["COGNITO", "AZURE"]

create_lambda_edge = false

microfrontends = [
  {
    service_name    = "mfe-authconfig",
    host_name       = "ohpq1-authconfig",
    allowed_origins = [
      "https://ohpq1-host.dev.davincicloud.nl"
    ]
  },
  {
    service_name    = "mfe-processconfig",
    host_name       = "ohpq1-processconfig",
    allowed_origins = [
      "https://ohpq1-host.dev.davincicloud.nl"
    ]
  },
  {
    service_name    = "mfe-assetconfig",
    host_name       = "ohpq1-assetconfig",
    allowed_origins = [
      "https://ohpq1-host.dev.davincicloud.nl"
    ]
  },
  {
    service_name    = "mfe-agendaconfig",
    host_name       = "ohpq1-agendaconfig",
    allowed_origins = [
      "https://ohpq1-host.dev.davincicloud.nl"
    ]
  },
   {
    service_name    = "mfe-productconfig",
    host_name       = "ohpq1-productconfig",
    allowed_origins = [
      "https://ohpq1-host.dev.davincicloud.nl"
    ]
  },
  {
    service_name    = "mfe-financialconfigservice",
    host_name       = "ohpq1-financialconfigservice",
    allowed_origins = [
      "https://ohpq1-host.dev.davincicloud.nl"
    ]
  },
  {
    service_name    = "mfe-appinstanceconfig",
    host_name       = "ohpq1-appinstanceconfig",
    allowed_origins = [
      "https://ohpq1-host.dev.davincicloud.nl"
    ]
  },
  {
    service_name    = "mfe-accountingconfig",
    host_name       = "ohpq1-accountingconfig",
    allowed_origins = [
      "https://ohpq1-host.dev.davincicloud.nl"
    ]
  },
  {
    service_name    = "mfe-taxstatementconfig",
    host_name       = "ohpq1-taxstatementconfig",
    allowed_origins = [
      "https://ohpq1-host.dev.davincicloud.nl"
    ]
  },
   {
    service_name    = "mfe-runningaccountconfigservice",
    host_name       = "ohpq1-runningaccountconfigservice",
    allowed_origins = [
      "https://ohpq1-host.dev.davincicloud.nl"
    ]
  },

  {
    service_name    = "mfe-communicationconfigservice",
    host_name       = "ohpq1-communicationconfigservice",
    allowed_origins = [
      "https://ohpq1-host.dev.davincicloud.nl"
    ]
  },
  {
    service_name    = "mfe-collectionmeasureconfig",
    host_name       = "ohpq1-collectionmeasureconfig",
    allowed_origins = [
      "https://ohpq1-host.dev.davincicloud.nl"
    ]
  },
  {
    service_name    = "mfe-planconfig",
    host_name       = "ohpq1-planconfig",
    allowed_origins = [
      "https://ohpq1-host.dev.davincicloud.nl"
    ]
  },
  {
    service_name    = "app-shell",
    host_name       = "ohpq1-host",
    allowed_origins = [
      "https://not-needed"
    ]

    #  Only needed if lambda@edge is enabled
    # custom_connect_src = [
      # Cognito connection
      # "https://cognito-idp.eu-west-1.amazonaws.com",
      # "https://elq-dev.auth.eu-west-1.amazoncognito.com",

      # Datadog
      # "https://*.browser-intake-datadoghq.eu",

      # MFE URLs
      # "https://*.dev.davincicloud.nl",

      # MFE APIs
      # "https://*.execute-api.eu-west-1.amazonaws.com"
    # ]
    # custom_img_src = "data:"
  }
]

waf_enabled = false
waf_allowed_ips = []
