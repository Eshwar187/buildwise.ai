# BuildWise.ai

![BuildWise.ai Logo](public/favicon.svg)

Next-gen AI-powered floor plan generator and construction platform. BuildWise.ai leverages Gemini and Groq APIs to create intelligent floor plans, provide material recommendations, and connect users with local designers.

## 🚀 Features

- **AI-Powered Floor Plan Generation**: Create detailed floor plans using Gemini and Groq AI
- **Real-Time Designer Matching**: Find local designers using Google Maps Platform API
- **Material Recommendations**: Get sustainable material suggestions based on your location and budget
- **Energy Efficiency Analysis**: Receive recommendations for energy-efficient building options
- **Project Management**: Track your construction projects from planning to completion
- **User & Admin Dashboards**: Separate interfaces for users and administrators
- **Responsive UI**: Beautiful, elegant UI with dark/light themes

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Integrations](#api-integrations)
- [Database](#database)
- [Authentication](#authentication)
- [Features in Detail](#features-in-detail)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🔧 Prerequisites

- Node.js 18+ and npm
- Python 3.8+ with pip
- MongoDB Atlas account
- API keys for:
  - Clerk (Authentication)
  - Google Maps Platform
  - Gemini
  - Groq

## 📥 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/buildwise.ai.git
cd buildwise.ai
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Install Python dependencies:
```bash
npm run install-python-deps
```

## 🔐 Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/buildwise?retryWrites=true&w=majority
MONGODB_DB=buildwise

# AI APIs
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Email (optional)
RESEND_API_KEY=your_resend_api_key
```

## 🏃‍♂️ Running the Application

1. Initialize MongoDB collections:
```bash
npm run init-mongodb-collections
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
buildwise.ai/
├── app/                    # Next.js app directory
│   ├── api/                # API routes
│   │   ├── project-create/ # Project creation API
│   │   ├── projects/       # Projects API
│   │   ├── real-time/      # Real-time data APIs
│   │   │   ├── designers/  # Designers API
│   │   │   ├── floor-plans/# Floor plans API
│   │   │   └── materials/  # Materials API
│   ├── dashboard/          # Dashboard pages
│   ├── admin/              # Admin pages
│   └── page.tsx            # Home page
├── components/             # React components
├── lib/                    # Utility functions and models
│   ├── mongodb.ts          # MongoDB connection
│   ├── mongodb-models.ts   # MongoDB models
│   └── local-db.ts         # Local database fallback
├── public/                 # Static files
│   ├── images/             # Images
│   └── uploads/            # Uploaded files
├── scripts/                # Utility scripts
└── .env.local              # Environment variables
```

## 🔌 API Integrations

### Gemini API
Used for generating floor plans and providing intelligent suggestions based on user inputs.

### Groq API
Used for fast AI processing and real-time floor plan generation.

### Google Maps Platform API
Used for finding local designers based on user location.

### Clerk Authentication
Used for user authentication and management.

## 💾 Database

BuildWise.ai uses MongoDB Atlas for data storage. The following collections are created automatically:

- **users**: User information and preferences
- **projects**: Construction project details
- **floorPlans**: Generated floor plans
- **designers**: Designer information
- **materials**: Building materials
- **regions**: Geographic regions
- **verificationCodes**: Email verification codes
- **adminRequests**: Admin access requests
- **energyRecommendations**: Energy efficiency recommendations

## 🔒 Authentication

BuildWise.ai uses Clerk for authentication. The following features are implemented:

- User sign-up and sign-in
- Email verification
- Password reset
- Admin authentication
- Protected routes

## 🌟 Features in Detail

### Floor Plan Generation
Users can create detailed floor plans by providing:
- Land dimensions
- Budget
- Room preferences
- Style preferences
- Number of stories
- Accessibility requirements

The AI generates floor plans with:
- Room layouts
- Dimensions
- Gates/entrances
- Color schemes

### Designer Matching
Users can find local designers by:
- Entering their location
- Viewing designer profiles
- Contacting designers directly
- Viewing designer ratings and experience

### Material Recommendations
Users receive material recommendations based on:
- Project location
- Budget
- Style preferences
- Sustainability requirements

### Energy Efficiency Analysis
Users receive energy efficiency recommendations for:
- Insulation
- Windows
- HVAC systems
- Renewable energy options

### Project Management
Users can:
- Create and manage multiple projects
- Track project progress
- Update project details
- Share projects with collaborators

## 🔍 Admin Features

Administrators can:
- Manage users
- Review and approve designer listings
- Monitor system usage
- Access analytics

## 🛠️ Troubleshooting

### MongoDB Connection Issues
- Ensure your MongoDB URI is correct
- Check that your IP address is whitelisted in MongoDB Atlas
- Verify that your MongoDB user has the correct permissions
- Run `npm run test-mongodb` to test the connection

### API Key Issues
- Verify that all API keys are correctly set in the `.env.local` file
- Check API key permissions and quotas

### Python Dependencies
If you encounter issues with Python dependencies, try installing them manually:
```bash
pip install numpy Pillow opencv-python matplotlib
```

### Clerk Authentication Issues
- Ensure Clerk keys are correctly set in the `.env.local` file
- Check Clerk dashboard for any issues with your application

## 👥 Admin Credentials

For testing the admin dashboard, use the following credentials:
- Username: eshwar005
- Email: eshwar09052005@gmail.com
- Password: Eshwar@005

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 📞 Contact

For any questions or support, please contact the BuildWise.ai team at jeshwar09052009@gmail.com.

---

Built with ❤️ by the BuildWise.ai team
