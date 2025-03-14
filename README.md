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

1. Clone the repository:
```bash
git clone https://github.com/raymond-UI/Nextjs-auth.git
```

3. Install dependencies:
```bash
   pnpm install
```

4. Set up your environment variables:
   Create a `.env` file in the root directory and add the following and copy the .env.example file to .env file and add your own values:

5. Run database migrations:
```bash
   npx prisma migrate dev
```

7. Start the development server:
```bash
   pnpm dev
```


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

# StructurAI

StructurAI is an application that transforms unstructured ideas into structured app development plans using DeepSeek R1 Distill Llama 70B via OpenRouter.

## Features

- Transform unstructured ideas into structured app development plans
- Multiple templates for different development approaches
- Copy-paste friendly output format
- Dark/light mode theme toggle
- Export options (Markdown, JSON, Text)

## Deployment to Vercel

### Prerequisites

- [GitHub](https://github.com/) account
- [Vercel](https://vercel.com/) account
- [OpenRouter](https://openrouter.ai/) API key

### Step 1: Push your code to GitHub

1. Create a new repository on GitHub
2. Initialize your local repository (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
3. Add your GitHub repository as a remote:
   ```bash
   git remote add origin https://github.com/yourusername/structurai.git
   ```
4. Push your code to GitHub:
   ```bash
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. Log in to your [Vercel](https://vercel.com/) account
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: (leave as default)
   - Output Directory: (leave as default)

5. Set up environment variables:
   - Click on "Environment Variables" and add the following:
     - `NEXT_PUBLIC_BASE_URL`: Your Vercel deployment URL (e.g., https://structurai.vercel.app)
     - `BASE_URL`: Same as above
     - `AUTH_SECRET`: Generate with `openssl rand -base64 32` or use a secure random string
     - `OPENROUTER_API_KEY`: Your OpenRouter API key
     - `SKIP_ENV_VALIDATION`: true
     - Add any other required environment variables from `.env.production`

6. Click "Deploy"

### Step 3: Update Environment Variables After Deployment

After the initial deployment, you'll need to update the `NEXT_PUBLIC_BASE_URL` and `BASE_URL` with your actual Vercel deployment URL:

1. Go to your project in the Vercel dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Update `NEXT_PUBLIC_BASE_URL` and `BASE_URL` with your actual deployment URL
4. Click "Save"
5. Trigger a new deployment by clicking "Deployments" > select the latest deployment > "Redeploy"

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/structurai.git
   cd structurai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example` and add your environment variables

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## License

[MIT](LICENSE)
