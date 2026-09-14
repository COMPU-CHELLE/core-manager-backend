# API REST - Core Manager Backend

## Documentación de Endpoints

### 🔐 Autenticación

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "identifier": "admin@compuchelle.com",
  "password": "Admin@123"
}
```

**Response (200 OK)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "user": {
    "id": 1,
    "code": "ADM001",
    "name": "Administrator",
    "email": "admin@compuchelle.com",
    "companyId": 1,
    "roleCode": "ADMIN",
    "isGlobal": false
  },
  "availableCompanies": [
    {
      "id": 1,
      "name": "Compuchelle S.A.S",
      "nit": "1045689957"
    }
  ],
  "selectedCompany": {
    "id": 1,
    "name": "Compuchelle S.A.S",
    "nit": "1045689957"
  },
  "permissions": {
    "users": {
      "read": true,
      "create": true,
      "update": true,
      "delete": true
    },
    "assets": {
      "read": true,
      "create": true,
      "update": false,
      "delete": false
    }
  },
  "rawPermissions": [
    "users.read",
    "users.create",
    "users.update",
    "users.delete",
    "assets.read",
    "assets.create"
  ]
}
```

---

#### Cambiar Empresa (solo usuarios globales)
```
POST /auth/switch-company
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "companyId": 2
}
```

**Response (200 OK)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer"
}
```

---

#### Obtener Empresas Disponibles
```
GET /auth/available-companies
Authorization: Bearer {access_token}
```

**Response (200 OK)**:
```json
[
  {
    "id": 1,
    "name": "Compuchelle S.A.S",
    "nit": "1045689957"
  },
  {
    "id": 2,
    "name": "Tech Solutions Inc",
    "nit": "1234567890"
  }
]
```

---

### 👥 Usuarios

#### Listar Usuarios (requiere permiso: users.read)
```
GET /users
Authorization: Bearer {access_token}
```

**Response (200 OK)**:
```json
[
  {
    "id": 1,
    "code": "USR001",
    "name": "Juan Pérez",
    "email": "juan@empresa.com",
    "isActive": true,
    "companyId": 1,
    "roleId": 2,
    "createdAt": "2026-02-15T12:00:00Z"
  }
]
```

**Errores**:
- `401 Unauthorized`: Token faltante o inválido
- `403 Forbidden`: Sin permiso `users.read`

---

#### Obtener Usuario por ID (requiere permiso: users.read)
```
GET /users/1
Authorization: Bearer {access_token}
```

**Response (200 OK)**:
```json
{
  "id": 1,
  "code": "USR001",
  "name": "Juan Pérez",
  "email": "juan@empresa.com",
  "isActive": true,
  "companyId": 1,
  "roleId": 2,
  "createdAt": "2026-02-15T12:00:00Z"
}
```

---

#### Crear Usuario (requiere permiso: users.create)
```
POST /users
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "code": "USR002",
  "name": "María García",
  "email": "maria@empresa.com",
  "password": "Password@123",
  "roleId": 3,
  "companyId": 1
}
```

**Response (201 Created)**:
```json
{
  "id": 2,
  "code": "USR002",
  "name": "María García",
  "email": "maria@empresa.com",
  "isActive": true,
  "companyId": 1,
  "roleId": 3,
  "createdAt": "2026-02-15T13:00:00Z"
}
```

---

#### Editar Usuario (requiere permiso: users.update)
```
PATCH /users/1
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "Juan Pérez Updated",
  "email": "juan.updated@empresa.com"
}
```

**Response (200 OK)**:
```json
{
  "id": 1,
  "code": "USR001",
  "name": "Juan Pérez Updated",
  "email": "juan.updated@empresa.com",
  "isActive": true,
  "companyId": 1,
  "roleId": 2,
  "createdAt": "2026-02-15T12:00:00Z"
}
```

---

#### Eliminar Usuario (requiere permiso: users.delete)
```
DELETE /users/1
Authorization: Bearer {access_token}
```

**Response (200 OK)**:
```json
{
  "message": "Usuario eliminado exitosamente"
}
```

---

### 📦 Activos (Assets)

#### Listar Activos (requiere permiso: assets.read)
```
GET /assets
Authorization: Bearer {access_token}
```

**Response (200 OK)**:
```json
[
  {
    "id": 1,
    "name": "Laptop Dell XPS",
    "type": "Computadora",
    "serial": "XPS123456",
    "brand": "Dell",
    "model": "XPS 13",
    "purchaseDate": "2025-01-15",
    "companyId": 1,
    "createdAt": "2026-02-15T12:00:00Z"
  }
]
```

---

#### Obtener Activo por ID (requiere permiso: assets.read)
```
GET /assets/1
Authorization: Bearer {access_token}
```

---

#### Crear Activo (requiere permiso: assets.create)
```
POST /assets
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "Monitor Samsung 24",
  "type": "Monitor",
  "serial": "SAM789012",
  "brand": "Samsung",
  "model": "24 inch",
  "purchaseDate": "2025-06-20"
}
```

---

#### Eliminar Activo (requiere permiso: assets.delete)
```
DELETE /assets/1
Authorization: Bearer {access_token}
```

---

## 📋 Códigos de Estado HTTP

| Código | Significado |
|--------|------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado exitosamente |
| 400 | Bad Request - Solicitud inválida |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error del servidor |

---

## 🔑 Headers Requeridos

Todos los endpoints (excepto `/auth/login`) requieren:
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

---

## 🧪 Testing con cURL

### 1. Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "admin@compuchelle.com",
    "password": "Admin@123"
  }'
```

### 2. Listar Usuarios
```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### 3. Crear Usuario
```bash
curl -X POST http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "USR003",
    "name": "Test User",
    "email": "test@empresa.com",
    "password": "Password@123",
    "roleId": 2,
    "companyId": 1
  }'
```

---

## 📝 Notas Importantes

1. **Permisos**: Se validan automáticamente en cada endpoint
2. **Contexto**: El `companyId` en el token filtra datos por empresa
3. **JWT**: Token válido por 1 día (configurable en `auth.module.ts`)
4. **Seguridad**: Las contraseñas se encriptan con bcrypt
5. **Auditoría**: Las acciones (POST, PATCH, DELETE) se registran automáticamente

---

## 🛠️ Troubleshooting

### Error: "Unknown authentication strategy"
- Asegúrate que `JWT_SECRET` está configurado en `.env`
- Verifica que el token tiene el formato correcto: `Bearer {token}`

### Error: "Usuario no autenticado o sin permisos"
- Verifica que el usuario tiene el permiso requerido
- Revisa los permisos en la respuesta del login

### Error: "Permissions not loaded"
- Asegúrate que el middleware `ContextMiddleware` está registrado
- Verifica que el token es válido y no ha expirado

