# CoPass Backend Starter

## Features
- SIWE (Sign-In with Ethereum) authentication
- User profile storage (MongoDB)
- Trip CRUD APIs
- Matching logic
- Ready for XMTP, Push Protocol, and escrow contract integration

## Setup

1. Install dependencies:
   ```sh
   npm install
   ```
2. Set up your `.env` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/copass
   JWT_SECRET=your_jwt_secret_here
   ```
3. Start the server:
   ```sh
   npm run dev
   ```

## Directory Structure
```
backend/
  src/
    controllers/
    models/
    routes/
    services/
    utils/
    app.js
    server.js
  .env
  package.json
  README.md
``` 