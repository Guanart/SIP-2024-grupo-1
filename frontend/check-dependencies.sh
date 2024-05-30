#!/bin/bash

# Executes npm audit and save the result (first line)
audit_output=$(npm audit | head -n 1)

expected="found 0 vulnerabilities"

if [ "$audit_output" != "$expected" ]; then
    echo "Error: vulnerabilities found"
    exit 1
fi

# outdated_output=$(npm outdated)

# if [ $(echo "$outdated_output" | wc -l) -gt 1 ]; then
#     echo "Error: Se encontraron paquetes desactualizados."
#     echo "$outdated_output"
#     exit 1
# fi

echo "Dependencies OK."