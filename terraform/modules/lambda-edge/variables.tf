variable "service_name" {
  type = string
}


variable "stage" {
  type = string
}

variable "lambda_runtime" {
  default = "nodejs16.x"
}
