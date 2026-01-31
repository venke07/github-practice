# Lumina | The Future of Commerce 🚀

Lumina is a premium, AI-powered e-commerce storefront designed for the modern visionary. Experience a seamless, high-performance shopping interface integrated with the **Google Gemini 1.5 Flash** API for a personalized assistant experience.

![Lumina Preview](https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)

## ✨ Core Features

- **AI Shopping Assistant**: Powered by Gemini 1.5 Flash. It understands the product catalog and provides personalized advice.
- **Glassmorphism UI**: A dark, futuristic design system built with vanilla CSS.
- **Dynamic Shopping Cart**: Real-time updates, smooth sidebar transitions, and total calculations.
- **Secure Checkout Flow**: A multi-step checkout simulation with processing states and order confirmation.
- **Auto-Loading Environment**: Custom `.env` loading utility for vanilla JS.

## 🛠 Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6 Modules)
- **AI Engine**: Google Generative AI (Gemini 1.5 Flash)
- **Styling**: Custom CSS Variables, Flexbox, Grid, and Keyframe Animations.

## 🚀 Quick Start

### 1. Prerequisites
You need a **Gemini API Key**.
- Get one at the [Google AI Studio](https://aistudio.google.com/).

### 2. Configuration
Create or edit the `.env` file in the root directory:
```env
GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Running the App
Since the project uses **JavaScript Modules**, you cannot open `index.html` directly as a file. You must use a local server.

**Option A: VS Code Live Server (Recommended)**
1. Open the project in VS Code.
2. Click **"Go Live"** in the bottom right corner.

**Option B: CLI (Node.js required)**
```bash
npx serve .
```

## 📂 Project Structure

- `index.html`: Main application entry point.
- `style.css`: Modern design system and layout.
- `script.js`: Core store logic and UI interactions.
- `api.js`: Gemini 1.5 Flash API integration.
- `env-loader.js`: Utility for reading `.env` files in the browser.
- `.env`: (Ignored/Hidden) Contains your API secrets.

---

*Built with passion and AI precision by Antigravity.*
