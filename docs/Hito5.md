# Hito 5

En este hito se ha realizado la orquestación con Vagrant. Además se ha ampliado la funcionalidad del proyecto, añadiendo un servicio de login usando diferentes frameworks de NodeJS.

## Servicio de login

Se ha desarrollado un servicio de login en nuestra aplicación. Para ello, se han implementado diversos archivos que se explican a continuación.

El servicio de login se "estructura" en tres directorios por asi decirlo:

* models: En este directorio se encuentra el fichero que indica la estructura de la entidad usuario.

* config: En este directorio se encuentra el middleware usado para el servicio de login.

* routes: En este directorio se encuentran las rutas que el usuario tiene que acceder para crear usuario, registrarse, etc.

Cuando el usuario se registra, se genera un token que sirve para luego navegar por las rutas de nuestra aplicación y acceder a algunas rutas específicas.

Los usuarios se almacenan en una base de datos mongo y se usa el framework Passport.js como middlware de autenticación. Se ha usado este framework por su capacidad de integración con Express.

En el modelo de usuario se ha usado JWT (JSON Web Token) y crypto para generar un hash y un salt de las contraseñas recibidas. Estas luego se usarán para validar el usuario.

En passport.js se comprobarán los tokens del usuario.

Por otra parte. En routes, tenemos el archivo auth.js, este recibirá el token desde la cabecera de la petición. Esto nos servirá para la navegación de un usuario ya registrado.

Por último en el archivo users.js tenemos las diferentes rutas que podemos acceder. La ruta por defecto nos creará un nuevo usuario. En la ruta login, un usuario previamente registrado podrá logearse. Y por último en la ruta current, solo los usuarios que estan registrados podran acceder.

Veamos su funcionamiento realizando peticiones.

Las peticiones se han realizado con la herramienta Postman, ya que permite realizar peticiones complejas de forma muy sencilla.

En esta imagen se ve que se ha realizado una petición POST a la ruta /api/users con el cuerpo del mensaje un JSON con el usuario y la contraseña.
Abajo vemos la respuesta con el token devuelto y la id del usuario.

![alt text](./img/creacion.png)


En la siguiente imagen se ve como se realiza una petición post a la ruta api/users/login para el logeo del usuario.

![alt text](./img/logeo.png)


Una vez registrados, podemos acceder a la URL restringida a usuarios registrados. Nos devuelve el usuario.

![alt text](./img/acceso.png)

Por último, vemos que si metemos los credenciales incorrectos, el login falla.

![alt text](./img/fallo.png)


## Orquestación con Vagrant


La orquestación se ha realizado con con vagrant, ya que es la herramienta que más uso tiene en este apartado.

