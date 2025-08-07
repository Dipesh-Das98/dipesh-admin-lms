# LMS Backend API Documentation

This document provides detailed information about the LMS Backend API, including available endpoints, input parameters, and sample responses.

## Standard Response Format

All API responses follow a consistent format:

**Success Response:**

```json
{
  "success": true,
  "data": {
    /* Response data */
  },
  "message": "Operation completed successfully"
}
```

**Error Response:**

```json
{
  "success": false,
  "error": "ERROR_TYPE", 
  "message": "Descriptive error message"
}
```

## Authentication

Most endpoints require authentication using JWT Bearer tokens. Include the token in the Authorization header:

```
Authorization: Bearer your_token_here
```

## API Modules

### 1. Parent Authentication

**Base Path:** `/auth/parent`

#### Create Parent Account

- **Endpoint:** `POST /auth/parent/register`
- **Description:** Register a new parent account
- **Auth Required:** No
- **Input Parameters:**
  ```json
  {
    "email": "parent@example.com",
    "password": "StrongPassword123!",
    "username": "parentuser"
  }
  ```
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
      "email": "parent@example.com",
      "username": "parentuser",
      "createdAt": "2025-05-23T10:30:00.000Z",
      "updatedAt": "2025-05-23T10:30:00.000Z"
    },
    "message": "Parent account created successfully"
  }
  ```

#### Login Parent

- **Endpoint:** `POST /auth/parent/login`
- **Description:** Authenticate a parent user
- **Auth Required:** No
- **Input Parameters:**
  ```json
  {
    "username": "parentuser",
    "password": "StrongPassword123!"
  }
  ```
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
        "email": "parent@example.com",
        "username": "parentuser"
      }
    },
    "message": "Login successful"
  }
  ```

#### Verify Password

- **Endpoint:** `POST /auth/parent/verify-password`
- **Description:** Verify parent password for account operations
- **Auth Required:** Yes
- **Input Parameters:**
  ```json
  {
    "password": "StrongPassword123!"
  }
  ```
- **Sample Response:**
  ```json
  {
    "success": true,
    "message": "Password verified successfully"
  }
  ```

#### Get All Parents

- **Endpoint:** `GET /auth/parent/get-all-parent`
- **Description:** List all parent accounts (admin only)
- **Auth Required:** Yes (Admin role)
- **Query Parameters:**
  - `limit`: Number of records per page
  - `page`: Page number
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": {
      "parents": [
        {
          "id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
          "email": "parent1@example.com",
          "username": "parent1"
        },
        {
          "id": "b2c3d4e5-f6g7-8h9i-0j1k-l2m3n4o5p6q7",
          "email": "parent2@example.com",
          "username": "parent2"
        }
      ],
      "meta": {
        "total": 25,
        "page": 1,
        "limit": 10,
        "totalPages": 3
      }
    },
    "message": "Parents retrieved successfully"
  }
  ```

#### Get Parent by ID

- **Endpoint:** `GET /auth/parent/get-parent/:id`
- **Description:** Get parent account details by ID
- **Auth Required:** Yes
- **Input Parameters:** None (ID in URL path)
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
      "email": "parent@example.com",
      "username": "parentuser",
      "createdAt": "2025-05-23T10:30:00.000Z",
      "updatedAt": "2025-05-23T10:30:00.000Z"
    },
    "message": "Parent retrieved successfully"
  }
  ```

#### Update Parent

- **Endpoint:** `PATCH /auth/parent/update-parent/:id`
- **Description:** Update parent account details
- **Auth Required:** Yes
- **Input Parameters:**
  ```json
  {
    "email": "updated_email@example.com",
    "username": "updated_username"
  }
  ```
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
      "email": "updated_email@example.com",
      "username": "updated_username",
      "updatedAt": "2025-05-23T11:45:00.000Z"
    },
    "message": "Parent updated successfully"
  }
  ```

#### Delete Parent

- **Endpoint:** `DELETE /auth/parent/delete-parent/:id`
- **Description:** Delete a parent account
- **Auth Required:** Yes (Admin role)
- **Input Parameters:** None (ID in URL path)
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6"
    },
    "message": "Parent deleted successfully"
  }
  ```

