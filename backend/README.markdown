# Daily Diaries

*Daily Diaries* is a microservices-based social blogging platform built with Spring Boot. Users can register, create blogs, comment on posts, react with likes, follow other users, and view a personalized feed. The project uses PostgreSQL for data storage, JWT for authentication, and an API Gateway for routing requests.

## Architecture

The application is composed of the following microservices:

- **API Gateway** (Port: 8080)
  - Routes requests to appropriate microservices.
  - Handles authentication and load balancing.
- **User Service** (Port: 8081)
  - Manages user registration, login, and profile retrieval.
- **Blog Service** (Port: 8082)
  - Handles blog creation, retrieval by user IDs, and deletion.
- **Reaction Service** (Port: 8083)
  - Manages reactions (e.g., likes) on blogs.
- **Comment Service** (Port: 8084)
  - Manages blog comments, including creation, retrieval, deletion, and listing by blog ID.
- **Feed Service** (Port: 8085)
  - Manages user follows and generates personalized feeds.

## Prerequisites

- **Java 17** (JDK)
- **Maven** (3.8+)
- **PostgreSQL** (14+)
- **Postman** (for API testing)
- **Git** (for cloning the repository)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/daily-diaries.git
cd daily-diaries
```

### 2. Set Up PostgreSQL

1. Install and start PostgreSQL.
2. Create a database named `daily_diaries`:
   ```sql
   CREATE DATABASE daily_diaries;
   ```
3. Create the required tables:
   ```sql
   -- Users table
   CREATE TABLE IF NOT EXISTS users (
       id BIGSERIAL PRIMARY KEY,
       email VARCHAR(255) NOT NULL UNIQUE,
       password VARCHAR(255) NOT NULL,
       bio TEXT
   );

   -- Blogs table
   CREATE TABLE IF NOT EXISTS blogs (
       id BIGSERIAL PRIMARY KEY,
       title VARCHAR(255) NOT NULL,
       content TEXT NOT NULL,
       user_id BIGINT NOT NULL,
       FOREIGN KEY (user_id) REFERENCES users(id)
   );

   -- Comments table
   CREATE TABLE IF NOT EXISTS comments (
       id BIGSERIAL PRIMARY KEY,
       blog_id BIGINT NOT NULL,
       user_id BIGINT NOT NULL,
       content TEXT NOT NULL,
       FOREIGN KEY (blog_id) REFERENCES blogs(id),
       FOREIGN KEY (user_id) REFERENCES users(id)
   );

   -- Reactions table
   CREATE TABLE IF NOT EXISTS reactions (
       id BIGSERIAL PRIMARY KEY,
       blog_id BIGINT NOT NULL,
       user_id BIGINT NOT NULL,
       type VARCHAR(50) NOT NULL,
       FOREIGN KEY (blog_id) REFERENCES blogs(id),
       FOREIGN KEY (user_id) REFERENCES users(id)
   );

   -- Follows table
   CREATE TABLE IF NOT EXISTS follows (
       follower_id BIGINT NOT NULL,
       followee_id BIGINT NOT NULL,
       PRIMARY KEY (follower_id, followee_id),
       FOREIGN KEY (follower_id) REFERENCES users(id),
       FOREIGN KEY (followee_id) REFERENCES users(id)
   );
   ```
4. Insert test data:
   ```sql
   INSERT INTO users (id, email, password, bio) VALUES
       (1, 'user1@example.com', 'hashed_password', 'User 1'),
       (4, 'user4@example.com', 'hashed_password', 'User 4');

   INSERT INTO blogs (title, content, user_id) VALUES
       ('Test Blog', 'This is a test blog content', 1);

   INSERT INTO comments (blog_id, user_id, content) VALUES
       (1, 4, 'Great post!'),
       (1, 4, 'Nice read!');
   ```

### 3. Configure Services

Each microservice has an `application.properties` file in `src/main/resources`. Update the database connection settings:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/daily_diaries
spring.datasource.username=your_postgres_username
spring.datasource.password=your_postgres_password
spring.jpa.hibernate.ddl-auto=validate
```

### 4. Build and Run Services

1. Build all services:
   ```bash
   mvn clean install
   ```
2. Run each service in a separate terminal:
   ```bash
   # API Gateway
   cd api-gateway
   mvn spring-boot:run

   # User Service
   cd user-service
   mvn spring-boot:run

   # Blog Service
   cd blog-service
   mvn spring-boot:run

   # Reaction Service
   cd reaction-service
   mvn spring-boot:run

   # Comment Service
   cd comment-service
   mvn spring-boot:run

   # Feed Service
   cd feed-service
   mvn spring-boot:run
   ```

