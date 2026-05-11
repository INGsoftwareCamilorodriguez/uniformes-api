# 🏫 Uniformes Escolares — API REST

**Proyecto SENA | Diseño y Desarrollo de Servicios Web | AA5_EV03**

API REST para la gestión de ventas de uniformes escolares construida con **Node.js + Express.js + MySQL**.

---

## 📁 Estructura del proyecto

```
uniformes-api/
├── src/
│   ├── index.js                        # Punto de entrada
│   ├── config/
│   │   └── db.js                       # Conexión MySQL (pool)
│   ├── controllers/
│   │   ├── categorias.controller.js
│   │   ├── productos.controller.js
│   │   ├── clientes.controller.js
│   │   └── pedidos.controller.js
│   ├── routes/
│   │   ├── categorias.routes.js
│   │   ├── productos.routes.js
│   │   ├── clientes.routes.js
│   │   └── pedidos.routes.js
│   └── middlewares/
│       └── validate.js                 # Manejo de errores de validación
├── docs/
│   └── schema.sql                      # Script de base de datos
├── .env.example                        # Variables de entorno de ejemplo
├── package.json
└── README.md
```

---

## ⚙️ Instalación y configuración

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd uniformes-api
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus credenciales de MySQL
```

### 4. Crear la base de datos
```bash
mysql -u root -p < docs/schema.sql
```

### 5. Iniciar el servidor
```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

---

## 🗄️ Modelo de base de datos

| Tabla            | Descripción                              |
|------------------|------------------------------------------|
| `categorias`     | Tipos de uniforme (camisetas, zapatos…)  |
| `productos`      | Artículos con precio, talla, color, stock|
| `clientes`       | Datos del comprador                      |
| `pedidos`        | Cabecera del pedido con estado           |
| `detalle_pedidos`| Ítems por pedido (producto, cantidad)    |

---

## 🔗 Endpoints de la API

Base URL: `http://localhost:3000`

### 📦 Categorías `/api/categorias`

| Método | Ruta               | Descripción               |
|--------|--------------------|---------------------------|
| GET    | `/api/categorias`  | Listar todas              |
| GET    | `/api/categorias/:id` | Obtener una            |
| POST   | `/api/categorias`  | Crear categoría           |
| PUT    | `/api/categorias/:id` | Actualizar categoría   |
| DELETE | `/api/categorias/:id` | Eliminar categoría     |

### 👕 Productos `/api/productos`

| Método | Ruta                   | Descripción                     |
|--------|------------------------|---------------------------------|
| GET    | `/api/productos`       | Listar (filtros: categoria_id, talla, color, activo) |
| GET    | `/api/productos/:id`   | Obtener uno                     |
| POST   | `/api/productos`       | Crear producto                  |
| PUT    | `/api/productos/:id`   | Actualizar producto             |
| DELETE | `/api/productos/:id`   | Desactivar producto (soft delete)|

**Filtros disponibles (query params):**
```
GET /api/productos?categoria_id=1&talla=M&color=azul&activo=1
```

### 👤 Clientes `/api/clientes`

| Método | Ruta                 | Descripción        |
|--------|----------------------|--------------------|
| GET    | `/api/clientes`      | Listar todos       |
| GET    | `/api/clientes/:id`  | Obtener uno        |
| POST   | `/api/clientes`      | Registrar cliente  |
| PUT    | `/api/clientes/:id`  | Actualizar cliente |
| DELETE | `/api/clientes/:id`  | Eliminar cliente   |

### 🛒 Pedidos `/api/pedidos`

| Método | Ruta                      | Descripción                      |
|--------|---------------------------|----------------------------------|
| GET    | `/api/pedidos`            | Listar (filtros: estado, cliente_id) |
| GET    | `/api/pedidos/:id`        | Obtener pedido con detalle       |
| POST   | `/api/pedidos`            | Crear pedido (descuenta stock)   |
| PATCH  | `/api/pedidos/:id/estado` | Cambiar estado del pedido        |

**Estados válidos:** `pendiente` → `confirmado` → `enviado` → `entregado` | `cancelado`

---

## 📝 Ejemplos de uso

### Crear un producto
```json
POST /api/productos
{
  "categoria_id": 1,
  "nombre": "Camiseta Azul Manga Larga",
  "descripcion": "Tela fría 100% algodón",
  "precio": 28000,
  "stock": 30,
  "talla": "L",
  "color": "Azul"
}
```

### Registrar un cliente
```json
POST /api/clientes
{
  "nombre": "María",
  "apellido": "López",
  "email": "maria.lopez@email.com",
  "telefono": "3001234567",
  "direccion": "Calle 10 # 5-20, Neiva"
}
```

### Crear un pedido
```json
POST /api/pedidos
{
  "cliente_id": 1,
  "items": [
    { "producto_id": 1, "cantidad": 2 },
    { "producto_id": 10, "cantidad": 1 }
  ]
}
```

### Actualizar estado de pedido
```json
PATCH /api/pedidos/1/estado
{
  "estado": "confirmado"
}
```

---

## ✅ Criterios de evaluación cubiertos

| # | Indicador de logro                                  | Implementación                              |
|---|-----------------------------------------------------|---------------------------------------------|
| 1 | Servicios según requerimientos del proyecto         | CRUD completo para las 4 entidades          |
| 2 | API's REST según necesidades del proyecto           | Verbos HTTP correctos + rutas RESTful       |
| 3 | Validaciones de verificación correctamente          | `express-validator` en todas las rutas      |
| 4 | Herramientas de versionamiento                      | Git + repositorio en la entrega             |

---

## 🗃️ Repositorio

Enlace al repositorio: **[URL_DEL_REPOSITORIO]**

---

*Proyecto desarrollado para el programa SENA — Tecnología en Análisis y Desarrollo de Sistemas de Información*
