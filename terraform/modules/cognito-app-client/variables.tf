variable "app_name" {
  description = "The name of the application."
}

variable "cognito_user_pool_name" {
  description = "The name of the Cognito user pool, or null if you don't need to create an application client."
}

variable "callback_urls" {
  description = "The list of allowed callback URLs for the identity providers."
  type = list(string)
  default = []
}

variable "logout_urls" {
  description = "The list of allowed logout URLs for the identity providers."
  type = list(string)
  default = []
}

variable "allowed_oauth_flows" {
  description = "The allowed OAuth flows."
  type = list(string)
  default = ["code", "implicit"]
}

variable "allowed_oauth_scopes" {
  description = "The allowed OAuth scopes."
  type = list(string)
  default = ["email", "openid"]
}

variable "supported_identity_providers" {
  description = "The list of provider names for the identity providers that are supported on this client."
  type = list(string)
  default = ["COGNITO"]
}
