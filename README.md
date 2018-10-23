# ProyectoCC

## Problema

Hoy en dia cada vez mas gente aprovecha su tiempo libre para hacer ejercicio como correr o montar en bicicleta. Estas personas no suelen tener un control de datos sobre su ejercicio fisico, solo algunos servicios recogen datos como la ruta o la distancia recorrida.

### Tema propuesto

Desarrollar un servicio en la nube para el tracking de ciclistas o atletas en entrenamientos. Así como tambien diferentes parametros físicos.

## Arquitectura

El sistema esta formado por una arquitectura basada en microservicios. Cuenta con un servicio cloud en el que se almacenan los datos, el sistema de base de datos usado sera una base de datos no relacional en MongoDB. El sistema cuenta con un servicio de login en el que el usuario se registrara y el sistema automaticamente empezara a enviar datos a traves de una aplicacion movil. Desde esta, el usuario tambien puede ver los datos. El sistema tambien cuenta con una API REST la cual puede ser usada a traves de una pagina web para consulta de datos e historiales. El servicio generalmente esta escrito en Javascript pero no se descarta el usar otros lenguajes para otros modulos como Python .


