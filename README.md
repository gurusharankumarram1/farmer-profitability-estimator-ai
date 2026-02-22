# Farmer Profitability Estimator AI

A web application that helps farmers estimate their crop profitability based on various parameters such as chosen crop, region, irrigation methods, and real-time reference data. The application features an AI-powered chat assistant utilizing a custom Ollama LLM endpoint to help farmers interpret their estimations and answer farming-related queries, all backed by a robust Next.js and MongoDB stack.

## 🌟 Features

- **Profitability Estimation**: Advanced formulaic crop profitability calculations utilizing localized Yield Profiles, Price Data, and Irrigation Modifiers.
- **AI Chat Assistant**: Integrated chat support leveraging a custom LLM endpoint (Ollama integration) to assist farmers with their queries and estimation results.
- **Secure Authentication**: JWT-based user authentication coupled with Email OTP verification.
- **Reference Data Management**: Pre-configured MongoDB models for Crops, Regions, Prices, Yield Profiles, and Irrigation Modifiers.
- **Interactive Dashboard**: View historical estimates, access generated reports, and visualize metrics through charts.
- **Responsive UI**: Built with Tailwind CSS and Radix UI (Lucide React icons) for a professional, accessible, and responsive user experience.

## 🏗️ Project Structure

The project is built on **Next.js 14 (App Router)** and follows a modular full-stack architecture.

```text
farmer-profitability-estimator-ai/
├── src/
│   ├── app/                 # Next.js App Router pages and layouts
│   │   ├── (auth)/          # Authentication pages (Login/Register)
│   │   ├── api/             # Next.js API Routes (auth, chat, estimate, reference-data)
│   │   ├── dashboard/       # Main user dashboard view
│   │   ├── estimate/        # New estimate formulation pages
│   │   ├── history/         # Estimate history and history tracking
│   │   └── reports/         # Detailed reports generation/view
│   ├── components/          # Reusable React components (UI, Forms, Charts, Tables)
│   ├── controllers/         # Backend logic mapping specific API routes
│   ├── models/              # Mongoose DB schemas (Crop, User, Estimate, Region, OTP, etc.)
│   ├── services/            # Core business logic (auth, estimate formulation, mailing)
│   ├── middleware/          # API/Route middlewares (e.g., route protection)
│   ├── utils/               # Helper utility functions
│   └── validations/         # schemas for payload validations
└── ...config/env files
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS, Lucide React
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: Custom Authentication (JWT, Bcrypt, Email OTP)
- **Email Service**: Nodemailer
- **AI Integration**: Ollama Endpoint (Llama 3.1)

## 🚀 Setup Steps

### 1. Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or v20 recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A remote Database via [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or a local MongoDB instance.

### 2. Clone the Repository
```bash
git clone <repository-url>
cd farmer-profitability-estimator-ai
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configuration
Create a `.env.local` file in the root directory based on the following template and fill in your details:

```env
# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/farmer-profitability?retryWrites=true&w=majority

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Authentication Secuity
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# AI LLM Endpoint Configuration
OLLAMA_ENDPOINT=https://your-custom-endpoint/api/chat/completions
OLLAMA_MODEL=llama3.1:latest
OLLAMA_API_KEY=your_ollama_authorization_key

# Email Configuration (Nodemailer for OTPs)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_app_password
SMTP_FROM="Farmer Profitability Estimator App" <your_email@gmail.com>
```

### 5. Start the Application
Run the Next.js development server:

```bash
npm run dev
```

The application will be accessible at [http://localhost:3000](http://localhost:3000).
