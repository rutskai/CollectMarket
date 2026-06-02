# CollectMarket 

> Plataforma de compraventa de cartas Pokémon desarrollada como Trabajo de Fin de Grado.

CollectMarket es una aplicación web full-stack que permite a los usuarios comprar, vender y coleccionar cartas Pokémon. Cuenta con catálogo completo importado desde la API TCGdex, sistema de autenticación, carrito de compra, favoritos, perfil de usuario con avatar y un flujo de compra completo.

---

## Índice

- [Tecnologías](#tecnologías)
- [Arquitectura](#arquitectura)
- [Funcionalidades](#funcionalidades)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Base de datos](#base-de-datos)
- [API REST](#api-rest)
- [Páginas](#páginas)

---

## Tecnologías

### Frontend
| Tecnología | Versión | Uso |
|---|---|---|
| Angular | 17+ | Framework principal |
| TypeScript | 5+ | Lenguaje principal |
| RxJS | 7+ | Programación reactiva |
| Angular Signals | 17+ | Gestión de estado reactivo |
| Angular Reactive Forms | 17+ | Formularios con validación |

### Backend
| Tecnología | Versión | Uso |
|---|---|---|
| .NET | 9 | Framework principal |
| ASP.NET Core Minimal API | 9 | Endpoints REST |
| Entity Framework Core | 9 | ORM y migraciones |
| MySQL | 8 | Base de datos |
| BCrypt.Net | — | Hash de contraseñas |
| Cloudinary | — | Almacenamiento de imágenes |
| Dapper | — | Importación de cartas |

### Librerías
| Librería | Modo | Uso |
|---|---|---|
| Vide | Frontend | Vídeos de fondo (plugin de jQuery) |
| BCrypt.Net-Next| Backend | Hash contraseñas|
| CloudinaryDotNet | Backend | Almacenamiento de avatares en la nube |
| Dapper | Backend | Micro-ORM para consultas SQL (importación de cartas) |
| Microsoft.EntityFrameworkCore| Backend | ORM* principal |
| MySql.Data | Backend | Conector MySQL para .NET |

    *ORM: técnica que permite convertir datos entre una base de datos relacional (tablas) y un lenguaje orientado a objetos (clases), evitando escribir SQL manualmente.
---

## Arquitectura

```
CollectMarket/
├── Backend/                  # ASP.NET Core Minimal API
│   ├── Api/                  # Endpoints REST
│   │   ├── Auth.cs           # Login y registro
│   │   ├── Cards.cs          # CRUD de cartas
│   │   ├── Cart.cs           # Carrito de compra
│   │   ├── Favorites.cs      # Favoritos
│   │   ├── Orders.cs         # Pedidos
│   │   └── Users.cs          # Perfil y avatar
│   ├── Models/               # Entidades y DTOs
│   ├── Services/             # Lógica de negocio
│   ├── AppDb.cs              # Contexto Entity Framework
│   └── Program.cs            # Configuración y arranque
│
└── Collect-Market/           # Angular SPA
    └── src/app/
        ├── components/       # Componentes reutilizables
        │   ├── card/         # Tarjeta de carta Pokémon
        │   ├── header/       # Cabecera con navegación
        │   ├── footer/       # Pie de página
        │   ├── login-modal/  # Modal de inicio de sesión
        │   └── confirm-modal/# Modal de confirmación
        ├── pages/            # Páginas de la aplicación
        ├── services/         # Servicios Angular
        ├── models/           # Interfaces TypeScript
        └── helpers/          # Utilidades (imagen, paginación...)
```

---

## Funcionalidades

### Autenticación
- Registro de usuarios con validación de email y contraseña
- Inicio de sesión con JWT almacenado en localStorage
- Cierre de sesión
- Página de recuperación de contraseña
- Guards de rutas para páginas protegidas

### Catálogo de cartas
- Más de 128 cartas importadas automáticamente desde la API TCGdex
- Importación de expansiones: Base Set, Jungle y Fossil
- Precios y stock generados automáticamente según rareza
- Paginación de 14 cartas por página
- Filtros por tipo, rareza, expansión y precio máximo
- Slider de precio con actualización en tiempo real
- Vista de detalle de cada carta con descripción, specs y vendedor

### Carrito de compra
- Añadir y eliminar cartas del carrito
- Actualizar cantidades
- Resumen del pedido con precio total
- Vaciado completo del carrito
- Estado reactivo con Angular Signals

### Favoritos
- Marcar y desmarcar cartas como favoritas
- Página de favoritos con valor total de la colección
- Estado reactivo con Angular Signals

### Pedidos
- Formulario de checkout con validación (nombre, dirección, código postal, país)
- Métodos de pago: tarjeta de crédito y PayPal
- Formateo automático del número de tarjeta
- Descuento automático de stock al confirmar pedido
- Página de confirmación con número de pedido real

### Perfil de usuario
- Cambio de nombre de usuario
- Subida de foto de perfil via Cloudinary
- Cambio de contraseña con verificación de la actual
- Menú de opciones: vender cartas, personalización, cerrar sesión

### Venta de cartas
- Formulario para publicar cartas en el catálogo
- Campos: nombre, expansión, rareza, tipo, precio, stock, descripción, imagen
- Vista previa de imagen en tiempo real
- Página de mis cartas con opción de eliminar

---

## Estructura del proyecto

```
Collect-Market/src/app/
├── pages/
│   ├── home-page/              # Landing con cartas destacadas
│   ├── shop-page/              # Tienda con filtros y paginación
│   ├── detail-card-page/       # Detalle de una carta
│   ├── favorite-page/          # Cartas favoritas del usuario
│   ├── shopping-cart-page/     # Carrito de compra
│   ├── checkout-page/          # Formulario de pago
│   ├── order-confirmation-page/# Confirmación de pedido
│   ├── sell-card-page/         # Publicar carta para vender
│   ├── my-cards-page/          # Cartas publicadas por el usuario
│   ├── user-page/              # Perfil del usuario
│   ├── user-personalization-page/ # Editar perfil y contraseña
│   ├── login-form/             # Inicio de sesión
│   ├── register-form/          # Registro
│   └── recover-page/           # Recuperación de contraseña
│
├── services/
│   ├── auth/auth-service.ts        # Autenticación y sesión
│   ├── cards/cards-service.ts      # CRUD de cartas
│   ├── cart/cart-service.ts        # Carrito (Signals)
│   ├── favorite/favorites-service.ts # Favoritos (Signals)
│   ├── orders/order-service.ts     # Pedidos
│   └── user/user-service.ts        # Perfil de usuario
│
└── helpers/
    ├── image-helper.ts         # Resolución de URLs de imagen
    └── pagination-helper.ts    # Lógica de paginación
```

---

## Instalación

### Requisitos previos
- [Node.js](https://nodejs.org/) v20+
- [Angular CLI](https://angular.io/cli) v17+
- [.NET SDK](https://dotnet.microsoft.com/) v9
- [MySQL](https://www.mysql.com/) v8
- Cuenta en [Cloudinary](https://cloudinary.com/) (gratuita)

### Base de datos

Entity Framework crea la base de datos y todas las tablas automáticamente al arrancar el backend por primera vez. Solo asegúrate de que MySQL está corriendo y la connection string es correcta.

### Backend

```bash
cd Backend
dotnet restore
dotnet run
```

El backend arranca en `http://localhost:5000`.

Al arrancar por primera vez importa automáticamente las cartas de la API TCGdex. Este proceso puede tardar unos minutos.

### Frontend

```bash
cd Collect-Market
npm install
npm start
```

El frontend arranca en `http://localhost:4200`.

---

## Variables de entorno

En `Backend/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "server=localhost;port=3306;database=collectmarket;user=root;password=TU_PASSWORD;ConvertZeroDateTime=True;"
  },
  "Cloudinary": {
    "CloudName": "TU_CLOUD_NAME",
    "ApiKey": "TU_API_KEY",
    "ApiSecret": "TU_API_SECRET"
  }
}
```

Las credenciales de Cloudinary se obtienen en [cloudinary.com/console](https://cloudinary.com/console) tras registrarse gratuitamente.

---

## Base de datos

### Diagrama de tablas

```
User
├── Id, Name, Email, Password
├── AvatarUrl, CreatedAt, UpdatedAt

Card
├── Id, Name, SetName, Rarity, Type
├── ImageUrl, Price, Stock, Description
├── SellerId (FK → User), CreatedAt, UpdatedAt

UserFavorite
├── Id, UserId (FK), CardId (FK), CreatedAt

CartItem
├── Id, UserId (FK), CardId (FK), Quantity, AddedAt

Order
├── Id, UserId (FK), FullName, Address
├── City, PostalCode, Country
├── PaymentMethod, CardNumber
├── Total, Status, CreatedAt

OrderItem
├── Id, OrderId (FK), CardId (FK)
├── Quantity, UnitPrice
```

### Migraciones

Las migraciones se aplican automáticamente al arrancar. Para crearlas manualmente:

```bash
dotnet ef migrations add NombreMigracion
dotnet ef database update
```

---

## API REST

### Autenticación
| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/login` | Inicio de sesión |
| POST | `/api/register` | Registro de usuario |
| PUT | `/api/users/{id}/password` | Cambiar contraseña |

### Cartas
| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/cards` | Todas las cartas |
| GET | `/api/cards/{id}` | Detalle de una carta |
| GET | `/api/cards/filter` | Cartas filtradas |
| GET | `/api/cards/types` | Tipos disponibles |
| GET | `/api/cards/rarities` | Rarezas disponibles |
| GET | `/api/cards/expansions` | Expansiones disponibles |
| POST | `/api/cards` | Crear carta (vendedor) |
| DELETE | `/api/cards/{id}` | Eliminar carta propia |

### Usuarios
| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/users/{id}` | Datos de usuario |
| PUT | `/api/users/{id}/name` | Actualizar nombre |
| PUT | `/api/users/{id}/avatar` | Actualizar foto de perfil |

### Favoritos
| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/users/{id}/favorites` | Favoritos del usuario |
| POST | `/api/users/{id}/favorites/{cardId}` | Añadir favorito |
| DELETE | `/api/users/{id}/favorites/{cardId}` | Eliminar favorito |
| GET | `/api/users/{id}/favorites/{cardId}/check` | Comprobar favorito |

### Carrito
| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/users/{id}/cart` | Carrito del usuario |
| POST | `/api/users/{id}/cart/{cardId}` | Añadir al carrito |
| PUT | `/api/users/{id}/cart/{cardId}` | Actualizar cantidad |
| DELETE | `/api/users/{id}/cart/{cardId}` | Eliminar del carrito |
| DELETE | `/api/users/{id}/cart` | Vaciar carrito |
| GET | `/api/users/{id}/cart/{cardId}/check` | Comprobar si está en carrito |

### Pedidos
| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/orders` | Crear pedido |
| GET | `/api/orders/{userId}` | Pedidos del usuario |

---

## Páginas

| Ruta | Página | Acceso |
|---|---|---|
| `/` | Home | Público |
| `/shop` | Tienda | Público |
| `/card/:id` | Detalle de carta | Público |
| `/auth/login` | Inicio de sesión | Público |
| `/auth/register` | Registro | Público |
| `/auth/recover` | Recuperar contraseña | Público |
| `/favorite` | Mis favoritos | Autenticado |
| `/cart` | Carrito | Autenticado |
| `/checkout` | Finalizar compra | Autenticado |
| `/order-confirmation` | Confirmación de pedido | Autenticado |
| `/user` | Perfil | Autenticado |
| `/personalization-page` | Editar perfil | Autenticado |
| `/sell` | Vender carta | Autenticado |
| `/my-cards` | Mis cartas | Autenticado |

---

## Autor

Ruth Collado García

Desarrollado como Trabajo de Fin de Grado.

© 2025 CollectMarket
