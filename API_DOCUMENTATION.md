# API Documentation

Index

- [General Information](#general-information)
- AUTHENTICATION

  - [Register User](#register-user)
  - [Login User](#login-user)
  - [Get Profile](#get-profile)
  - [Google Auth](#google-auth)

- RESUMES

  - [Save Resume](#save-resume)
  - [Get All Resumes](#get-all-resumes)
  - [Get Resume by ID](#get-resume-by-id)
  - [Get Latest Resume by Template](#get-latest-resume-by-template)
  - [Delete Resume](#delete-resume)
  - [Get Resume Count](#get-resume-count)

- SHARE
  - [Create Share Link](#create-share-link)
  - [Get Shared Resume](#get-shared-resume)

## General Information

### Base URL

All API requests should be prefixed with the following base URL:
`http://localhost:5000/api`

### Authentication

Endpoints marked as `Authorization: required` require a valid JWT token in the request header.
**Header Format:**
`Authorization: Bearer <your_token_here>`

### Error Handling

Standard error responses follow this format:

```json
{
  "success": false,
  "message": "Error description here"
}
```

Common HTTP Status Codes:

- `200`: Success
- `201`: Created successfully
- `400`: Bad Request (Missing fields, invalid data)
- `401`: Unauthorized (Missing or invalid token)
- `404`: Not Found
- `500`: Server Error

---

AUTHENTICATION

Register User
API : http://localhost:5000/api/register
Method : POST
Authorization : none
Request body:

{
"name": "John Doe",
"email": "john@example.com",
"password": "password123"
}

Response : 200 ok

{
"success": true,
"message": "User registered successfully",
"token": "eyJhbGciOiJIUzI1NiIsInR...",
"user": {
"id": "651a...",
"name": "John Doe",
"email": "john@example.com"
}
}

Login User
API : http://localhost:5000/api/login
Method : POST
Authorization : none
Request body:

{
"email": "john@example.com",
"password": "password123"
}

Response : 200 ok

{
"success": true,
"message": "Login successful",
"token": "eyJhbGciOiJIUzI1NiIsInR...",
"user": {
"id": "651a...",
"name": "John Doe",
"email": "john@example.com"
}
}

Get Profile
API : http://localhost:5000/api/profile
Method : GET
Authorization : required (Bearer Token)
Request body: none

Response : 200 ok

{
"success": true,
"message": "User profile fetched successfully",
"user": {
"id": "651a...",
"name": "John Doe",
"email": "john@example.com"
}
}

Google Auth
API : http://localhost:5000/api/auth/google
Method : POST
Authorization : none
Request body:

{
"token": "google_id_token_here"
}

Response : 200 ok

{
"success": true,
"message": "Logged in successfully",
"token": "eyJhbGciOiJIUzI1NiIsInR...",
"user": {
"id": "651a...",
"name": "John Doe",
"email": "john@example.com"
}
}

RESUMES

Save Resume
API : http://localhost:5000/api/resumes/save
Method : POST
Authorization : required
Request body:

{
"resumeId": "optional_id_for_update",
"resumeName": "My Frontend Resume",
"templateId": "template_1",
"templateData": {
"name": "John Doe",
"email": "john@example.com",
"skills": ["React", "Node.js"]
}
}

Response : 200 ok

{
"success": true,
"message": "Resume saved successfully",
"resume": {
"id": "651b...",
"resumeName": "My Frontend Resume",
"templateId": "template_1",
"lastModified": "2025-05-14T18:30:00.000Z"
}
}

Get All Resumes
API : http://localhost:5000/api/resumes/
Method : GET
Authorization : required
Request body: none

Response : 200 ok

{
"success": true,
"resumes": [
{
"_id": "651b...",
"userId": "651a...",
"resumeName": "My Frontend Resume",
"templateId": "template_1",
"lastModified": "2025-05-14T18:30:00.000Z"
}
]
}

Get Resume by ID
API : http://localhost:5000/api/resumes/id
Method : GET
Authorization : required
Request body: none

Response : 200 ok

{
"success": true,
"resume": {
"\_id": "651b...",
"userId": "651a...",
"resumeName": "My Frontend Resume",
"templateId": "template_1",
"templateData": { ... },
"lastModified": "2025-05-14T18:30:00.000Z"
}
}

Get Latest Resume by Template
API : http://localhost:5000/api/resumes/template/templateId
Method : GET
Authorization : required
Request body: none

Response : 200 ok

{
"success": true,
"resume": {
"\_id": "651b...",
"userId": "651a...",
"resumeName": "My Frontend Resume",
"templateId": "template_1",
"templateData": { ... },
"lastModified": "2025-05-14T18:30:00.000Z"
}
}

Delete Resume
API : http://localhost:5000/api/resumes/id
Method : DELETE
Authorization : required
Request body: none

Response : 200 ok

{
"success": true,
"message": "Resume deleted successfully"
}

Get Resume Count
API : http://localhost:5000/api/resumes/count
Method : GET
Authorization : required
Request body: none

Response : 200 ok

{
"success": true,
"count": 5
}

SHARE

Create Share Link
API : http://localhost:5000/api/share/create
Method : POST
Authorization : none
Request body:

{
"templateId": "template_1",
"templateData": {
"name": "John Doe",
"email": "john@example.com"
}
}

Response : 201 created

{
"success": true,
"shareId": "AbCdEfGh",
"url": "http://localhost:3000/resume-view?id=AbCdEfGh"
}

Get Shared Resume
API : http://localhost:5000/api/share/shareId
Method : GET
Authorization : none
Request body: none

Response : 200 ok

{
"success": true,
"templateId": "template_1",
"templateData": {
"name": "John Doe",
"email": "john@example.com"
},
"viewCount": 1
}
