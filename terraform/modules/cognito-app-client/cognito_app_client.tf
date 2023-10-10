
resource "aws_cognito_user_pool_client" "userpool_client" {
  name                                 = var.app_name
  user_pool_id                         = tolist(data.aws_cognito_user_pools.user_pool.ids)[0]
  callback_urls                        = var.callback_urls
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = var.allowed_oauth_flows
  allowed_oauth_scopes                 = var.allowed_oauth_scopes
  supported_identity_providers         = var.supported_identity_providers
}