Para comenzar debemos de instalarla, seguidamente debemos de preparar la herramienta para su uso con Azure. Para ello, se ha seguido [el getting started del reposotorio oficial de azure en github.](https://github.com/Azure/vagrant-azure)

Primero hacemos el login con azure, yo ya lo tengo hecho del hito anterior. Elegimos la nueva suscripción y ejecutamos el siguiente comando para crear un directorio de aplicacion activo de azure con acceso al gestor de recursos:

```
az ad sp create-for-rbac

```

![alt text](./img/suscripcion.png)

Estos valores devueltos nos van a hacer falta para nuestro Vagrantfile.


Ahora, instalamos el plugin de azure en vagrant con:

```
$ vagrant box add azure https://github.com/azure/vagrant-azure/raw/v2.0/dummy.box --provider azure
$ vagrant plugin install vagrant-azure

```

![alt text](./img/plugin.png)

Ahora procedemos a la creacion del archivo Vagrantfile

#### Vagrantfile


A continuación se muestra el archivo del Vagranfile.

Antes de su ejecución, se deben de declarar las variables de AZURE_TENTANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, AZURE_SUBSCRIPTION_ID como varibles de entorno y darle el valor que nos ha salido antes con la orden *az ad sp create-for-rbac*

Para la ID de la subscripción, debemos de ejecutar el siguiente comando:

```
az account list --query "[?isDefault].id" -o tsv
```


El archivo de Vagranfile, se puede encontrar en [este enlace](./../orquestacion/Vagrantfile), comienza creando un box de azure y acaba con la provisión de dos máquinas virtuales:

```
Vagrant.configure('2') do |config|


  config.vm.define "database" do |database|
    database.vm.box = 'azure'
    database.ssh.private_key_path = '~/.ssh/id_rsa'
    database.vm.provider :azure do |azure, override|

      # VARIABLES OBLIGATORIAS
      azure.tenant_id = ENV['AZURE_TENANT_ID']
      azure.client_id = ENV['AZURE_CLIENT_ID']
      azure.client_secret = ENV['AZURE_CLIENT_SECRET']
      azure.subscription_id = ENV['AZURE_SUBSCRIPTION_ID']

      # OPCIONALES
      azure.vm_name="hito5-database"
      azure.admin_username="antonio"
      azure.vm_image_urn="Canonical:UbuntuServer:18.04-LTS:latest"
      azure.location="westeurope"
      azure.resource_group_name="CC"

      azure.tcp_endpoints = 27017
      azure.virtual_network_name="redprivada"


    end
    #provisionamos
    database.vm.provision "ansible" do |ansible|
      ansible.compatibility_mode = "2.0"
      ansible.verbose = "v"
      ansible.playbook = "./playbook-database.yml"
    end
  end

  config.vm.define "app" do |app|
    app.vm.box = 'azure'
    app.ssh.private_key_path = '~/.ssh/id_rsa'
    app.vm.provider :azure do |azure, override|

      # VARIABLES OBLIGATORIAS
      azure.tenant_id = ENV['AZURE_TENANT_ID']
      azure.client_id = ENV['AZURE_CLIENT_ID']
      azure.client_secret = ENV['AZURE_CLIENT_SECRET']
      azure.subscription_id = ENV['AZURE_SUBSCRIPTION_ID']

      # OPCIONALES
      azure.vm_name="hito5-app"
      azure.admin_username="antonio"
      azure.vm_image_urn="Canonical:UbuntuServer:18.04-LTS:latest"
      azure.location="westeurope"
      azure.resource_group_name="CC"

      azure.tcp_endpoints = [80,27017]
      azure.virtual_network_name="redprivada"

    end
    #provisionamos
    app.vm.provision "ansible" do |ansible|
      ansible.compatibility_mode = "2.0"
      ansible.verbose = "v"
      ansible.playbook = "./playbook-app.yml"
    end
  end

end


```

Primeramente se exporta la clave ssh para poder acceder, luego se les da valor a las variables obligatorias previamente comentadas, y por último las opcionales, que tienen que ver con los parametros de la máquina virtual.

Existen muchos parametros a configurar, pero solo me he centrado en los que en hitos anteriores he usado, como la localización, el grupo de seguridad de red, la apertura de puertos, la imagen y el usuario. La justificacion de la eleccion de la imagen y del grupo de recursos ya se han expuesto en hitos anteriores. Los demás valores se han dejado por defecto, como el almacenamiento.

Se crean dos máquinas, una de ellas tiene la base de datos a la que accede nuestra aplicación y la otra la aplicacion propiamente dicha a la cual accedemos. Para provisionarlas se han creado dos archivos de provisionamiento diferentes. Es importante el orden de creación. Primero la base de datos y luego la aplicación. Ya que de esta forma cuando la aplicación se inicia tiene la base de datos ya creada, si lo accedmos al reves la conexion de la aplicacion a la base de datos fallará.

Destacar, que en la maquina virtual de la base de datos solo se ha puesto el puerto 27017 correspondiente a mongo. En la máquina virtual de la aplicación se abren el puerto 80 y 27017. Esta apertura de puertos es lo lógico, ya que la de base de datos solo se quiere utilizar para ese proposito y la de aplicación se utiliza para hacer peticiones http y debe de realizar consultas a la base de datos contenida en la otra máquina. Por último, se crea una red con el mismo nombre en las dos, esto hace que las dos máquinas esten en la misma subred y puedan acceder entre ellas, azure por defecto asigna a la primera maquina la IP 10.0.0.4 y a la segunda la IP 10.0.0.5. Esto se indica en la aplicación para decirle la ruta de conexión de la base de datos.



### Cambios en los archivos de provision

Principalmente, el cambio más sustancial es dividir el playbook original en dos. En el [playbook de la aplicación](./../orquestacion/playbook-app.yml) quitamos todo lo referente a la base de datos y lo metemos en el [playbook de la base de datos](./../orquestacion/playbook-database.yml).

El playbook de la app lo dejamos igual, ahora tenemos que añadir en el playbook de la base de datos la configuracion de mongo para que se pueda acceder remotamente. Para ello solo tenemos que usar el siguiente comando antes de ejecutar la app:

```
sed -i 's/127.0.0.1/0.0.0.0/g' /etc/mongod.conf
```

Esto lo que hace es usar el comando sed, que busca cadenas que coincidan con expresiones regulares que se les pase y la sustituye por otra expresion en el fichero de configuracion de mongo. Se sustituye por 0.0.0.0 para que escuche de todas las IPs que le lleguen. Por último, se abre el puerto correspondiente a mongo,(no deberia de ser necesario ya que eso se indica en el Vagrantfile, pero no me funcionaba si no lo hacia, en la vm de la aplicación no abro ningun puerto con el playbook y me funciona). Me he servido de [esta web](https://www.mkyong.com/mongodb/mongodb-allow-remote-access/) para justificar estos cambios.




Para lanzar el archivo de vagrantfile solo basta con ejecutar el siguiente comando usando este flag como se indica en [este issue](https://github.com/Azure/vagrant-azure/issues/213):


```
vagrant up --no-parallel

```

Con esto realizamos tanto la creación de la máquina virtual como de su provisionamiento. Podemos acceder a la maquina vitual con:

```
vagrant ssh app
```

para la máquina de la aplicacion, o

```
vagrant ssh database

```

para la máquina de la base de datos.


![alt text](./img/ssh.png)


El provisiomaniento tambien se puede hacer con:

```
vagrant provision app
```
para provisionar la máquina donde corre la aplicación o con

```
vagrant provision database
```

para provisionar la aplicación donde corre la base de datos.
Esta es la salida de provisionar la máquina app:

![alt text](./img/salida1.png)
![alt text](./img/salida2.png)
![alt text](./img/salida3.png)
![alt text](./img/salida4.png)
He puesto estas últimas dos capturas en vez de poner la salida del *vagrant up* porque el vagrant up me muestra una salida vacia, aunque la ejecución es la correcta.

Por último, hacemos una peticion a la IP.
![alt text](./img/muestra.png)

## Comprobacion compañero

Se ha comprobado el Vagrantfile de los compañeros Jesus Mesa Gonzalez y Alex Grimm. Se muestra la ejecución del vagrant up pero en mi caso no se ve la salida del vagrant, solo la salida de la parte de ansible.

#### Jesus Mesa

Se ha usado el Vagrantfile y los playbooks ubicados en [esta dirección](https://github.com/mesagon/Proyecto-CC-MII/tree/master/orquestacion).

Se ha cambiado el nombre de las máquinas virtuales, para que no establezca la misma DNS, así nos evitamos problemas.

Se ha procedido a la ejecucion con el comando:

```
vagrant up --no-parallel
```

Esta es la salida:

![alt text](./img/jesus1.png)
![alt text](./img/jesus2.png)
![alt text](./img/jesus3.png)
![alt text](./img/jesus4.png)
![alt text](./img/jesus5.png)
![alt text](./img/jesus6.png)
![alt text](./img/jesus7.png)
![alt text](./img/jesus8.png)
![alt text](./img/jesus9.png)


Accedemos a la URL para ver si funciona y este es el resultado:

![alt text](./img/jesusoutput.png)

#### Alex Grimm

Se ha usado el Vagrantfile y los playbooks ubicados en [esta direccion](https://github.com/alex1ai/ugr-master-cc/tree/master/orquestacion).

Se ha cambiado el nombre de las maquinas virtuales, para que no establezca la misma DNS, así nos evitamos errores.

Se ha procedido a la ejecucion con el comando:

```
vagrant up --no-parallel
```
Esta es la salida:

![alt text](./img/alex1.png)
![alt text](./img/alex2.png)
![alt text](./img/alex3.png)
![alt text](./img/alex4.png)
![alt text](./img/alex5.png)
![alt text](./img/alex6.png)
![alt text](./img/alex7.png)
![alt text](./img/alex8.png)


Aqui podemos ver la salida de su IP

![alt text](./img/salidaalex.png)