#### Get Current Parent Profile

- **Endpoint:** `GET /auth/parent/me`
- **Description:** Get current authenticated parent's details
- **Auth Required:** Yes
- **Input Parameters:** None
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
      "email": "parent@example.com",
      "username": "parentuser",
      "createdAt": "2025-05-23T10:30:00.000Z",
      "updatedAt": "2025-05-23T10:30:00.000Z"
    },
    "message": "Parent profile retrieved successfully"
  }
  ```

### 2. Child Authentication

**Base Path:** `/auth/child`

#### Login Child

- **Endpoint:** `POST /auth/child/login`
- **Description:** Authenticate a child user
- **Auth Required:** No
- **Input Parameters:**
  ```json
  {
    "id": "c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8",
    "password": "StrongPassword123!"
  }
  ```
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "child": {
        "id": "c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8",
        "firstName": "John",
        "lastName": "Doe",
        "nickname": "Johnny",
        "grade": "GRADE_1",
        "avatar": "https://example.com/avatars/avatar1.png"
      }
    },
    "message": "Login successful"
  }
  ```

#### Get Child Profile

- **Endpoint:** `GET /auth/child/me`
- **Description:** Get current authenticated child's details
- **Auth Required:** Yes
- **Input Parameters:** None
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8",
      "firstName": "John",
      "lastName": "Doe",
      "nickname": "Johnny",
      "grade": "GRADE_1",
      "language": "ENGLISH",
      "gender": "Male",
      "settings": {
        "game": true,
        "music": true,
        "stories": true
      }
    },
    "message": "Child profile retrieved successfully"
  }
  ```

#### Logout Child

- **Endpoint:** `POST /auth/child/logout`
- **Description:** Logout child user
- **Auth Required:** Yes
- **Input Parameters:** None
- **Sample Response:**
  ```json
  {
    "success": true,
    "message": "Child logged out successfully"
  }
  ```

### 3. Admin Authentication

**Base Path:** `/auth/admin`

#### Create Admin Account

- **Endpoint:** `POST /auth/admin/register`
- **Description:** Register a new admin account
- **Auth Required:** Yes (Admin role)
- **Input Parameters:**
  ```json
  {
    "email": "admin@example.com",
    "password": "StrongPassword123!",
    "username": "adminuser"
  }
  ```
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0",
      "email": "admin@example.com",
      "username": "adminuser",
      "role": "ADMIN",
      "createdAt": "2025-05-23T10:30:00.000Z",
      "updatedAt": "2025-05-23T10:30:00.000Z"
    },
    "message": "Admin account created successfully"
  }
  ```

#### Login Admin

- **Endpoint:** `POST /auth/admin/login`
- **Description:** Authenticate an admin user
- **Auth Required:** No
- **Input Parameters:**
  ```json
  {
    "email": "admin@example.com",
    "password": "StrongPassword123!"
  }
  ```
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0",
        "email": "admin@example.com",
        "username": "adminuser",
        "role": "ADMIN"
      }
    },
    "message": "Login successful"
  }
  ```

#### Get All Admins

- **Endpoint:** `GET /auth/admin/get-all-admin`
- **Description:** List all admin accounts
- **Auth Required:** Yes (Admin role)
- **Input Parameters:** None
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0",
        "email": "admin1@example.com",
        "username": "admin1",
        "role": "ADMIN"
      },
      {
        "id": "f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1",
        "email": "admin2@example.com",
        "username": "admin2",
        "role": "ADMIN"
      }
    ],
    "message": "Admins retrieved successfully"
  }
  ```

#### Get Admin by ID

