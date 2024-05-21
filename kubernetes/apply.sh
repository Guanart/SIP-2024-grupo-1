kubectl apply -f postgres-volume.yml
kubectl apply -f postgres-pvc.yml
kubectl apply -f postgres.yml
kubectl apply -f postgres-service.yml

sleep 20

kubectl apply -f backend.yml
kubectl apply -f backend-service.yml

sleep 20

kubectl apply -f frontend.yml
kubectl apply -f frontend-service.yml