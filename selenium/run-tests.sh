#!/bin/bash

# Obtener la IP del frontend del primer argumento
FRONTEND_IP=$1

# Establecer la variable de entorno FRONTEND_IP
export FRONTEND_IP=$FRONTEND_IP

python3 selenium/login.py
python3 selenium/account-edit.py
python3 selenium/list-marketplace.py
python3 selenium/delete-marketplace-publication.py
python3 selenium/create-marketplace-publication.py
python3 selenium/list-fundraising.py
python3 selenium/update-fundraising.py
python3 selenium/start-fundraising.py