#!/bin/bash

# Obtener la IP del frontend del primer argumento
FRONTEND_IP=$1

# Establecer la variable de entorno FRONTEND_IP
export FRONTEND_IP=$FRONTEND_IP


python3 login.py \ 
python3 account-edit.py \ 
python3 list-marketplace.py  \ 
python3 delete-marketplace-publication.py  \
python3 create-marketplace-publication.py  \ 
python3 list-fundraising.py  \ 
python3 update-fundraising.py  \ 
python3 start-fundraising.py