- **Endpoint:** `GET /auth/admin/get-admin/:id`
- **Description:** Get admin account details by ID
- **Auth Required:** Yes (Admin role)
- **Input Parameters:** None (ID in URL path)
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0",
      "email": "admin@example.com",
      "username": "adminuser",
      "role": "ADMIN",
      "createdAt": "2025-05-23T10:30:00.000Z",
      "updatedAt": "2025-05-23T10:30:00.000Z"
    },
    "message": "Admin retrieved successfully"
  }
  ```

#### Update Admin

- **Endpoint:** `PATCH /auth/admin/update-admin/:id`
- **Description:** Update admin account details
- **Auth Required:** Yes (Admin role)
- **Input Parameters:**
  ```json
  {
    "email": "updated_admin@example.com",
    "username": "updated_admin"
  }
  ```
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0",
      "email": "updated_admin@example.com",
      "username": "updated_admin",
      "updatedAt": "2025-05-23T11:45:00.000Z"
    },
    "message": "Admin updated successfully"
  }
  ```

#### Delete Admin

- **Endpoint:** `DELETE /auth/admin/delete-admin/:id`
- **Description:** Delete an admin account
- **Auth Required:** Yes (Admin role)
- **Input Parameters:** None (ID in URL path)
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0"
    },
    "message": "Admin deleted successfully"
  }
  ```

#### Get Current Admin Profile

- **Endpoint:** `GET /auth/admin/me`
- **Description:** Get current authenticated admin's details
- **Auth Required:** Yes (Admin role)
- **Input Parameters:** None
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "e5f6g7h8-i9j0-k1l2-m3n4-o5p6q7r8s9t0",
      "email": "admin@example.com",
      "username": "adminuser",
      "role": "ADMIN",
      "createdAt": "2025-05-23T10:30:00.000Z",
      "updatedAt": "2025-05-23T10:30:00.000Z"
    },
    "message": "Admin profile retrieved successfully"
  }
  ```

### 4. Child Management

**Base Path:** `/children`

#### Create Child

- **Endpoint:** `POST /children/create-child`
- **Description:** Create a new child account (linked to parent)
- **Auth Required:** Yes (Parent role)
- **Input Parameters:**
  ```json
  {
    "firstName": "John",
    "middleName": "David",
    "lastName": "Doe",
    "nickname": "Johnny",
    "gender": "Male",
    "language": "ENGLISH",
    "grade": "GRADE_1",
    "parentRole": "DAD"
  }
  ```
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8",
      "firstName": "John",
      "middleName": "David",
      "lastName": "Doe",
      "nickname": "Johnny",
      "gender": "Male",
      "language": "ENGLISH",
      "grade": "GRADE_1",
      "parentId": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
      "parentRole": "DAD",
      "createdAt": "2025-05-23T10:30:00.000Z",
      "updatedAt": "2025-05-23T10:30:00.000Z"
    },
    "message": "Child created successfully"
  }
  ```

#### Get All Children

- **Endpoint:** `GET /children/get-all-children`
- **Description:** List all children with pagination
- **Auth Required:** Yes (Admin or Parent role)
- **Query Parameters:**
  - `limit`: Number of records per page
  - `page`: Page number
- **Sample Response:**
  ```json
  {
    "data": [
      {
        "id": "c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8",
        "firstName": "John",
        "lastName": "Doe",
        "nickname": "Johnny",
        "grade": "GRADE_1"
      },
      {
        "id": "d4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9",
        "firstName": "Jane",
        "lastName": "Smith",
        "nickname": "Janie",
        "grade": "GRADE_2"
      }
    ],
    "meta": {
      "total": 20,
      "page": 1,
      "limit": 10,
      "totalPages": 2
    }
  }
  ```

#### Get Child By ID

- **Endpoint:** `GET /children/:id`
- **Description:** Get a child's details by ID
- **Auth Required:** Yes (Admin or Parent role)
- **Input Parameters:** None (ID in URL path)
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8",
      "firstName": "John",
      "middleName": "David",
      "lastName": "Doe",
      "nickname": "Johnny",
      "gender": "Male",
      "language": "ENGLISH",
      "grade": "GRADE_1",
      "parentId": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
      "parentRole": "DAD",
      "createdAt": "2025-05-23T10:30:00.000Z",
      "updatedAt": "2025-05-23T10:30:00.000Z"
    },
    "message": "Child retrieved successfully"
  }
  ```

