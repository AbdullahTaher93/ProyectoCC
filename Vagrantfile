Vagrant.configure('2') do |config|
  config.vm.box = 'azure'

  # cargamos la clave ssh
  config.ssh.private_key_path = '~/.ssh/id_rsa'
  config.vm.provider :azure do |azure, override|

    # VARIABLES OBLIGATORIAS
    azure.tenant_id = ENV['AZURE_TENANT_ID']
    azure.client_id = ENV['AZURE_CLIENT_ID']
    azure.client_secret = ENV['AZURE_CLIENT_SECRET']
    azure.subscription_id = ENV['AZURE_SUBSCRIPTION_ID']

    # OPCIONALES
    azure.vm_name="hito5"
    azure.admin_username="antonio"
    azure.vm_image_urn="Canonical:UbuntuServer:18.04-LTS:latest"
    azure.location="westeurope"
    azure.resource_group_name="CC"
    azure.nsg_name="myNet"
    azure.tcp_endpoints = 80


  end
  #provisionamos
  config.vm.provision "ansible" do |ansible|
    ansible.verbose = "v"
    ansible.playbook = "./provision/playbook.yml"
  end
end