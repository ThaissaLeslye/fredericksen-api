resource "cloudflare_filter" "api_edge_filter" {
  zone_id     = var.cloudflare_zone_id
  description = "Block suspicious countries and malicious IPs based on threat score"
  paused      = false
  
  expression  = "(ip.geoip.country in {\"RU\" \"CN\" \"KP\" \"IR\"}) or (ip.threat_score >= 40)"
}

resource "cloudflare_firewall_rule" "api_block_rule" {
  zone_id     = var.cloudflare_zone_id
  description = "Apply block action to the edge filter"
  filter_id   = cloudflare_filter.api_edge_filter.id
  action      = "block" 
  priority    = 1
}