#### Get Children By Parent

- **Endpoint:** `GET /children/get-children-by-parent`
- **Description:** Get all children for the authenticated parent
- **Auth Required:** Yes (Admin or Parent role)
- **Input Parameters:** None
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8",
        "firstName": "John",
        "lastName": "Doe",
        "nickname": "Johnny",
        "grade": "GRADE_1"
      },
      {
        "id": "d4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9",
        "firstName": "Jane",
        "lastName": "Smith",
        "nickname": "Janie",
        "grade": "GRADE_2"
      }
    ],
    "message": "Children retrieved successfully"
  }
  ```

#### Update Child

- **Endpoint:** `PATCH /childre/:id`
- **Description:** Update a child's information
- **Auth Required:** Yes (Admin or Parent role)
- **Input Parameters:**
  ```json
  {
    "firstName": "Johnny",
    "middleName": "D",
    "grade": "GRADE_2"
  }
  ```
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8",
      "firstName": "Johnny",
      "middleName": "D",
      "lastName": "Doe",
      "grade": "GRADE_2",
      "updatedAt": "2025-05-23T11:45:00.000Z"
    },
    "message": "Child updated successfully"
  }
  ```

#### Update Child Settings

- **Endpoint:** `PATCH /children/update-child-settings/:id`
- **Description:** Update a child's settings
- **Auth Required:** Yes (Admin or Parent role)
- **Input Parameters:**

  ```json
  {
    "settings": {
      "game": false,
      "music": true
    }
  }
  ```

- **Sample Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8",
      "settings": {
        "game": false,
        "music": true
      }
    },
    "message": "Child settings updated successfully"
  }
  ```

#### Delete Child

- **Endpoint:** `DELETE /children/:id`
- **Description:** Delete a child account
- **Auth Required:** Yes (Admin or Parent role)
- **Input Parameters:** None (ID in URL path)
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8"
    },
    "message": "Child deleted successfully"
  }
  ```

### 5. Learning Management - Stories

**Base Path:** `/story`

#### Create Story

- **Endpoint:** `POST /story`
- **Description:** Create a new story (Admin only)
- **Auth Required:** Yes (Admin role)
- **Input Parameters:**
  ```json
  {
    "title": "The Adventure of Sammy",
    "content": "Once upon a time...",
    "author": "John Smith",
    "grade": "GRADE_1",
    "language": "ENGLISH",
    "coverImage": "https://example.com/images/sammy.jpg",
    "audioUrl": "https://example.com/audio/sammy.mp3",
    "duration": 300,
    "tags": ["adventure", "animals", "forest"]
  }
  ```
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1",
      "title": "The Adventure of Sammy",
      "content": "Once upon a time...",
      "author": "John Smith",
      "grade": "GRADE_1",
      "language": "ENGLISH",
      "coverImage": "https://example.com/images/sammy.jpg",
      "audioUrl": "https://example.com/audio/sammy.mp3",
      "duration": 300,
      "tags": ["adventure", "animals", "forest"],
      "createdAt": "2025-05-23T10:30:00.000Z",
      "updatedAt": "2025-05-23T10:30:00.000Z"
    },
    "message": "Story created successfully"
  }
  ```

#### Get All Stories

- **Endpoint:** `GET /story/get-all-story`
- **Description:** List all stories with pagination
- **Auth Required:** Yes (Admin role)
- **Query Parameters:**
  - `limit`: Number of records per page
  - `page`: Page number
  - `sortBy`: Field to sort by
  - `orderBy`: Sort order (ASC or DESC)
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": {
      "items": [
        {
          "id": "f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1",
          "title": "The Adventure of Sammy",
          "author": "John Smith",
          "grade": "GRADE_1",
          "language": "ENGLISH",
          "coverImage": "https://example.com/images/sammy.jpg"
        },
        {
          "id": "g7h8i9j0-k1l2-m3n4-o5p6-q7r8s9t0u1v2",
          "title": "The Magic Forest",
          "author": "Jane Doe",
          "grade": "GRADE_2",
          "language": "ENGLISH",
          "coverImage": "https://example.com/images/forest.jpg"
        }
      ],
      "meta": {
        "total": 20,
        "page": 1,
        "limit": 10,
        "totalPages": 2
      }
    },
    "message": "Stories retrieved successfully"
  }
  ```

