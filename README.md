# ProyectoCC

### Problema

Hoy en dia cada vez mas gente aprovecha su tiempo libre para hacer ejercicio como correr o montar en bicicleta. Estas personas no suelen tener un control de datos sobre su ejercicio fisico, solo algunos servicios recogen datos como la ruta o la distancia recorrida.

### Tema propuesto

Desarrollar un servicio en la nube para el tracking de ciclistas o atletas en entrenamientos. Así como tambien diferentes parametros físicos.

### Arquitectura

El sistema esta formado por una arquitectura basada en microservicios. Cuenta con un servicio cloud en el que se almacenan los datos, el sistema de base de datos usado sera una base de datos no relacional en MongoDB. El sistema cuenta con un servicio de login en el que el usuario se registrara y el sistema automaticamente empezara a enviar datos a traves de una aplicacion movil. Desde esta, el usuario tambien puede ver los datos. El sistema tambien cuenta con una API REST la cual puede ser usada a traves de una pagina web para consulta de datos e historiales. El servicio generalmente esta escrito en Javascript pero no se descarta el usar otros lenguajes para otros modulos como Python.

##Despliege en PaaS

Hemos elegido como PaaS temporal para el despliegue de nuestra aplicacion Heroku. Se ha elegido este PaaS por lo simple que es de usar y permite desplegar cualquier aplicacion desde un repositorio de Github.

Como servicio de integracion se ha usado Travis. La razon de uso es la misma que la de Heroku: lo sencillo de usar. Basta con incluir un fichero .travis.yml. Para usarlo hay que enlazarlo con la cuenta de github.

Toda la informacion referente a este apartado y al microservicio desarrollado se encuentra en


[ESTE DOCUMENTO](./docs/Hito2.md)



despliegue https://evening-anchorage-70354.herokuapp.com
