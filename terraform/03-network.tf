
# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_network

# Crea una red 
resource "google_compute_network" "mainnet" {
  name                            = "mainnet"
  routing_mode                    = "REGIONAL"
  auto_create_subnetworks         = false
  mtu                             = 1460
  delete_default_routes_on_create = false

  depends_on = [
    google_project_service.compute,
    google_project_service.container
  ]
}