#### Get Story by Grade

- **Endpoint:** `GET /story/grade/:grade`
- **Description:** Get stories filtered by grade level
- **Auth Required:** Yes
- **Input Parameters:** None (grade in URL path)
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1",
        "title": "The Adventure of Sammy",
        "author": "John Smith",
        "grade": "GRADE_1",
        "language": "ENGLISH",
        "coverImage": "https://example.com/images/sammy.jpg"
      },
      {
        "id": "h8i9j0k1-l2m3-n4o5-p6q7-r8s9t0u1v2w3",
        "title": "The Talking Animals",
        "author": "Emily Wilson",
        "grade": "GRADE_1",
        "language": "ENGLISH",
        "coverImage": "https://example.com/images/animals.jpg"
      }
    ],
    "message": "Stories retrieved successfully"
  }
  ```

#### Get Story for Child

- **Endpoint:** `GET /story/child/:grade`
- **Description:** Get stories customized for a child's grade level
- **Auth Required:** Yes
- **Input Parameters:** None (grade in URL path)
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1",
        "title": "The Adventure of Sammy",
        "author": "John Smith",
        "grade": "GRADE_1",
        "language": "ENGLISH",
        "coverImage": "https://example.com/images/sammy.jpg"
      }
    ],
    "message": "Stories retrieved successfully"
  }
  ```

#### Get Story by ID

- **Endpoint:** `GET /story/:id`
- **Description:** Get a story's details by ID
- **Auth Required:** Yes (Admin role)
- **Input Parameters:** None (ID in URL path)
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1",
      "title": "The Adventure of Sammy",
      "content": "Once upon a time...",
      "author": "John Smith",
      "grade": "GRADE_1",
      "language": "ENGLISH",
      "coverImage": "https://example.com/images/sammy.jpg",
      "audioUrl": "https://example.com/audio/sammy.mp3",
      "duration": 300,
      "tags": ["adventure", "animals", "forest"],
      "createdAt": "2025-05-23T10:30:00.000Z",
      "updatedAt": "2025-05-23T10:30:00.000Z"
    },
    "message": "Story retrieved successfully"
  }
  ```

#### Update Story

- **Endpoint:** `PATCH /story/:id`
- **Description:** Update a story
- **Auth Required:** Yes (Admin role)
- **Input Parameters:**
  ```json
  {
    "title": "The Grand Adventure of Sammy",
    "content": "Once upon a time in a magical forest...",
    "tags": ["adventure", "animals", "forest", "magic"]
  }
  ```
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1",
      "title": "The Grand Adventure of Sammy",
      "content": "Once upon a time in a magical forest...",
      "tags": ["adventure", "animals", "forest", "magic"],
      "updatedAt": "2025-05-23T11:45:00.000Z"
    },
    "message": "Story updated successfully"
  }
  ```

#### Delete Story

