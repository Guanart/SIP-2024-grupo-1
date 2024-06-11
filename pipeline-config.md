# Ajustes para migrar el pipeline

1. Configurar los secrets del repositorio.

```
BUCKET_NAME = lot_terraform_state
DOCKER_HUB_USERNAME =
DOCKER_HUB_PASSWORD =
GOOGLE_CLOUD_PROJECT_ID =
GOOGLE_CLOUD_CREDENTIALS =
AUTH0_AUDIENCE =
AUTH0_CLIENT_ID =
AUTH0_CLIENT_SECRET =
AUTH0_DOMAIN =
AUTH0_SPA_CLIENT_ID =

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

3. Configurar el webdriver de Selenium con la IP del servicio del frontend

```
chrome_options.add_argument("--unsafely-treat-insecure-origin-as-secure=http://<IP_FRONTEND>:5173")
driver.get("http://<IP_FRONTEND>:5173/")
```

4. Configurar las environments de Newman con la IP del servicio del backend

```
"values": [
	{
		"key": "base_url",
		"value": "http://<IP_BACKEND>:3000",
		"type": "default",
		"enabled": true
	}
],
```

5. Actualizar .env.prod con la IP del backend

```
APP_BACKEND_HOST="<BACKEND_SERVICE_IP>"
```

6. Configurar la imagen docker a utilizar en deployments de `backend` y `frotend` dentro de `kubernetes/applications`

```
image: ' '
```
