# CollectMarket

Plataforma de compraventa de cartas Pokémon.

## Requisitos previos

- [Node.js](https://nodejs.org/) v20+
- [Angular CLI](https://angular.io/cli) v17+
- [.NET SDK](https://dotnet.microsoft.com/) v9
- [MySQL](https://www.mysql.com/) v8

## Instalación

### Base de datos
EF crea la base de datos y las tablas automáticamente al arrancar el backend.
Solo asegúrate de que MySQL está corriendo y la connection string es correcta.

### Backend
```bash
cd Backend
dotnet restore
dotnet run
```
El backend arranca en `http://localhost:5000`

### Frontend
```bash
cd Collect-Market
npm install
npm start
```
El frontend arranca en `http://localhost:4200`

## Variables de entorno

En `Backend/appsettings.json` configura tu conexión a MySQL (Cambiar contraseña):
```json
"ConnectionStrings": {
  "DefaultConnection": "server=localhost;port=3306;database=CollectMarket;user=root;password=TU_PASSWORD;ConvertZeroDateTime=True;"
}
```
