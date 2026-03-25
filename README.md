<div align="center">
  <h1>✨ AI Sentiment Analysis Platform</h1>
  <p>A full-stack, AI-powered NLP orchestration system processing bulk CSV datasets and real-time text.</p>
  
  ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
  ![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
  ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
  ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
</div>

---

## 🚀 Overview

The **AI Sentiment Analysis Platform** is a modern web application designed for analyzing the emotional tone of both single text inputs and massive bulk CSV datasets (like customer reviews and support tickets). 

It features a premium, glassmorphic UI built in React with interactive data visualization dashboards powered by Recharts, connected to a robust Node.js backend handling heavy Natural Language Processing (NLP) workloads.

## 💎 Key Features

- **Real-Time Text Interface:** Instantly analyze single paragraphs or user input.
- **Batch CSV Processing:** Upload large CSV files spanning thousands of rows. The streaming pipeline parses, scores, and aggregates sentiment data with high performance.
- **Interactive Visualizations:** View aggregated positive, negative, and neutral metrics in beautiful, interactive charts.
- **Premium Glassmorphic Design:** An award-winning, Apple-like polished UI featuring sleek animations, a dark color palette, and a highly responsive design.

## 🛠 Tech Stack

- **Frontend:** React.js, Tailwind CSS, Recharts (for data visualization), Lucide-React (icons).
- **Backend:** Node.js, Express.js, `sentiment` (NLP processing), Multer (memory storage for uploads), `csv-parser` (for streaming CSVs).

---

## 💻 Getting Started

Follow these steps to run the application locally.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/sentiment-analysis-tool.git
cd sentiment-analysis-tool
```

### 2. Setup the Backend (Server)
```bash
cd server
npm install

# Copy the example environment variables file
cp env.example .env

# Start the Node.js server (Runs on port 5000)
npm run dev 
# or use: node index.js
```

### 3. Setup the Frontend (Client)
Open a new terminal window:
```bash
cd client
npm install

# Start the React development environment (Runs on port 3000)
npm start
```

### 4. Visit the Application
Once both servers are running, visit `http://localhost:3000` in your browser.

---

## 📦 Deployment

The application is fully containerized and easy to deploy:
- **Frontend** can be deployed directly to Vercel or Netlify.
- **Backend API** can be deployed to Render, Railway, or Heroku. 
*(Ensure cross-origin resource sharing (CORS) is configured for production in the `.env` file!)*

---

<p align="center">Made with ❤️ by Ronak Dadwani</p>
