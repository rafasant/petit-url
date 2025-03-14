# Petit URL

A URL shortener service built with Node.js, Express, MongoDB, and React.

## Features

- Shorten long URLs to easy-to-share links
- Custom URL slugs (e.g., petit.url/my-custom-slug)
- User authentication
- Dashboard to manage and track your URLs
- Visit tracking
- Rate limiting to prevent abuse

## Tech Stack

- **Backend**: Node.js, Express, TypeScript, MongoDB
- **Frontend**: React, TypeScript
- **Database**: MongoDB
- **Caching/Rate Limiting**: Redis
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Node.js (v14+)
- Docker and Docker Compose

### Setup

1. Clone the repository:
```
git clone https://github.com/yourusername/petit-url.git
cd petit-url
```
2. Start MongoDB and Redis with Docker:
```
docker-compose up -d
```
(at this point, you can run application straight from docker)

3. Install backend dependencies and run database locally:
```
cd backend
npm install
./run-databases.sh (This will run both MongoDB and Redis in Docker containers locally)
```
4. Set up environment variables:
Create a `.env` file in the backend directory:
```
MONGODB_URI=mongodb://admin:password@localhost:27017/petit-url?authSource=admin
REDIS_HOST=localhost
REDIS_PORT=6379
PORT=3001
BASE_URL=http://localhost:3001
```
5. Start the backend:
```
npm run dev
```
6. In another terminal, install frontend dependencies:
```
cd ../frontend
npm install
```
7. Start the frontend:
```
npm start
```
8. The application should now be running at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api

## API Endpoints

- **POST /api/shorten**: Create a shortened URL
- **GET /:slug**: Redirect to the original URL
- **POST /api/auth/register**: Register a new user
- **POST /api/auth/login**: Login an existing user
- **GET /api/urls**: Get all URLs for the authenticated user

## Rate Limiting

To prevent abuse, the API implements rate limiting:
- General API requests: 100 requests per 15 minutes per IP
- URL shortening: 10 requests per hour per IP
- Authentication attempts: 5 requests per hour per IP

## Future Improvements

- Add URL analytics dashboard
- Implement URL expiration dates
- Improve test coverage
- Add mobile responsiveness

## License

MIT