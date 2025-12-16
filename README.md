Para ejecutar el programa seguir los siguientes pasos :

1. Descargar el código, ya sea con un Git Clone o mediante ZIP

2. Configurar la base de datos

    Tener instalado MySQL o XAMPP y asegurarse de que el servicio de MySQL esté en ejecución.
    Abrir tu cliente de base de datos preferido (phpMyAdmin, MySQL Workbench o línea de comandos).
    Ejecutar el script "thisisthewaydb.sql" (ubicado en la carpeta "/database") para crear y cargar la base de datos.

3. Cambiar las variables que sean necesarias en el archivo .env (por ejemplo el puerto 125 puede estar ocupado en tu maquina o queres que envie emails automáticos desde una dirección mail especifica)

4. Una vez descargado, doble click en "Iniciar servidor.bat" (esto ejecutara un comando en Windows que iniciará el programa. También es necesario tener instalado NodeJS)

5. En algún navegador web, poner como URL lo siguiente: localhost:125 (esto si no se modifico el número de puerto en el .env)

6. El script .sql de la base de datos ya tiene cargado datos de prueba para que puedas probarlo. Tiene un usuario con nombre "admin" y contraseña "1234" para que puedas probar todas las funciones