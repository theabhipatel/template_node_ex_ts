# Node.js Express TypeScript Template

## 📌 Description

This is a boilerplate template for building a Node.js Express application with TypeScript. It comes with essential configurations, middleware, logging, error handling, and security features.

## 🚀 Features

- **TypeScript Support** for robust type safety
- **Express.js** as the backend framework
- **MongoDB with Mongoose** for database management
- **Environment Configuration** using `dotenv`
- **Security Enhancements** with `helmet`, `cors`, and `express-rate-limit`
- **Logging** with `winston` and `morgan`
- **Email Support** using `nodemailer`
- **Authentication & Validation** with `jsonwebtoken` and `joi`
- **Graceful Shutdown Handling**

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/theabhipatel/template_node_ex_ts.git
cd template_node_ex_ts
```

### 2️⃣ Install Dependencies

```sh
npm install
```

### 3️⃣ Create Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```env
PORT=5000
MONGO_DB_URL=mongodb://localhost:27017/yourdbname
NODE_ENV=development
JWT_SECRET=your_secret_key
```

### 4️⃣ Run the Application

#### Development Mode

```sh
npm run dev
```

#### Production Mode

```sh
npm run build
npm start
```

## 📂 Project Structure

```
template_node_ex_ts/
│── src/
│   ├── routes/       # API Routes
│   ├── middlewares/  # Express Middlewares
│   ├── utils/        # Utility Functions (Logger, DB connection, etc.)
│   ├── config.ts     # Configuration File
│   ├── app.ts        # Express App Setup
│   ├── index.ts      # Entry Point
│── .env              # Environment Variables
│── package.json      # Dependencies & Scripts
│── tsconfig.json     # TypeScript Configurations
```

## 🛡️ Security & Best Practices

- Uses `helmet` for setting secure HTTP headers.
- Implements `express-rate-limit` to prevent abuse.
- Handles errors and unexpected shutdowns gracefully.

## 🌍 Open Source
This project is open-source and contributions are welcome!
