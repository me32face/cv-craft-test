# CV Craft

CV Craft is a modern, professional resume and CV builder application designed to help users create stunning resumes with ease. Leverages the power of AI to assist in content generation, ensuring your resume stands out.

![CV Craft](/public/cv-craft-banner.png)

## 🚀 Features

- **AI-Powered Content Generation:** Uses Google Gemini AI to help write professional summaries, skills, and work experience descriptions.
- **Drag & Drop Interface:** Easily rearrange sections of your resume using intuitive drag-and-drop functionality.
- **Real-time Preview:** See changes instantly as you edit your resume.
- **PDF Export:** High-quality PDF export functionality to save and share your resume.
- **Secure Authentication:** User accounts secured with JWT and Google OAuth integration.
- **Modern UI/UX:** Built with React, Next.js, and Tailwind CSS for a sleek and responsive design.

## 🛠️ Tech Stack

### Frontend

- **Framework:** [Next.js](https://nextjs.org/) (React)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management & API:** Axios, React Hooks
- **Key Libraries:**
  - `@google/generative-ai`: AI content generation.
  - `react-dnd` / `react-draggable`: Drag and drop interactions.
  - `jspdf` & `html2canvas`: PDF generation.
  - `framer-motion`: Smooth animations.
  - `sweetalert2`: Beautiful modal interactions.

### Backend

- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens), Google Auth Library.

## 📋 Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local installation or MongoDB Atlas connection string)

## ⚙️ Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/cv-craft.git
    cd cv-craft
    ```

2.  **Install Frontend Dependencies:**

    ```bash
    npm install
    ```

3.  **Install Backend Dependencies:**
    Navigate to the backend directory and install dependencies:
    ```bash
    cd backend
    npm install
    ```

## 📚 API Documentation

Detailed API documentation is available in [API_DOCUMENTATION.md](API_DOCUMENTATION.md).

## 🔐 Environment Variables

You need to set up environment variables for both the frontend and backend.

### Backend (`backend/.env`)

Create a `.env` file in the `backend/` directory with the following keys:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
```

### Frontend (`.env` or `.env.local`)

Create a `.env` file in the root directory (or ensure these are set):

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

## 🚀 Running the Project

1.  **Start the Backend Server:**
    Open a terminal, navigate to the `backend` folder, and run:

    ```bash
    cd backend
    npm start
    ```

    The server will start on `http://localhost:5000` (or your defined PORT).

2.  **Start the Frontend Development Server:**
    Open a new terminal in the **root** project directory and run:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the [MIT License](LICENSE).
