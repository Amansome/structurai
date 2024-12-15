# Authentication Project

## Overview

This project implements a robust authentication system using Next.js, NextAuth.js, and Prisma. It supports user registration, sign-in, password reset, and OTP verification, ensuring a secure and user-friendly experience.

## Features

- **User Registration**: Users can create an account with email and password.
- **Email Verification**: An OTP is sent to the user's email for verification during registration and password reset.
- **Password Management**: Users can reset their passwords securely using OTP verification.
- **Session Management**: Utilizes JWT for session management, ensuring secure user sessions.
- **Error Handling**: Comprehensive error handling for authentication processes.
- **Google Sign-In**: Users can sign in using their Google account for a seamless authentication experience.

## Technologies Used

- **Next.js**: A React framework for building server-side rendered applications.
- **Auth.js**: Authentication library for Next.js applications.
- **Prisma**: ORM for database management.
- **Zod**: Schema validation for user input.
- **bcryptjs**: Password hashing for secure storage.

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL (or your preferred database)

### Installation

1. Clone the repository:   ```bash
   git clone <repository-url>
   cd <project-directory>   ```

2. Install dependencies:   ```bash
   npm install   ```

3. Set up your environment variables:
   Create a `.env` file in the root directory and add the following:   ```env
   DATABASE_URL=your_database_url
   NEXT_PUBLIC_BASE_URL=http://localhost:3000   ```

4. Run database migrations:   ```bash
   npx prisma migrate dev   ```

5. Start the development server:   ```bash
   npm run dev   ```

### API Endpoints

- **POST /api/auth/signin**: Sign in a user with email and password.
- **POST /api/auth/signup**: Register a new user with email and password.
- **POST /api/password**: Handle password reset requests (OTP generation and verification).

### Usage

1. **Register a User**: Navigate to the signup page and fill in the required fields.
2. **Sign In**: Use the credentials to log in or click on "Sign in with Google" to authenticate using your Google account.

3. **Reset Password**: Follow the prompts to reset your password using OTP verification.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.