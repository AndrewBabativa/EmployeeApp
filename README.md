# EmployeeApp - Backend

## 📌 Descripción  
Este proyecto es el backend de **EmployeeApp**, una aplicación para la gestión de empleados.  
Está desarrollado con **NestJS y TypeScript**, siguiendo principios de arquitectura limpia y buenas prácticas de desarrollo.  

## 🚀 Tecnologías utilizadas  

### Backend  
El backend está desarrollado en **Node.js** con **NestJS** y **MongoDB Atlas**. A continuación, se detallan las razones por las cuales se eligieron estas tecnologías:  

- **NestJS** - Framework backend basado en Node.js que sigue principios de arquitectura escalable y reutilizable, facilitando la inyección de dependencias y la organización del código.  
- **TypeScript** - Lenguaje con tipado estático que mejora la mantenibilidad del código.  
- **MongoDB Atlas** -  Base de datos NoSQL en la nube que ofrece escalabilidad y flexibilidad para manejar documentos JSON de manera eficiente. Además, proporciona alta disponibilidad y seguridad gestionada.
- **Mongoose** - ODM para MongoDB que facilita la modelación y validación de datos.  
- **JWT** - Autenticación basada en tokens.  
- **Bcrypt** - Encriptación de contraseñas.  
- **Swagger** - Documentación de API.  

## 📥 Instalación y Ejecución  

### 🔧 Requisitos previos  
- **Node.js 16+**  
- **MongoDB Atlas** (se debe configurar una conexión a la base de datos)  

## Conexión a MongoDB Compass

Para conectarte a la base de datos `test` en MongoDB Compass, sigue estos pasos:

