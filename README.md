# BixStock - Enterprise Inventory Management System

## Overview
A full-stack inventory management dashboard built with Next.js and AWS infrastructure, demonstrating cloud architecture and modern frontend development practices.

## Inspiration & Purpose
My inspiration came from wanting to create a robust enterprise-level application that would demonstrate my AWS skills and full-stack capabilities. The project was designed to showcase both frontend polish and backend scalability while implementing core inventory management features.

## Tech Stack Decisions
### Frontend
- **Next.js & TypeScript**: Chosen for type safety and enhanced development experience
- **Material UI Data Grid**: Implemented for handling inventory data with sorting and filtering capabilities
- **Redux Toolkit**: Used for state management
- **Tailwind CSS**: Selected for UI development and consistent styling

### Backend & Infrastructure
- **AWS EC2**: Hosts the application
- **AWS RDS (PostgreSQL)**: Manages database operations
- **AWS S3**: Handles static assets
- **AWS API Gateway**: Manages API endpoints
- **AWS Amplify**: Handles deployment
- **Prisma ORM**: Manages database queries and schema

## Development Tools
- pgAdmin4 for PostgreSQL database management
- Node.js for server-side operations
- TypeScript for code reliability

## Current Features
- Static inventory display with sorting and filtering
- Dark/Light mode toggle
- Admin user authentication
- Responsive dashboard layout
- AWS infrastructure integration

## Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run development server: `npm run dev`

## Deployment
The application is deployed using AWS Amplify.
