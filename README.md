# MovieMate 🎬

MovieMate is a project built to explore and learn about modern web development technologies. It serves as a social platform where users can **discover, review, and discuss movies**, while also acting as a hands-on learning experience for working with Next.js, Firebase, and state management solutions like Context API and Zustand.

## 📸 Project Preview

![MovieMate Preview](public/moviemate.png)

## 🔥 Features

- Search and review movies 🎥
- Trending and top-rated movie lists 🔝
- User authentication 🔐 (via Firebase)
- TMDb API integration for real-time movie data 📡
- Responsive UI with Next.js & TailwindCSS ✨

## 🛠 Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Firebase Authentication
- **Data Fetching**: React Query, TMDb API
- **State Management**: Context API / Zustand

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/moviemate.git
cd moviemate
```

### 2️⃣ Install Dependencies
We use **pnpm** as the package manager (you can also use `npm` or `yarn`).
```bash
pnpm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env.local` file in the root directory and add the following:
```env
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

### 4️⃣ Get Your TMDb API Key
1. Go to [The Movie Database (TMDb)](https://www.themoviedb.org/)
2. Sign up and go to **Account Settings > API**
3. Generate an API key and paste it into `.env.local`

### 5️⃣ Set Up Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** (Google, Email/Password, etc.)
4. Copy your Firebase config and add it to `.env.local`

### 6️⃣ Run the Project
```bash
pnpm dev
```
Then open `http://localhost:3000` in your browser. 🚀

## 📜 License
This project is open-source under the MIT License.

## 👥 Contributing
Feel free to fork, submit issues, or create pull requests to improve MovieMate!

