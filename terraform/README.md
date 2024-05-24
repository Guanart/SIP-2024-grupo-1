# Pasos para crear la infraestructura en GCP

1. Generar el archivo `credentials.json` y ubicarlo en la raiz de este directorio. Por otro lado, en el archivo `variables.tf` ingresar el ID del proyecto GCP.

```
variable "project" {
  type    = string
  default = "" # Setear el ID del proyecto de GCP que vamos a utilizar para desplegar
}
```

2. Inicializar el estado de terraform ejecutando el siguiente comando:

```bash
# El bucket debe estar creado previamente en el proyecto GCP.
terraform init --reconfigure --backend-config "bucket=terraform_state_cloud" --backend-config "prefix=lot_cluster/state"
```

3. Iniciar el proceso de creación verificando que todo este en orden ejecutando un `plan` y posteriormente aplicando los cambios:

```bash
terraform plan
terraform apply --auto-approve
```

4. Una vez finalizado obtener la metadata del cluster Kubernetes creado, ejecutando el siguiente comando de gcloud:

```bash
 gcloud container clusters get-credentials lot --region=us-east1-b
```

5. Para destruir la infraestructura desplegada, ejecutar el siguiente comando:

```bash
terraform destroy --auto-approve
```
