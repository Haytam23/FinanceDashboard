# 📈 Casablanca Stock Exchange Dashboard

A modern, AI-powered financial analytics dashboard for the Moroccan stock market (Bourse de Casablanca). Built with Next.js 14, Python, and real-time market data visualization.

![Dashboard Preview](https://img.shields.io/badge/Status-Live-success) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![Python](https://img.shields.io/badge/Python-3.13-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![License](https://img.shields.io/badge/License-MIT-green)

## 🌐 Live Demo

**[View Live Dashboard →](https://finance-dashboard-haytamraiss23-gmailcoms-projects.vercel.app)**

## ✨ Features

### 📊 Market Overview
- **Real-time MASI Index** tracking with live updates
- **Sector Performance** visualization with horizontal bar charts
- **Market Heatmap** showing stock performance at a glance
- **Quick Stats** displaying key market indicators

### 📈 Stock Analysis
- **Interactive Stock Cards** with price, change, and volume data
- **Detailed Stock Modal** with:
  - 30-day price history chart
  - Sentiment analysis (Bullish/Bearish/Neutral)
  - Technical indicators (RSI, MACD, Moving Averages)
  - Key metrics (High, Low, Volume, Market Cap)

### 🛡️ Risk Analysis
- **Portfolio Risk Score** with visual indicators
- **Volatility Trend Chart** comparing portfolio vs benchmark
- **Sector Risk-Return Radar** for diversification analysis
- **Scenario Analysis** (Bull/Base/Bear market simulations)
- **Risk Distribution** pie chart
- **Early Warning Signals** for risk monitoring
- **Personalized Recommendations** based on risk profile

### 🤖 AI Features
- **Daily AI Briefing** with 24-hour caching and manual refresh
- **Smart Chatbot** for learning about Bourse de Casablanca
- **Sentiment Analysis** powered by AI insights

### 📱 Mobile Responsive
- **Bottom Navigation** for easy mobile access
- **Slide-out Sidebar** with hamburger menu
- **Optimized Layouts** for all screen sizes

### 🌓 Theme Support
- **Light Mode** (default)
- **Dark Mode** toggle
- Smooth theme transitions

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful UI components
- **Recharts** - Interactive data visualizations
- **Lucide Icons** - Modern icon library
- **next-themes** - Theme management

### Backend
- **Python 3.13** - Backend runtime
- **FastAPI** - High-performance API framework
- **Vercel Serverless Functions** - Cloud deployment

### Data & APIs
- **Yahoo Finance** - Market data source
- **OpenAI** - AI-powered insights (optional)
- **Mock Data Fallback** - Reliable demo experience

## 📁 Project Structure

```
finance-dashboard/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes (Next.js)
│   │   ├── briefing/             # AI briefing endpoint
│   │   ├── chat/                 # Chatbot endpoint
│   │   ├── market/               # Market data endpoint
│   │   └── stocks/               # Stock data endpoints
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main dashboard page
│
├── api/                          # Vercel Serverless Functions (Python)
│   ├── ai/
│   │   └── briefing.py           # AI briefing function
│   ├── indices/
│   │   └── masi/
│   │       └── history.py        # MASI history function
│   ├── market/
│   │   └── snapshot.py           # Market snapshot function
│   ├── chat.py                   # Chatbot function
│   └── health.py                 # Health check function
│
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── ai-briefing.tsx           # AI market briefing
│   ├── bourse-chatbot.tsx        # Learning chatbot
│   ├── dashboard-overview.tsx    # Main dashboard view
│   ├── header.tsx                # App header
│   ├── market-index-chart.tsx    # MASI chart
│   ├── mobile-nav.tsx            # Mobile navigation
│   ├── risk-analysis.tsx         # Risk analysis section
│   ├── sector-performance.tsx    # Sector charts
│   ├── sidebar.tsx               # Desktop sidebar
│   ├── stock-analysis.tsx        # Stock list view
│   ├── stock-detail-modal.tsx    # Stock detail popup
│   └── ...                       # Other components
│
├── python_backend/               # Local Python backend
│   ├── api_server.py             # FastAPI server
│   ├── data_pipeline/            # Data processing modules
│   └── requirements.txt          # Python dependencies
│
├── lib/                          # Utility libraries
│   ├── utils.ts                  # Helper functions
│   └── moroccan-market-data.ts   # Market data utilities
│
├── vercel.json                   # Vercel configuration
├── package.json                  # Node.js dependencies
├── tailwind.config.ts            # Tailwind configuration
└── tsconfig.json                 # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Python 3.10+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Haytam23/FinanceDashboard.git
   cd FinanceDashboard
   ```

2. **Install frontend dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Install Python dependencies** (for local backend)
   ```bash
   cd python_backend
   pip install -r requirements.txt
   cd ..
   ```

4. **Set up environment variables** (optional)
   ```bash
   # Create .env.local file
   OPENAI_API_KEY=your_openai_api_key  # For AI features
   ```

### Running Locally

**Option 1: Frontend only (uses API routes)**
```bash
pnpm dev
# or
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

**Option 2: Full stack with Python backend**
```bash
# Terminal 1 - Start Python backend
cd python_backend
python -m uvicorn api_server:app --reload --port 8000

# Terminal 2 - Start Next.js frontend
pnpm dev
```

## 🌍 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add -A
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy with Vercel CLI**
   ```bash
   npx vercel --prod
   ```

   Or connect your GitHub repo at [vercel.com](https://vercel.com)

3. **Add Environment Variables** (optional)
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add `OPENAI_API_KEY` for AI features

### Deploy with Docker

```bash
# Build and run
docker-compose up --build

# Access at http://localhost:3000
```

## 📡 API Endpoints

### Next.js API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/market` | GET | Get market snapshot with stock data |
| `/api/briefing` | GET | Get AI-generated market briefing |
| `/api/chat` | POST | Chat with the AI assistant |
| `/api/stocks/[symbol]/history` | GET | Get stock price history |
| `/api/indices/masi/history` | GET | Get MASI index history |

### Vercel Serverless Functions

| Endpoint | Description |
|----------|-------------|
| `/api/health` | API health check |
| `/api/market/snapshot` | Market data snapshot |
| `/api/ai/briefing` | AI market analysis |
| `/api/chat` | Chatbot responses |

## 🏦 Moroccan Stocks Covered

| Symbol | Company | Sector |
|--------|---------|--------|
| ATW | Attijariwafa Bank | Banking |
| BCP | Banque Centrale Populaire | Banking |
| IAM | Maroc Telecom | Telecom |
| BOA | Bank of Africa | Banking |
| CMA | Ciments du Maroc | Materials |
| MNG | Managem | Mining |
| LBV | Label Vie | Retail |
| TQM | Taqa Morocco | Energy |
| CSR | Cosumar | Agribusiness |
| HPS | HPS | Technology |

## 🎨 Customization

### Risk Profiles
The dashboard supports three risk profiles:
- **Conservative** - Lower risk tolerance, focus on stability
- **Balanced** - Moderate risk, diversified approach
- **Aggressive** - Higher risk tolerance, growth-focused

### Themes
Toggle between light and dark mode using the theme button in the header.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Haytam** - [GitHub](https://github.com/Haytam23)

## 🙏 Acknowledgments

- [Bourse de Casablanca](https://www.casablanca-bourse.com/) - Moroccan Stock Exchange
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Recharts](https://recharts.org/) - React charting library
- [Vercel](https://vercel.com/) - Deployment platform

---

<p align="center">
  Made with ❤️ for the Moroccan stock market community
</p>
