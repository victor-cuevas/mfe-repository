variable "aws_account_id" {
  type = string
}

variable "service_name" {
  type = string
}

variable "host_name" {
  type = string
}

variable "allowed_origins" {
  type = list(string)
}

variable "environment" {
  type = string
}

variable "certificate_arn" {
  type = string
}

variable "domain" {
  type = string
}

variable "custom_connect_src" {
  type    = list(string)
  default = []
}

variable "custom_font_src" {
  type    = string
  default = ""
}

variable "custom_img_src" {
  type    = string
  default = ""
}

variable "skip_lambda_edge" {
  type    = bool
  default = false
}

variable "lambda_edge_qualified_arn" {
  type    = string
  default = null
}

variable "web_acl_id" {
  type    = string
  default = null
}

variable "custom_frame_src" {
  type    = string
  default = ""
}
