# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_router

resource "google_compute_router" "mainnetrouter" {
  name    = "mainnetrouter"
  region  = var.region
  network = google_compute_network.mainnet.id
}