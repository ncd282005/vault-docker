
# backend-policy.hcl
path "secret/data/mongo" {
  capabilities = ["read"]
}

path "secret/metadata/mongo" {
  capabilities = ["read"]
}
