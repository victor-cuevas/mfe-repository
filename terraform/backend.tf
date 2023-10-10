terraform {
  backend "s3" {
    bucket = "portals-tfm-state-288294394121"
    # key            = # will be set by GH workflow from configuration variable
    region         = "eu-west-1"
    dynamodb_table = "github-state-lock"
    encrypt        = "true"
  }
}
