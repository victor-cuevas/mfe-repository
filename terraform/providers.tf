provider "aws" {
  region = "eu-west-1"

  assume_role {
    role_arn     = local.aws_provider_assume_role_arn
    session_name = "terraform"
  }
}

provider "aws" {
  alias  = "network-us-east-1"
  region = "us-east-1"

  assume_role {
    role_arn     = local.aws_provider_assume_role_arn
    session_name = "terraform"
  }
}
