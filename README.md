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
- **Nodemailer**: Email sending for OTP verification.
- **SMTP2G0**: Email sending for OTP verification - Use your preferred email sending service.
- **Neon**: Database hosting - Use your preferred database hosting service.

## Getting Started

### Installation

1. Clone the repository:   ```bash
   git clone <repository-url>
   cd <project-directory>   ```

2. Install dependencies:   ```bash
   pnpm install   ```

3. Set up your environment variables:
   Create a `.env` file in the root directory and add the following and copy the .env.example file to .env file and add your own values:

4. Run database migrations:   ```bash
   npx prisma migrate dev   ```

5. Start the development server:   ```bash
   pnpm dev   ```


### API Endpoints

- **POST /api/auth/signin**: Sign in a user with email and password.
- **POST /api/auth/signup**: Register a new user with email and password.
- **POST /api/password**: Handle password reset requests (OTP generation and verification).

### Usage

1. **Register a User**: Navigate to the signup page and fill in the required fields.
2. **Sign In**: Use the credentials to log in or click on "Sign in with Google" to authenticate using your Google account.

3. **Reset Password**: Follow the prompts to reset your password using OTP verification.


## What's not implemented, yet!

### Rate Limiting
Recommendation: https://arcjet.com/ 

- **Rate Limiting**: Implement rate limiting to prevent abuse of the API endpoints.

- **Email Verification**: Implement email verification in signupto ensure that the user's email address is valid.

- **Email Sending**: Implement rate for email sending for OTP verification.


## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.


## License

This project is licensed under the MIT License. See the LICENSE file for details.