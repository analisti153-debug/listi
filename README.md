# Todo List API

API backend untuk aplikasi Todo List menggunakan Node.js, Express, MongoDB, JWT, API Key, Swagger, dan Jest.

## Daftar Isi

- [Fitur](#fitur)
- [Teknologi yang Dipakai](#teknologi-yang-dipakai)
- [Struktur Project](#struktur-project)
- [Persyaratan](#persyaratan)
- [Instalasi](#instalasi)
- [Environment Variables](#environment-variables)
- [Menjalankan Project](#menjalankan-project)
- [Menjalankan Test](#menjalankan-test)
- [Dokumentasi API](#dokumentasi-api)
- [Autentikasi](#autentikasi)
- [API Key](#api-key)
- [Pencarian Todo](#pencarian-todo)
- [Field Todo](#field-todo)
- [Activity Log](#activity-log)
- [Category](#category)
- [Referensi Endpoint Singkat](#referensi-endpoint-singkat)
- [Testing Production](#testing-production)
- [Deployment](#deployment)
- [Lisensi](#lisensi)

## Fitur

- CRUD Todo
- CRUD Category
- Register dan Login
- Autentikasi JWT
- Role-based authorization
- Proteksi endpoint dengan API Key
- Activity Log untuk aktivitas Todo
- Pencarian Todo berdasarkan title dan description
- Pagination
- Filtering
- Sorting
- Validasi input
- Global error handling
- Automated testing
- Dokumentasi API menggunakan Swagger

## Teknologi yang Dipakai

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Autentikasi:** JSON Web Token (JWT)
- **Password Hashing:** bcryptjs
- **Validasi:** express-validator
- **Testing:** Jest dan Supertest
- **Database Testing:** mongodb-memory-server
- **Dokumentasi:** swagger-jsdoc dan swagger-ui-express
- **Deployment:** Vercel

## Struktur Project

```text
src/
├── config/
│   ├── db.js
│   └── swagger.js
├── controllers/
│   ├── auth.controller.js
│   ├── category.controller.js
│   ├── stats.controller.js
│   └── todo.controller.js
├── middlewares/
│   ├── apiKey.middleware.js
│   ├── auth.middleware.js
│   ├── errorHandler.middleware.js
│   ├── logger.middleware.js
│   ├── notFound.middleware.js
│   ├── restrictTo.middleware.js
│   └── validate.middleware.js
├── models/
│   ├── category.model.js
│   ├── todo.model.js
│   └── user.model.js
├── routes/
│   ├── auth.routes.js
│   ├── category.routes.js
│   ├── stats.routes.js
│   └── todo.routes.js
├── services/
│   ├── auth.service.js
│   └── todo.service.js
├── utils/
│   ├── AppError.js
│   └── catchAsync.js
├── app.js
└── server.js

api/
└── index.js

tests/
├── auth.test.js
├── category.test.js
└── todo.test.js

postman/
└── Todo API.postman_collection.json

## Persyaratan

Sebelum menjalankan project, pastikan sudah terinstall:

- Node.js 18 atau lebih baru
- npm
- MongoDB atau MongoDB Atlas
- Git
```

Untuk mengecek npm:

```bash
npm --version
```

## Instalasi

Clone repository:

```bash
git clone https://github.com/analisti153-debug/listi.git
```

Masuk ke folder project:

```bash
cd listi
```

Install dependency:

```bash
npm install
```

## Environment Variables

Buat file `.env` di root project.

Contoh:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
EXTERNAL_API_KEY=your_api_key
```

Jangan memasukkan password MongoDB, JWT secret, atau API Key asli ke repository publik.

## Menjalankan Project

Mode development:

```bash
npm run dev
```

Mode biasa:

```bash
npm start
```

Server lokal:

```text
http://localhost:3000
```

## Menjalankan Test

Untuk menjalankan seluruh automated test:

```bash
npm test
```

Project menggunakan:

- Jest
- Supertest
- MongoDB Memory Server

Hasil test terakhir:

```text
Test Suites: 3 passed, 3 total
Tests:       15 passed, 15 total
```

## Dokumentasi API

Swagger Production:

```text
https://listi-rho.vercel.app/api-docs
```

Production Server:

```text
https://listi-rho.vercel.app
```

Swagger digunakan untuk melihat dan mencoba endpoint API.

## Autentikasi

Endpoint yang membutuhkan autentikasi menggunakan JWT.

Header:

```text
Authorization: Bearer <token>
```

### Register

```text
POST /api/auth/register
```

Contoh body:

```json
{
  "name": "Listiana",
  "email": "user@example.com",
  "password": "password123"
}
```

Password minimal 6 karakter.

### Login

```text
POST /api/auth/login
```

Contoh body:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

## API Key

Endpoint statistik menggunakan API Key.

Endpoint:

```text
GET /api/stats/summary
```

Production:

```text
https://listi-rho.vercel.app/api/stats/summary
```

Header:

```text
x-api-key: <API_KEY>
```

API Key disimpan pada:

```env
EXTERNAL_API_KEY=your_api_key
```

Jika API Key tidak diberikan:

```json
{
  "success": false,
  "message": "API key is missing"
}
```

API Key asli tidak boleh ditulis di README atau repository publik.

## Pencarian Todo

Todo dapat dicari berdasarkan `title` dan `description`.

Endpoint:

```text
GET /api/todos?search=belajar
```

Contoh production:

```text
https://listi-rho.vercel.app/api/todos?search=belajar
```

Pencarian tidak membedakan huruf besar dan kecil.

## Field Todo

Todo memiliki field:

| Field | Keterangan |
|---|---|
| `_id` | ID Todo |
| `title` | Judul Todo |
| `description` | Deskripsi Todo |
| `completed` | Status selesai |
| `owner` | Pemilik Todo |
| `created_by` | User yang membuat Todo |
| `updated_by` | User terakhir yang mengubah Todo |
| `archived` | Status arsip Todo |
| `createdAt` | Waktu Todo dibuat |
| `updatedAt` | Waktu Todo diperbarui |

Contoh:

```json
{
  "_id": "todo_id",
  "title": "Belajar Node.js",
  "description": "Belajar Todo API",
  "completed": false,
  "owner": "user_id",
  "created_by": "user_id",
  "updated_by": "user_id",
  "archived": false,
  "createdAt": "2026-09-22T02:51:02.872Z",
  "updatedAt": "2026-09-22T02:51:02.872Z"
}
```

## Activity Log

Activity Log digunakan untuk mencatat aktivitas pada Todo.

Aktivitas yang dicatat:

- `create`
- `update`
- `delete`

Endpoint:

```text
GET /api/activity-logs
```

Production:

```text
https://listi-rho.vercel.app/api/activity-logs
```

Endpoint membutuhkan JWT:

```text
Authorization: Bearer <token>
```

Activity Log mencatat:

- Action
- Entity
- Entity ID
- User
- Waktu aktivitas

## Category

Category digunakan untuk mengelompokkan Todo.

Semua endpoint Category membutuhkan JWT.

### Membuat Category

```text
POST /api/categories
```

Contoh body:

```json
{
  "name": "Belajar",
  "description": "Kategori untuk kegiatan belajar"
}
```

### Mengambil Semua Category

```text
GET /api/categories
```

### Mengambil Category Berdasarkan ID

```text
GET /api/categories/:id
```

### Mengubah Category

```text
PUT /api/categories/:id
```

Contoh body:

```json
{
  "name": "Sekolah",
  "description": "Kategori tugas sekolah"
}
```

### Menghapus Category

```text
DELETE /api/categories/:id
```

## Referensi Endpoint Singkat

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Todo

```text
POST   /api/todos
GET    /api/todos
GET    /api/todos/:id
PUT    /api/todos/:id
DELETE /api/todos/:id
```

### Todo Search

```text
GET /api/todos?search=belajar
```

### Category

```text
POST   /api/categories
GET    /api/categories
GET    /api/categories/:id
PUT    /api/categories/:id
DELETE /api/categories/:id
```

### Activity Log

```text
GET /api/activity-logs
```

### Statistics

```text
GET /api/stats/summary
```

### Swagger

```text
GET /api-docs
```

## Testing Production

Production API:

```text
https://listi-rho.vercel.app
```

Swagger:

```text
https://listi-rho.vercel.app/api-docs
```

Fitur yang telah diuji:

- Register
- Login
- Todo CRUD
- Todo Search
- Category CRUD
- Activity Log
- Statistics dengan API Key
- Validasi password
- Error handling
- Swagger documentation

## Deployment

Project dideploy menggunakan Vercel.

Production URL:

```text
https://listi-rho.vercel.app
```

Swagger:

```text
https://listi-rho.vercel.app/api-docs
```

## Lisensi

Project ini dibuat untuk keperluan pembelajaran backend Node.js.
