# 🎯 Mock Interviewer

An AI-powered mock interview platform that simulates real interview sessions using Google Gemini AI. Practice technical and behavioral interviews with instant feedback — right in your browser.

---

## ✨ Features

- **AI-Driven Interviews** — Powered by Google Gemini AI for realistic, dynamic question generation
- **Real-time Feedback** — Get instant evaluation on your answers
- **Multiple Interview Types** — Technical, behavioral, and role-specific sessions
- **Clean UI** — Built with shadcn/ui components and Tailwind CSS
- **Responsive Design** — Works seamlessly on desktop and mobile

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui, Framer Motion |
| State / Data | TanStack Query, React Hook Form, Zod |
| Backend | Node.js, Express.js |
| AI | Google Gemini API (`@google/generative-ai`) |
| Testing | Vitest, Testing Library |
| Routing | React Router DOM v6 |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+`
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)

### Installation

```bash
# Clone the repository
git clone https://github.com/srujangowda756/mock-interviewer.git
cd mock-interviewer

# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Running the App

```bash
# Start the Express backend (in one terminal)
npm run server

# Start the Vite frontend (in another terminal)
npm run dev
```

The app will be available at `http://localhost:5173`  
The API server runs on `http://localhost:3000` (or as configured)

---

## 🧪 Running Tests

```bash
# Run tests once
npm test

# Watch mode
npm run test:watch
```

---

## 📁 Project Structure

```
mock-interviewer/
├── public/          # Static assets
├── server/          # Express.js backend
│   └── index.js     # API routes & Gemini integration
├── src/             # React frontend
│   ├── components/  # UI components (shadcn/ui + custom)
│   ├── pages/       # Route-level page components
│   ├── hooks/       # Custom React hooks
│   └── lib/         # Utilities and helpers
├── .env             # Environment variables (not committed)
├── package.json
└── vite.config.ts
```

---

## 🔮 Roadmap

- [ ] Session history and progress tracking
- [ ] Resume upload for personalized questions
- [ ] Voice-based interview mode
- [ ] Performance analytics dashboard
- [ ] Company-specific interview modes (e.g., Razorpay, CRED)

---

## 🤝 Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

> Built by [Srujan Gowda](https://github.com/srujangowda756) — check out [RoboMind](https://www.youtube.com/@RoboMind) on YouTube for more tech content.
