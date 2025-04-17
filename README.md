# BuildWise.ai

Next-gen AI-powered floor plan generator and construction platform.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+ with pip

### Installation

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

### Environment Setup

1. Create a `.env.local` file in the root directory with the following variables:
```
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# MongoDB
MONGODB_URI=your_mongodb_uri
MONGODB_DB=buildwise

# AI APIs
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
```

### Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Checking the Environment

1. Check if the Python environment is properly set up:
```bash
npm run check-python
```

2. Check if all API routes are working properly:
```bash
npm run check-routes
```

## Features

- AI-powered floor plan generation
- 3D visualization of floor plans
- Material recommendations
- Energy efficiency analysis
- Designer matching
- Project management
- Admin dashboard

## Troubleshooting

### Python Dependencies

If you encounter issues with Python dependencies, try installing them manually:

```bash
pip install numpy Pillow opencv-python matplotlib
```

### MongoDB Connection

If you encounter MongoDB connection issues, make sure:
1. Your MongoDB URI is correct
2. Your IP address is whitelisted in MongoDB Atlas
3. Your MongoDB user has the correct permissions

### API Routes

If you encounter 404 errors, make sure the server is running:

```bash
npm run dev
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
