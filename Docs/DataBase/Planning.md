# News Aggregator App - Database Schema



## **Tables**

### 1. `users`
Stores user account information and preferred news categories.

| Column                 | Type                   | Description |
|------------------------|-----------------------|-------------|
| `id`                   | INT (PK, auto)        | Primary key |
| `name`                 | VARCHAR(100)          | User's full name |
| `email`                | VARCHAR(255) UNIQUE   | Login email |
| `password`             | VARCHAR(255)          | Hashed password |
| `suggested_categories` | JSON / ARRAY of STRING | List of preferred news categories (e.g., `["technology","sports"]`) |
| `created_at`           | TIMESTAMP             | Account creation timestamp |
| `updated_at`           | TIMESTAMP             | Last profile update timestamp |



### 2. `bookmarks`
Stores news articles bookmarked by the user.

| Column       | Type                  | Description |
|--------------|---------------------|-------------|
| `id`         | INT (PK, auto)      | Primary key |
| `user_id`    | INT (FK → users.id) | Reference to the user |
| `bookmarks`  | JSON / ARRAY of STRING | List of bookmarked news URLs |
| `created_at` | TIMESTAMP            | Timestamp when bookmarks were created/updated |

> **Alternative Approach:**   -- going with this
Instead of storing all bookmarks as an array, you could store **one bookmark per row** for easier querying:  



## **Key Features Supported by This Schema**
- User authentication: login and signup.
- Suggested news categories stored per user.
- Bookmarks for saving news articles.
- Simple schema optimized for fetching dynamic news (no news storage required).

---

## **Implementation Notes**
- JSON/ARRAY fields are supported in PostgreSQL, MySQL 5.7+, and other modern databases.
- Consider normalizing bookmarks and categories if your app scales or needs complex queries.
- This schema is optimized for fast prototyping and a small-scale news aggregator app.

---
