kubectl apply -f namespaces.yml
kubectl apply -f config.yml

kubectl apply -f volumes/postgres-volume.yml
kubectl apply -f volumes/postgres-pvc.yml
kubectl apply -f deployments/postgres.yml
kubectl apply -f services/postgres-service.yml

sleep 30

kubectl apply -f deployments/backend.yml
kubectl apply -f services/backend-service.yml

sleep 30

kubectl apply -f deployments/frontend.yml
kubectl apply -f services/frontend-service.yml