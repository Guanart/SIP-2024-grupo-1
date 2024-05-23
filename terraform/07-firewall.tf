# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/compute_firewall
resource "google_compute_firewall" "allow-5173" {
  name    = "allow-5173"
  network = google_compute_network.main.name

  allow {
    protocol = "tcp"
    ports    = ["5173"]
  }

  source_ranges = ["0.0.0.0/0"]
}

resource "google_compute_firewall" "allow-3000" {
  name    = "allow-3000"
  network = google_compute_network.main.name

  allow {
    protocol = "tcp"
    ports    = ["3000"]
  }

  source_ranges = ["0.0.0.0/0"]
}