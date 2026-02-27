## Requisitos

Antes de empezar, asegúrate de tener instalado:

- Docker
 (20.x+)
- Docker Compose

---

## Inicialización con Docker Compose

Abre la terminal en la raíz del proyecto (donde está docker-compose.yml).

Levanta los contenedores:
```
docker-compose up --build

```

Esto hará:

- Construir la imagen del backend y levantarla (puerto por defecto 5000/5001)

- Construir la imagen del frontend y levantarla (puerto por defecto 4200)

- Red interna para que frontend y backend se comuniquen

### Accede a la aplicación:

Frontend Angular: http://localhost:4200
Backend C# API: http://localhost:5000
