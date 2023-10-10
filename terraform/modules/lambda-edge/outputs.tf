output "arn" {
  value = module.lambda_at_edge_security_headers.lambda_function_arn
}

output "qualified_arn" {
  value = module.lambda_at_edge_security_headers.lambda_function_qualified_arn
}
