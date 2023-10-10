client      = "nn-a"
environment = "tst"
domain      = "nationalenederlanden.davincicloud.nl"

aws_account_id         = "196700441487"
certificate_arn        = "arn:aws:acm:us-east-1:196700441487:certificate/40c11f1a-d8d9-48ae-9102-2208a24b7b46"
versioning_bucket_name = "mfe-versioning"

appclient_callback_urls = [ "https://configportal-a-test.nationalenederlanden.davincicloud.nl" ]
appclient_cognito_user_pool_name = "test-closefo-nn-a-cognito"
cognito_app_client_name = "tst-close-nn-a"
appclient_supported_identity_providers = [ "Saml-SSO-Provider", "COGNITO" ]

create_lambda_edge = true

microfrontends = [
  {
    service_name    = "mfe-authconfig",
    host_name       = "authconfig-a-test",
    allowed_origins = [
      "https://configportal-a-test.nationalenederlanden.davincicloud.nl",
      "https://configportal-a-test.nationalenederlanden.davincicloud.nl/*"
    ]
  },
  {
    service_name    = "mfe-processconfig",
    host_name       = "processconfig-a-test",
    allowed_origins = [
      "https://configportal-a-test.nationalenederlanden.davincicloud.nl",
      "https://configportal-a-test.nationalenederlanden.davincicloud.nl/*"
    ]
  },
  {
    service_name    = "mfe-assetconfig",
    host_name       = "assetconfig-a-test",
    allowed_origins = [
      "https://configportal-a-test.nationalenederlanden.davincicloud.nl",
      "https://configportal-a-test.nationalenederlanden.davincicloud.nl/*"
    ]
  },
  {
    service_name    = "mfe-agendaconfig",
    host_name       = "agendaconfig-a-test",
    allowed_origins = [
      "https://configportal-a-test.nationalenederlanden.davincicloud.nl",
      "https://configportal-a-test.nationalenederlanden.davincicloud.nl/*"
    ]
  },
   {
    service_name    = "mfe-productconfig",
    host_name       = "productconfig-a-test",
    allowed_origins = [
      "https://configportal-a-test.nationalenederlanden.davincicloud.nl",
      "https://configportal-a-test.nationalenederlanden.davincicloud.nl/*"
    ]
  },
  {
    service_name    = "mfe-financialconfigservice",
    host_name       = "financialconfigservice-a-test",
    allowed_origins = [
      "https://configportal-a-test.nationalenederlanden.davincicloud.nl",
      "https://configportal-a-test.nationalenederlanden.davincicloud.nl/*"
    ]
  },
  {
    service_name    = "mfe-appinstanceconfig",
    host_name       = "appinstanceconfig-a-test",
    allowed_origins = [
      "https://configportal-a-test.nationalenederlanden.davincicloud.nl",
      "https://configportal-a-test.nationalenederlanden.davincicloud.nl/*"
    ]
  },
  {
    service_name    = "mfe-accountingconfig",
    host_name       = "accountingconfig-a-test",
    allowed_origins = [
      "https://configportal-a-test.nationalenederlanden.davincicloud.nl",
      "https://configportal-a-test.nationalenederlanden.davincicloud.nl/*"
    ]
  },
  {
    service_name    = "mfe-taxstatementconfig",
    host_name       = "taxstatementconfig-a-test",
    allowed_origins = [
      "https://configportal-a-test.nationalenederlanden.davincicloud.nl",
      "https://configportal-a-test.nationalenederlanden.davincicloud.nl/*"
    ]
  },
   {
    service_name    = "mfe-runningaccountconfigservice",
    host_name       = "runningaccountconfigservice-a-test",
    allowed_origins = [
      "https://configportal-a-test.nationalenederlanden.davincicloud.nl",
      "https://configportal-a-test.nationalenederlanden.davincicloud.nl/*"
    ]
  },
 
  {
    service_name    = "mfe-communicationconfigservice",
    host_name       = "communicationconfigservice-a-test",
    allowed_origins = [
      "https://configportal-a-test.nationalenederlanden.davincicloud.nl",
      "https://configportal-a-test.nationalenederlanden.davincicloud.nl/*"
    ]
  },
  {
    service_name    = "mfe-collectionmeasureconfig",
    host_name       = "collectionmeasureconfig-a-test",
    allowed_origins = [
      "https://configportal-a-test.nationalenederlanden.davincicloud.nl",
      "https://configportal-a-test.nationalenederlanden.davincicloud.nl/*"
    ]
  },
  {
    service_name    = "mfe-planconfig",
    host_name       = "planconfig-a-test",
    allowed_origins = [
      "https://configportal-a-test.nationalenederlanden.davincicloud.nl",
      "https://configportal-a-test.nationalenederlanden.davincicloud.nl/*"
    ]
  },
  {
    service_name    = "app-shell",
    host_name       = "configportal-a-test",
    allowed_origins = [
      "https://not-needed"
    ]

    custom_connect_src = [
      # Cognito connection
      "https://cognito-idp.eu-west-1.amazonaws.com",
      "https://tst-close.auth.eu-west-1.amazoncognito.com",

      # Datadog
      "https://*.browser-intake-datadoghq.eu",

      # MFE URLs
      "https://*.nationalenederlanden.davincicloud.nl",

      # MFE APIs
      "https://gtog8jwo4i.execute-api.eu-west-1.amazonaws.com",
      "https://536xpokum1.execute-api.eu-west-1.amazonaws.com",
      "https://5kenw99hqe.execute-api.eu-west-1.amazonaws.com",
      "https://2flw5wdpq5.execute-api.eu-west-1.amazonaws.com",
      "https://2jxef2re9a.execute-api.eu-west-1.amazonaws.com",
      "https://8u03ynx3vi.execute-api.eu-west-1.amazonaws.com",
      "https://pcrj7qq8vk.execute-api.eu-west-1.amazonaws.com",
      "https://3jp323qt0g.execute-api.eu-west-1.amazonaws.com",
      "https://gaac5nkts8.execute-api.eu-west-1.amazonaws.com",
      "https://n7179naw2f.execute-api.eu-west-1.amazonaws.com",
      "https://tptvyofhol.execute-api.eu-west-1.amazonaws.com",
      "https://ugsg2t9ubg.execute-api.eu-west-1.amazonaws.com",
      "https://15mpuq4t4k.execute-api.eu-west-1.amazonaws.com"
    ]
    custom_img_src = "data:"    
  }
]

waf_enabled     = true
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
  # NN OFFICE
  "156.114.14.0/24"
]
