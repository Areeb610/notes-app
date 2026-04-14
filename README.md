# 📝 Notes App

A modern full-stack notes application built as a monorepo with a Next.js frontend and FastAPI backend.

## 🚀 Tech Stack

### Frontend (`apps/web`)

- **Framework**: Next.js 16 with App Router
- **UI**: React 19, TailwindCSS 4, shadcn/ui
- **State**: React Hooks
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Theme**: next-themes (dark mode support)

### Backend (`apps/api`)

- **Framework**: FastAPI
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Auth**: JWT (python-jose) with bcrypt password hashing
- **CORS**: Configured for local development and production

## 📁 Project Structure

```
notes-app/
├── apps/
│   ├── web/          # Next.js frontend application
│   │   ├── src/
│   │   │   ├── app/  # Next.js app router pages
│   │   │   └── lib/  # Utilities and API client
│   │   └── public/   # Static assets
│   │
│   └── api/          # FastAPI backend application
│       ├── core/     # Security and configuration
│       ├── models/   # Database models
│       ├── routers/  # API endpoints
│       ├── schemas/  # Pydantic schemas
│       └── db.py     # Database connection
│
└── vercel.json       # Vercel deployment configuration
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Python 3.9+
- PostgreSQL database

### Backend Setup

1. Navigate to the API directory:

```bash
cd apps/api
```

2. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Configure environment variables in `.env`:

```
DATABASE_URL=postgresql://user:password@localhost:5432/notes_db
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

5. Run the development server:

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the web directory:

```bash
cd apps/web
```

2. Install dependencies:

```bash
pnpm install
```

3. Run the development server:

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

## ✨ Features

- **User Authentication**: Register and login with JWT-based authentication
- **Note Management**: Create, read, update, and delete notes
- **Responsive Design**: Mobile-friendly interface with TailwindCSS
- **Dark Mode**: Toggle between light and dark themes
- **Modern UI**: Built with shadcn/ui components

## 🚧 Roadmap

This is a learning project, and I'll be continuously adding new features as I explore different technologies and concepts.

## 🌐 Deployment

### Frontend (Vercel)

The frontend is deployed on Vercel. The root directory is configured to `apps/web` in the project settings.

### Backend

Can be deployed on:

- Railway
- Render
- AWS Lambda
- Any platform supporting FastAPI

## 📝 License

This project is open source and available for learning purposes.

## 🤝 Contributing

Feel free to open issues or submit pull requests if you'd like to contribute!

---

**Built with ❤️ while learning full-stack development with Next.js and FastAPI**