- **Endpoint:** `DELETE /story/:id`
- **Description:** Delete a story
- **Auth Required:** Yes (Admin role)
- **Input Parameters:** None (ID in URL path)
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1"
    },
    "message": "Story deleted successfully"
  }
  ```

### 6. Learning Management - Music

**Base Path:** `/music`

#### Create Music

- **Endpoint:** `POST /music`
- **Description:** Create a new music entry (Admin only)
- **Auth Required:** Yes (Admin role)
- **Input Parameters:**
  ```json
  {
    "title": "Happy Days",
    "artist": "Music Kids",
    "grade": "GRADE_1",
    "thumbnail": "https://example.com/images/happy-days.jpg",
    "mediaUrl": "https://example.com/audio/happy-days.mp3",
    "duration": 180,
    "tags": ["happy", "children", "upbeat"]
  }
  ```
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "i9j0k1l2-m3n4-o5p6-q7r8-s9t0u1v2w3x4",
      "title": "Happy Days",
      "grade": "GRADE_1",
      "language": "ENGLISH",
      "thumbnail": "https://example.com/images/happy-days.jpg",
      "mediaUrl": "https://example.com/audio/happy-days.mp3",
      "duration": 180,
      "tags": ["happy", "children", "upbeat"],
      "createdAt": "2025-05-23T10:30:00.000Z",
      "updatedAt": "2025-05-23T10:30:00.000Z"
    },
    "message": "Music created successfully"
  }
  ```

#### Get All Music

- **Endpoint:** `GET /music/get-all-music`
- **Description:** List all music entries with pagination
- **Auth Required:** Yes
- **Query Parameters:**
  - `limit`: Number of records per page
  - `page`: Page number
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": {
      "items": [
        {
          "id": "i9j0k1l2-m3n4-o5p6-q7r8-s9t0u1v2w3x4",
          "title": "Happy Days",
          "grade": "GRADE_1",
          "language": "ENGLISH",
          "coverImage": "https://example.com/images/happy-days.jpg"
        },
        {
          "id": "j0k1l2m3-n4o5-p6q7-r8s9-t0u1v2w3x4y5",
          "title": "Dance Along",
          "grade": "GRADE_2",
          "language": "ENGLISH",
          "coverImage": "https://example.com/images/dance-along.jpg"
        }
      ],
      "meta": {
        "total": 15,
        "page": 1,
        "limit": 10,
        "totalPages": 2
      }
    },
    "message": "Music retrieved successfully"
  }
  ```

#### Get Music by Grade

- **Endpoint:** `GET /music/grade/:grade`
- **Description:** Get music filtered by grade level
- **Auth Required:** Yes
- **Input Parameters:** None (grade in URL path)
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "i9j0k1l2-m3n4-o5p6-q7r8-s9t0u1v2w3x4",
        "title": "Happy Days",
        "grade": "GRADE_1",
        "language": "ENGLISH",
        "coverImage": "https://example.com/images/happy-days.jpg"
      },
      {
        "id": "k1l2m3n4-o5p6-q7r8-s9t0-u1v2w3x4y5z6",
        "title": "Alphabet Song",
        "grade": "GRADE_1",
        "language": "ENGLISH",
        "coverImage": "https://example.com/images/alphabet.jpg"
      }
    ],
    "message": "Music retrieved successfully"
  }
  ```

#### Get Music by ID

- **Endpoint:** `GET /music/:id`
- **Description:** Get a music entry's details by ID
- **Auth Required:** Yes
- **Input Parameters:** None (ID in URL path)
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "i9j0k1l2-m3n4-o5p6-q7r8-s9t0u1v2w3x4",
      "title": "Happy Days",
      "grade": "GRADE_1",
      "coverImage": "https://example.com/images/happy-days.jpg",
      "audioUrl": "https://example.com/audio/happy-days.mp3",
      "duration": 180,
      "tags": ["happy", "children", "upbeat"],
      "createdAt": "2025-05-23T10:30:00.000Z",
      "updatedAt": "2025-05-23T10:30:00.000Z"
    },
    "message": "Music retrieved successfully"
  }
  ```

#### Update Music

- **Endpoint:** `PATCH /music/:id`
- **Description:** Update a music entry
- **Auth Required:** Yes (Admin role)
- **Input Parameters:**
  ```json
  {
    "title": "Happy Days Remix",
    "artist": "Music Kids ft. DJ Junior",
    "duration": 200
  }
  ```
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "i9j0k1l2-m3n4-o5p6-q7r8-s9t0u1v2w3x4",
      "title": "Happy Days Remix",
      "artist": "Music Kids ft. DJ Junior",
      "duration": 200,
      "updatedAt": "2025-05-23T11:45:00.000Z"
    },
    "message": "Music updated successfully"
  }
  ```

