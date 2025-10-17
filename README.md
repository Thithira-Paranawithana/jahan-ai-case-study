


# User Preferences Application

A full-stack web application for managing user preferences, built with Django REST Framework (backend) and Webix Jet (frontend). This system provides user account management including authentication, profile customization, notifications, privacy controls, and theme settings.

## Features

- **Authentication**: User registration, login, logout with JWT token-based authentication
- **Profile Management**: View and update personal information and contact details
- **Password Management**: Change password with validation and strength indicators
- **Account Deletion**: Secure account deletion with password confirmation
- **Notification Settings**: Customize notification preferences including notification sound change
- **Privacy Controls**: Manage account visibility and data sharing settings
- **Theme Customization**: Multiple theme customization options including light/dark theme, font changes and accessibility improvement

## Technology Stack

**Backend:**
- Django REST Framework 
- Simple JWT for authentication
- SQLite database

**Frontend:**
- Webix Jet 
- JavaScript 

**Testing:**
- Jest 
- Babel Jest

## Project Structure Overview

```
project-root/
├── Django_Backend/
│   ├── user_preferences/          # Django project
│   ├── accounts/                  # Authentication app
│   ├── manage.py
│   └── requirements.txt
├── Webix_Frontend/
│   ├── sources/                   # Frontend source code
│   │   ├── myapp.js/      
│   │   ├── config/                # API Config           
│   │   ├── views/                 # UI views
│   │   ├── services/              # API services
│   │   ├── helpers/               # Utilities
│   │   └── styles/                # CSS files
│   ├── test/                      # Jest tests
│   └── package.json
│   
├── Postman_API_testing.json    # API documentation
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd Django_Backend
```

2. Create and activate a virtual environment:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Start the development server:
```bash
python manage.py runserver
```

The backend will run at `http://127.0.0.1:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd Webix_Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run start
```

The frontend will run at `http://localhost:5173`

## Testing

### Frontend Tests

Run all tests:
```bash
npm test
```

## API Documentation

Import the `Postman_API_testing.json` file into Postman to view API documentation including:
- Authentication endpoints
- User profile endpoints
- Password management
- Account operations

## Demo Credentials

```
Email: john@example.com
Password: Password@123
```
