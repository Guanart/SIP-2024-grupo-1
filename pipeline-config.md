# Ajustes para migrar el pipeline

1. Configurar los secrets del repositorio.

```
BUCKET_NAME = lot_terraform_state
DOCKER_HUB_USERNAME = tu nombre usuario de dockerhub
DOCKER_HUB_PASSWORD = tu password o generás un access_token en dockerhub
GOOGLE_CLOUD_PROJECT_ID = nombre del proyecto GCP
GOOGLE_CLOUD_CREDENTIALS = contenido de credentials.json (service account key) de GCP
AUTH0_AUDIENCE = http://my-secure-api.com
AUTH0_CLIENT_ID = iyuPrwZdk5luJ2acToBBNnLY6YZEhDzo
AUTH0_CLIENT_SECRET = _epio19Bjc1s8iK00a-iMAEXHdcQmq1tKbQzAvtb9CWetgLpcNGFOuIJi0ulx4oz
AUTH0_DOMAIN = dev-f57qs7dbi1xcl5kj.us.auth0.com
AUTH0_SPA_CLIENT_ID = QDUde2yWkQWxGguu7p59G3QirNNpeXgl

# CLOUDFLARE_ZONE_ID =
# CLOUDFLARE_TOKEN =
```
