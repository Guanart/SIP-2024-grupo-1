# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_router_nat
# Crea un recurso NAT que traducirá las direcciones IP de origen de la subred privada de kubernetes. 
resource "google_compute_router_nat" "nat1" {
  name   = "nat1"
  router = google_compute_router.mainnetrouter.name
  region = var.region

  source_subnetwork_ip_ranges_to_nat = "LIST_OF_SUBNETWORKS"
  nat_ip_allocate_option             = "MANUAL_ONLY"

  subnetwork {
    name                    = google_compute_subnetwork.subnet.id
    source_ip_ranges_to_nat = ["ALL_IP_RANGES"]
  }

  nat_ips = [google_compute_address.nat1.self_link]
}

# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_address
# Crea una IP pública para ser utilizada en el NAT
resource "google_compute_address" "nat1" {
  name         = "nat1"
  address_type = "EXTERNAL"
  network_tier = "PREMIUM"

  depends_on = [google_project_service.compute]
}