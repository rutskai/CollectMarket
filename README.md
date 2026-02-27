## Requisitos

Antes de empezar, asegúrate de tener instalado:

- Docker: https://www.docker.com/get-started/
 (20.x+)
- Docker Compose
- Node.js + Angular CLI (solo si quieres correr frontend localmente)
-.NET SDK (solo si quieres correr backend localmente)

---

## Inicialización con Docker Compose

Clona el repositorio y abre la terminal en la raíz del proyecto (donde está docker-compose.yml).

Levanta los contenedores:
```
docker-compose up --build

```

Esto hará:

- Construir la imagen del backend y levantarla (puerto por defecto 5000/5001)

- Construir la imagen del frontend y levantarla (puerto por defecto 4200)

- Red interna para que frontend y backend se comuniquen

El proceso puede tardar un poco, una vez se haga la primera vez, ya se guarda en el caché y tarda mucho menos.

### Accede a la aplicación:
Una vez en la aplicación de docker salga todo en verde
<img width="1624" height="218" alt="image" src="https://github.com/user-attachments/assets/7d767408-1c2a-4267-819b-0e4a8c67cb11" />
Se tiene que clickar aquí (Frontend)  y ya se puede ver la aplicación!
<img width="846" height="69" alt="image" src="https://github.com/user-attachments/assets/e04bd070-65eb-4e7d-814a-f9c03bf8a42b" />

