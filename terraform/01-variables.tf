variable "credentials" {
  type    = string
  default = "credentials.json"
}

variable "project" {
  type    = string
  default = "" # Setear el ID del proyecto de GCP que vamos a utilizar para desplegar
}

variable "region" {
  type    = string
  default = "us-east1" 
}

variable "zone" {
  type    = string
  default = "us-east1-b" 
}