#### Delete Music

- **Endpoint:** `DELETE /music/:id`
- **Description:** Delete a music entry
- **Auth Required:** Yes (Admin role)
- **Input Parameters:** None (ID in URL path)
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "i9j0k1l2-m3n4-o5p6-q7r8-s9t0u1v2w3x4"
    },
    "message": "Music deleted successfully"
  }
  ```

## Errors

Common error responses:

### Authentication Errors

```json
{
  "success": false,
  "error": "UNAUTHORIZED",
  "message": "You are not authorized to access this resource"
}
```

### Validation Errors

```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is not valid"
    },
    {
      "field": "password",
      "message": "Password must be between 8 and 20 characters"
    }
  ]
}
```

### Resource Not Found

```json
{
  "success": false,
  "error": "NOT_FOUND",
  "message": "The requested resource was not found"
}
```

### 7. Learning Management - Games

**Base Path:** `/game`

#### Create Game

- **Endpoint:** `POST /game/create-game`
- **Description:** Create a new game
- **Auth Required:** Yes (Admin role)
- **Input Parameters:**
  ```json
  {
    "title": "Math Challenge",
    "description": "Fun math game for kids",
    "instructions": "Answer the math questions correctly!",
    "type": "QUIZ",
    "thumbnail": "https://example.com/images/math-game.jpg",
    "timePerLevel": 60,
    "language": "ENGLISH",
    "gameConfig": {
      "difficulty": "easy",
      "shuffleQuestions": true,
      "questions": [
        {
          "id": "q1",
          "type": "quiz",
          "questionText": "1 + 1 = ?",
          "thumbnail": null,
          "options": ["3", "2", "1"],
          "answer": "2"
        },
        {
          "id": "q2",
          "type": "audio",
          "questionText": "Identify the animal sound.",
          "thumbnail": "https://cdn.app.com/images/lion.png",
          "audioUrl": "https://cdn.app.com/audio/lion.mp3",
          "options": ["Tiger", "Lion", "Bear"],
          "answer": "Lion"
        }
      ]
    }
  }
  ```
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "g8h9i0j1-k2l3-m4n5-o6p7-q8r9s0t1u2v3",
      "title": "Math Challenge",
      "description": "Fun math game for kids",
      "instructions": "Answer the math questions correctly!",
      "type": "QUIZ",
      "thumbnail": "https://example.com/images/math-game.jpg",
      "timePerLevel": 60,
      "language": "ENGLISH",
      "gameConfig": {
        "difficulty": "easy",
        "shuffleQuestions": true,
        "questions": [
          {
            "id": "q1",
            "type": "quiz",
            "questionText": "1 + 1 = ?",
            "options": ["3", "2", "1"],
            "answer": "2"
          }
        ]
      },
      "createdAt": "2025-05-23T10:30:00.000Z",
      "updatedAt": "2025-05-23T10:30:00.000Z"
    },
    "message": "Game created successfully"
  }
  ```

#### Get All Games

