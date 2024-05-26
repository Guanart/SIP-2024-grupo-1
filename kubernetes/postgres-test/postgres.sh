# https://cloudnative-pg.io/documentation/1.23/quickstart/
# https://cloudnative-pg.io/documentation/1.23/samples/cluster-example-full.yaml
# https://cloudnative-pg.io/documentation/1.23/samples/

# Instalar CloudNativePG
kubectl apply --server-side -f \
  https://raw.githubusercontent.com/cloudnative-pg/cloudnative-pg/release-1.23/releases/cnpg-1.23.1.yaml

# Verificar que el operator se haya levantado
kubectl get deployment -n cnpg-system cnpg-controller-manager

# Credenciales de conexión
DB_USERNAME = kubectl get secret postgres-cluster-superuser -o jsonpath="{.data.username}" | base64 --decode
DB_PASSWORD = kubectl get secret postgres-cluster-superuser -o jsonpath="{.data.password}" | base64 --decode
