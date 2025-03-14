# StructurAI Deployment Guide

This guide will walk you through deploying your StructurAI application to Vercel.

## Prerequisites

Before deploying, make sure you have:

1. A GitHub account
2. A Vercel account (you can sign up at [vercel.com](https://vercel.com) using your GitHub account)
3. Your OpenRouter API key (get one at [openrouter.ai](https://openrouter.ai))

## Step 1: Push Your Code to GitHub

1. Create a new repository on GitHub by going to [https://github.com/new](https://github.com/new)
2. Add your new GitHub repository as a remote:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   ```
3. Push your code to GitHub:
   ```bash
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

1. Go to [Vercel](https://vercel.com/) and sign in (or create an account if you don't have one)
2. Click on "Add New" > "Project"
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
     - `AUTH_SECRET`: XunxE4Iu9ARl1dvaalni2cMKnkbJ+WG48OGQXe9DbBc=
     - `OPENROUTER_API_KEY`: Your OpenRouter API key
     - `SKIP_ENV_VALIDATION`: true

6. Click "Deploy"

## Step 3: Update Environment Variables After Deployment

After the initial deployment, you'll need to update the `NEXT_PUBLIC_BASE_URL` and `BASE_URL` with your actual Vercel deployment URL:

1. Go to your project in the Vercel dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Update `NEXT_PUBLIC_BASE_URL` and `BASE_URL` with your actual deployment URL (e.g., https://your-project-name.vercel.app)
4. Click "Save"
5. Trigger a new deployment by clicking "Deployments" > select the latest deployment > "Redeploy"

## Step 4: Test Your Deployment

1. Visit your deployed application at the Vercel URL
2. Test the StructurAI feature by navigating to the StructurAI page
3. Test the Brain Dumper feature by navigating to the Brain Dumper page
4. Ensure that the OpenRouter API is working correctly by testing the processing functionality

## Step 5: Set Up a Custom Domain (Optional)

If you want to use a custom domain for your application:

1. Go to your project in the Vercel dashboard
2. Navigate to "Settings" > "Domains"
3. Add your custom domain
4. Follow the instructions to configure your DNS settings
5. Update the `NEXT_PUBLIC_BASE_URL` and `BASE_URL` environment variables with your custom domain
6. Trigger a new deployment

## Troubleshooting

If you encounter any issues during deployment, check the following:

1. Make sure all required environment variables are set in the Vercel dashboard
2. Check the deployment logs for any errors by going to "Deployments" and clicking on the latest deployment
3. Ensure that your application works locally with the same environment variables
4. Verify that the `vercel.json` file is properly configured
5. If you encounter issues with the OpenRouter API, check your API key and ensure it has sufficient credits

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [OpenRouter Documentation](https://openrouter.ai/docs)
- [Custom Domain Setup Guide](https://vercel.com/docs/projects/domains/add-a-domain) 