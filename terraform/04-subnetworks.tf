# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_subnetwork

# Crea una subred privada en la red "main" para colocar los workers del cluster de k8s
resource "google_compute_subnetwork" "subnet" {
  name                     = "subnet"
  ip_cidr_range            = "10.0.0.0/18"
  region                   = var.region
  network                  = google_compute_network.mainnet.id # VPC creada
  private_ip_google_access = true

  secondary_ip_range {
    range_name    = "k8s-applications-range"
    ip_cidr_range = "10.48.0.0/14"
  }

  secondary_ip_range {
    range_name    = "k8s-services-range"
    ip_cidr_range = "10.52.0.0/20"
  }
}