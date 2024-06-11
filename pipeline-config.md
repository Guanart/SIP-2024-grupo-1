# Ajustes para migrar el pipeline

1. Configurar los secrets del repositorio.

```
BUCKET_NAME = lot_terraform_state
DOCKER_HUB_USERNAME =
DOCKER_HUB_PASSWORD =
GOOGLE_CLOUD_PROJECT_ID =
GOOGLE_CLOUD_CREDENTIALS =
AUTH0_AUDIENCE =
AUTH0_CLIENT_ID = # Client ID de la API de Auth0
AUTH0_CLIENT_SECRET = # Client ID de la API de Auth0
AUTH0_DOMAIN =
AUTH0_SPA_CLIENT_ID = # Client ID de la SPA de Auth0

# CLOUDFLARE_ZONE_ID =
# CLOUDFLARE_TOKEN =
```

2. Configurar la variable `project` en `terraform/01-variables.tf`.

```
variable "project" {
  type    = string
  default = "" # Setear el ID del proyecto de GCP que vamos a utilizar para desplegar
}
```

3. Configurar la imagen docker a utilizar en deployments de `backend` y `frotend` dentro de `kubernetes/applications`

```
image: ' '
```
