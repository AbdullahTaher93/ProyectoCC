#!/bin/bash

az group create --name Prueba --location francecentral


az network nsg create --resource-group Prueba --location francecentral --name myNet
az network nsg rule create --resource-group Prueba --nsg-name myNet --name http --protocol tcp --priority 1000 --destination-port-range 80 --access allow
az network nsg rule create --resource-group Prueba --nsg-name myNet --name ssh --protocol tcp --priority 999 --destination-port-range 22 --access allow

IP=$(az vm create --resource-group Prueba --name CCproyecto --image Canonical:UbuntuServer:18.04-LTS:latest --admin-username antonio --generate-ssh-keys --nsg myNet | jq -r '.publicIpAddress')


ansible-playbook ./provision/playbook.yml -i $IP,
