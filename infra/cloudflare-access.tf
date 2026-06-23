resource "cloudflare_access_application" "api_gateway" {
  zone_id                   = var.cloudflare_zone_id
  name                      = "Fredericksen API Gateway Protection"
  domain                    = "rick-api.tllo.app"
  type                      = "self_hosted"
  session_duration          = "2h"
  allowed_idps              = [var.cloudflare_google_idp_id]
  auto_redirect_to_identity = true
}

resource "cloudflare_access_policy" "api_allow_policy" {
  application_id = cloudflare_access_application.api_gateway.id
  zone_id        = var.cloudflare_zone_id
  name           = "Allow Only Verified Team"
  precedence     = 1
  decision       = "allow"

  include {
    email_domain = ["fredericksen.local"]
  }
}

resource "cloudflare_access_application" "api_health_gateway" {
  zone_id                   = var.cloudflare_zone_id
  name                      = "Fredericksen API Healthcheck Public Path"
  domain                    = "rick-api.tllo.app/health"
  type                      = "self_hosted"
  session_duration          = "2h"
  auto_redirect_to_identity = false
}

resource "cloudflare_access_policy" "health_bypass_policy" {
  application_id = cloudflare_access_application.api_health_gateway.id
  zone_id        = var.cloudflare_zone_id
  name           = "Bypass for External Monitoring Tools"
  precedence     = 1
  decision       = "bypass"

  include {
    everyone = true
  }
}