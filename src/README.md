# SecureBank AI - Fraud Detection Dashboard

A professional fraud detection dashboard built with React, TypeScript, Tailwind CSS, and Supabase.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MacBook/Computer with modern browser

## Installation & Setup

1. **Clone/Download the project** and navigate to the directory:
   ```bash
   cd fraud-detection-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Supabase Configuration

The project is already configured with Supabase credentials. The authentication system supports:

- **Bank Manager**: Full access to all features
- **Fraud Analyst**: Access to analysis tools and alerts
- **Compliance Officer**: Access to compliance and reporting features

## Project Structure

```
├── App.tsx                 # Main application component
├── components/             # React components
│   ├── ui/                # Shadcn/ui components
│   ├── Dashboard.tsx      # Main dashboard
│   ├── LoginPage.tsx      # Authentication
│   └── ...               # Feature components
├── styles/               # Global styles
├── utils/                # Utilities and Supabase client
└── package.json          # Project configuration
```

## Features

- 🔐 Role-based authentication (Bank Manager, Fraud Analyst, Compliance Officer)
- 📊 Real-time fraud monitoring dashboard
- 🗺️ Interactive global fraud heatmap
- 📈 Risk scoring with gauge visualizations
- 🕸️ Transaction graph explorer
- 🔍 Dark web monitoring
- 🤖 Explainable AI insights
- ✅ Compliance checking (RBI/SEBI/AML)
- ⚡ Real-time alerts and notifications
- 🌙 Dark/Light mode toggle
- 📱 Responsive design optimized for desktop

## Usage

1. Start the development server with `npm run dev`
2. Access the application at `http://localhost:3000`
3. Login with appropriate role credentials
4. Navigate through the dashboard features

The application will automatically connect to the configured Supabase instance for authentication and data management.