1. Abre MongoDB Compass.
2. En la pantalla principal, haz clic en **New Connection**.
3. Ingresa la cadena de conexión en el formato:
   ```
   mongodb+srv://bgandrew69:andrew2025@cluster0.onafx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
4. Haz clic en **Connect**.

## Estructura de las Colecciones

Dentro de la base de datos `test`, hay dos colecciones principales: `employees` y `users`.

### Colección: `employees`
Almacena información de los empleados. Su estructura es la siguiente:

```json
{
  "_id": "67da7925e330adc785b83241",
  "firstName": "Yenny",
  "lastName": "Jimenez",
  "jobTitle": "sw admin",
  "birthDate": "2025-02-25T00:00:00.000+00:00",
  "email": "mona@yahoo.com",
  "createdBy": "67da758fbc82f23dfc70b578", // UID del usuario de la colección `users` que creó el empleado
  "__v": 0
}
```

### Colección: `users`
Almacena información de los usuarios registrados. Su estructura es la siguiente:

```json
{
  "_id": "67d7c1f76dd8029496622135",
  "firstName": "Andrés",
  "lastName": "Pérez",
  "email": "andres.perez@example.com",
  "password": "$2b$10$Q4bF6FEIeq6/XAKQwDdVfuuwiRQeaO/Em.v3haYZ4l17RoNzJTVVW",
  "__v": 0
}
```

La contraseña en la colección `users` está encriptada usando `bcrypt` para mayor seguridad.


### 📌 Clonar el repositorio  
```sh
  git clone [https://github.com/tu-repositorio.git](https://github.com/AndrewBabativa/EmployeeApp.git)
```

### ⚙️ Configurar variables de entorno  
Crear un archivo `.env` en la raíz del backend con la siguiente información:  
```env
PORT=3000
MONGO_URI=mongodb+srv://bgandrew69:andrew2025@cluster0.onafx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=super_secret_andrew_2025
JWT_EXPIRATION_TIME=3600
API_URL_POSITIONS=https://ibillboard.com/api/positions
```

### 📦 Instalación de dependencias  
```sh
npm install
```

### ▶️ Ejecutar el backend  
```sh
npm run start
```

## 📡 API Endpoints  

### 🔑 Autenticación  
- **POST /auth/register** - Registro de usuario  
- **POST /auth/login** - Inicio de sesión y obtención de JWT  

### 👥 Gestión de Empleados  
- **GET /employees** - Listar empleados  
- **POST /employees** - Crear empleado  
- **PUT /employees/:id** - Actualizar empleado  
- **DELETE /employees/:id** - Eliminar empleado  

### 🏢 Posiciones de Trabajo  
- **GET /positions** - Obtener listado de posiciones desde API externa  

## 🧪 Pruebas Unitarias  
Ejecutar pruebas unitarias con el siguiente comando:  
```sh
npm run test
```

### 📊 Cobertura de Pruebas  

Se genera un coverage de 74%

![image](https://github.com/user-attachments/assets/206e3716-83c4-4e05-8a76-6a2cea6eb86f)

## 📑 Documentación API  
Para visualizar la documentación interactiva en Swagger:  
```sh
http://localhost:3000/api
```

## 🔒 Consideraciones de Seguridad  
- Tokens JWT con expiración.  
- Hash de contraseñas con **bcrypt**.  

## Pruebas Postman 

La colección de postman con todos los servicios disponibles y la configuración de los JWT tokens esta en la raiz del proyecto en la ruta:

- ./docs/postman/Employee.postman_collection.json

#### Autenticación

📌 Registrar un nuevo usuario

![image](https://github.com/user-attachments/assets/b3671b53-2569-46bf-a27b-277e3ddb5f30)

📌 Iniciar sesión

![image](https://github.com/user-attachments/assets/fd935ac4-5f02-4eac-86cf-a8cc3d656bb8)

#### Crud Empleados

📌 Crear un nuevo empleado

Al momento de generar un login correcto, el token JWT que devuelve el servicio de logueo se guarda en una variable global en Postman:

![image](https://github.com/user-attachments/assets/0b73ccc6-a550-4ff2-a63a-0bcb8abd3677)

Y al momento de enviar la petición se envia estos parametros obligatorios y debe retornar un código 200 con el _id de mongoose
* Nota: El jobTitle debe existir en el servicio https://ibillboard.com/api/positions

![image](https://github.com/user-attachments/assets/637a0487-1fac-4766-bf33-e36b33e04c0e)

📌 Actualizar un empleado por ID

Para continuar el flujo se podría tomar el _id con el que se creo el empleado anteiormente y remplazarlo 

![image](https://github.com/user-attachments/assets/4e877168-8df5-43ae-a67b-c76e4cf37739)

📌 Obtener todos los empleados

![image](https://github.com/user-attachments/assets/324da1fa-fc4b-489b-95bc-c79b99349b95)

📌 Obtener un empleado por ID

Para continuar el flujo se podría tomar el _id con el que se creo el empleado anteiormente y remplazarlo , debeía traer el usuario creado anteriormente

![image](https://github.com/user-attachments/assets/e8aa394c-54b9-48eb-8a9d-adaab967847c)

📌 Eliminar un empleado por ID

Para continuar el flujo se podría tomar el _id con el que se creo el empleado anteiormente y remplazarlo, debería eliminar el empleado


![image](https://github.com/user-attachments/assets/8a1b092d-90cb-4d4b-83de-0138d768e8da)

Para confirmar volvemos a ejecutar el servicio de  Obtener un empleado por ID con el mismo ID:

![image](https://github.com/user-attachments/assets/607375f3-1e19-4983-9239-3a11f4485bd6)

📌 Traer cargos disponibles

Esta api consume la api https://ibillboard.com/api/positions y devuelve un arreglo con los cargos disponibles 

![image](https://github.com/user-attachments/assets/608af014-787b-4019-822f-76f82fa94053)


### 🛠️ Comandos útiles
Comando	Descripción
- npm run start:dev	Inicia el servidor en modo desarrollo
- npm run build	Genera la compilación para producción
- npm run start	Ejecuta el servidor en producción
- npm run lint	Ejecuta ESLint para validar el código