### 5. Test the APIs

1. Import the Postman collection:
   - Open Postman.
   - Click *Import* > *File* > Select `DailyDiariesPostmanCollection.json` from the repository root.
2. Set the `baseUrl` variable in Postman:
   - Collection Variables: `baseUrl = http://localhost:8080`
3. Run the requests in order:
   - **User Service**:
     - `Register User`: Creates a user and sets `userId`.
     - `Login User`: Generates a JWT and sets `token`.
     - `Get User by Email`: Retrieves user details.
   - **Blog Service**:
     - `Create Blog`: Creates a blog and sets `blogId`.
     - `Get Blogs by User IDs`: Retrieves blogs for specified users.
     - `Delete Blog`: Deletes a blog (owner only).
   - **Comment Service**:
     - `Add Comment`: Adds a comment to a blog.
     - `Get Comment`: Retrieves a comment by ID.
     - `Get All Comments`: Retrieves all comments for a blog (paginated).
     - `Delete Comment`: Deletes a comment (owner only).
   - **Feed Service**:
     - `Follow User`: Follows a user.
     - `Unfollow User`: Unfollows a user.
     - `Get Feed`: Retrieves the user’s feed.
   - **Reaction Service**:
     - `Add Reaction`: Adds a reaction (e.g., like) to a blog.

## Project Structure

```
daily-diaries/
├── api-gateway/
│   └── src/main/java/com/dailydiaries/
├── user-service/
│   └── src/main/java/com/dailydiaries/
├── blog-service/
│   └── src/main/java/com/dailydiaries/
├── reaction-service/
│   └── src/main/java/com/dailydiaries/
├── comment-service/
│   └── src/main/java/com/dailydiaries/
├── feed-service/
│   └── src/main/java/com/dailydiaries/
├── DailyDiariesPostmanCollection.json
├── README.md
└── pom.xml
```

Each service follows a standard Spring Boot structure:
- `entity/`: DTOs and JPA entities.
- `repository/`: Spring Data JPA repositories.
- `service/`: Business logic.
- `controller/`: REST API endpoints.

## Key API Endpoints

### User Service (Port: 8081)
- `POST /api/v2/users/register`: Register a new user.
- `POST /api/v2/users/token`: Login and get JWT.
- `GET /api/v2/users/email/{email}`: Get user by email.

### Blog Service (Port: 8082)
- `POST /api/v2/blogs`: Create a blog.
- `GET /api/v2/blogs?userIds={ids}&page={page}&size={size}`: Get blogs by user IDs (paginated).
- `DELETE /api/v2/blogs/{id}`: Delete a blog (owner only).

### Comment Service (Port: 8084)
- `POST /api/v2/comments`: Add a comment to a blog.
- `GET /api/v2/comments/{id}`: Get a comment by ID.
- `GET /api/v2/comments/blog/{blogId}?page={page}&size={size}`: Get all comments for a blog (paginated).
- `DELETE /api/v2/comments/{id}`: Delete a comment (owner only).

### Feed Service (Port: 8085)
- `POST /api/v2/feed/{userId}/follow`: Follow a user.
- `POST /api/v2/feed/{userId}/unfollow`: Unfollow a user.
- `GET /api/v2/feed?page={page}&size={size}`: Get user’s feed (paginated).

### Reaction Service (Port: 8083)
- `POST /api/v2/reactions`: Add a reaction to a blog.

*Note*: All requests require `Authorization: Bearer {{token}}` and some require `X-Auth-User-Id: {{userId}}`.

## Debugging

- **Logs**: Enable debug logging in each service’s `application.properties`:
  ```properties
  logging.level.com.dailydiaries=DEBUG
  logging.level.org.springframework.web=DEBUG
  ```
- **Database**: Verify table contents:
  ```sql
  SELECT * FROM users;
  SELECT * FROM blogs;
  SELECT * FROM comments;
  SELECT * FROM reactions;
  SELECT * FROM follows;
  ```
- **Common Issues**:
  - **404 Not Found**: Ensure the resource ID exists and services are running.
  - **403 Forbidden**: Verify `X-Auth-User-Id` matches the resource owner.
  - **400 Bad Request**: Check for ID type mismatches (all IDs are `Long`).
  - **500 Internal Server Error**: Share service logs for debugging.

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

Please include:
- A clear description of changes.
- Relevant test cases in the Postman collection.
- Updated database schema if applicable.

Report issues via the GitHub Issues tab.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

*Happy blogging with Daily Diaries!*