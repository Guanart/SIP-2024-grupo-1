# Ajustes para configurar el pipeline

1. Configurar los secrets del repositorio

```
BUCKET_NAME = lot_terraform_state
DOCKER_HUB_USERNAME =
DOCKER_HUB_PASSWORD =
GOOGLE_CLOUD_PROJECT_ID =
GOOGLE_CLOUD_CREDENTIALS =
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

5. Actualizar la variable `BACKEND_HOST` en `frontend/env.prod` con la IP pública del backend

```
APP_BACKEND_HOST="<IP_BACKEND>"
```

6. Configurar la imagen docker a utilizar en deployments de `backend` y `frontend` dentro de `kubernetes/applications`

```
image: ' '
```

7. Crear IP estática para el frontend y configurar el frontend-service.yml

```sh
   gcloud compute addresses create lot-frontend --region us-east1 # Misma región donde se crea el cluster
   gcloud compute addresses list | grep lot-frontend # Obtener la IP
```

```yml
loadBalancerIP: <RESERVED_IP>
```

8. Configurar los endpoints en Auth0 dashboard