- **Endpoint:** `GET /game/get-all-games`
- **Description:** List all games
- **Auth Required:** Yes (Admin role)
- **Input Parameters:** None
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "g8h9i0j1-k2l3-m4n5-o6p7-q8r9s0t1u2v3",
        "title": "Math Challenge",
        "description": "Fun math game for kids",
        "type": "QUIZ",
        "thumbnail": "https://example.com/images/math-game.jpg",
        "language": "ENGLISH",
        "timePerLevel": 60
      },
      {
        "id": "h9i0j1k2-l3m4-n5o6-p7q8-r9s0t1u2v3w4",
        "title": "Animal Sounds",
        "description": "Identify animal sounds",
        "type": "AUDIO",
        "thumbnail": "https://example.com/images/animal-game.jpg",
        "language": "ENGLISH",
        "timePerLevel": 45
      }
    ],
    "message": "Games retrieved successfully"
  }
  ```

#### Get Game by ID

- **Endpoint:** `GET /game/get-game/:id`
- **Description:** Get a specific game by ID
- **Auth Required:** Yes (Admin role)
- **Input Parameters:** None (ID in URL path)
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "g8h9i0j1-k2l3-m4n5-o6p7-q8r9s0t1u2v3",
      "title": "Math Challenge",
      "description": "Fun math game for kids",
      "instructions": "Answer the math questions correctly!",
      "type": "QUIZ",
      "thumbnail": "https://example.com/images/math-game.jpg",
      "timePerLevel": 60,
      "language": "ENGLISH",
      "gameConfig": {
        "difficulty": "easy",
        "shuffleQuestions": true,
        "questions": [
          {
            "id": "q1",
            "type": "quiz",
            "questionText": "1 + 1 = ?",
            "options": ["3", "2", "1"],
            "answer": "2"
          }
        ]
      },
      "createdAt": "2025-05-23T10:30:00.000Z",
      "updatedAt": "2025-05-23T10:30:00.000Z"
    },
    "message": "Game retrieved successfully"
  }
  ```

#### Update Game

- **Endpoint:** `PUT /game/update-game/:id`
- **Description:** Update a game
- **Auth Required:** Yes (Admin role)
- **Input Parameters:**
  ```json
  {
    "title": "Math Challenge Pro",
    "description": "Advanced math game for kids",
    "timePerLevel": 90
  }
  ```
- **Sample Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "g8h9i0j1-k2l3-m4n5-o6p7-q8r9s0t1u2v3",
      "title": "Math Challenge Pro",
      "description": "Advanced math game for kids",
      "timePerLevel": 90,
      "updatedAt": "2025-05-23T11:45:00.000Z"
    },
    "message": "Game updated successfully"
  }
  ```

#### Delete Game

- **Endpoint:** `DELETE /game/delete-game/:id`
- **Description:** Delete a game
- **Auth Required:** Yes (Admin role)
- **Input Parameters:** None (ID in URL path)
- **Sample Response:**
  ```json
  {
    "success": true,
    "message": "Game with ID g8h9i0j1-k2l3-m4n5-o6p7-q8r9s0t1u2v3 has been successfully deleted"
  }
  ```

### 8. Child Activities (Future Implementation)

**Base Path:** `/child-activities`

*Note: This module is planned for future implementation to provide child-specific activity tracking and recommendations.*

**Planned Endpoints:**
- `GET /child-activities/courses` - Get available courses for children
- `GET /child-activities/courses/:id` - Get specific course details
- `GET /child-activities/music` - Get music activities for children
- `GET /child-activities/music/:id` - Get specific music activity
- `GET /child-activities/stories` - Get story activities for children
- `GET /child-activities/stories/:id` - Get specific story activity
- `GET /child-activities/progress` - Track child's activity progress
- `POST /child-activities/progress` - Record activity completion

## Common Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Invalid input data provided"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "UNAUTHORIZED",
  "message": "Authentication token is missing or invalid"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "FORBIDDEN",
  "message": "Insufficient permissions to access this resource"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "NOT_FOUND",
  "message": "Requested resource was not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "INTERNAL_SERVER_ERROR",
  "message": "An unexpected error occurred"
}
```
