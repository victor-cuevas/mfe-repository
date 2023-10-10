module "microfrontend" {
  source = "./modules/tfm-microfrontends"

  providers = {
    aws.network = aws.network-us-east-1
  }

  count = length(var.microfrontends)

  aws_account_id  = var.aws_account_id
  service_name    = var.microfrontends[count.index].service_name
  host_name       = var.microfrontends[count.index].host_name
  allowed_origins = try(var.microfrontends[count.index].allowed_origins, [])

  environment     = local.infrastructure_name
  certificate_arn = var.certificate_arn
  domain          = var.domain

  custom_connect_src        = try(var.microfrontends[count.index].custom_connect_src, [""])
  custom_img_src            = try(var.microfrontends[count.index].custom_img_src, "")
  custom_font_src           = try(var.microfrontends[count.index].custom_font_src, "")
  custom_frame_src          = try(var.microfrontends[count.index].custom_frame_src, "")
  skip_lambda_edge          = var.create_lambda_edge ? try(var.microfrontends[count.index].skip_lambda_edge, false) : true
  lambda_edge_qualified_arn = var.create_lambda_edge ? module.lambda_edge[0].qualified_arn : null
  web_acl_id                = var.waf_enabled ? (try(var.microfrontends[count.index].disable_waf, false) ? null : module.waf[0].web_acl_arn) : null
}
