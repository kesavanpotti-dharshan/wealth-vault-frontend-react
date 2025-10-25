# Wealth Vault - React Frontend

[![React](https://img.shields.io/badge/React-18.2-blue?logo=react)](https://reactjs.org) [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-blue?logo=tailwind)](https://tailwindcss.com) [![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://vercel.com)

A sleek, dark-mode personal wealth tracker built with React. Track bank balances, credit cards, crypto holdings (with real-time prices via CoinGecko), and portfolio income in one dashboard. LocalStorage persistence for offline use—your MVP for financial clarity, starting as a hobby tool and scaling to family-shared subs.

![Dark Mode Dashboard Screenshot](https://via.placeholder.com/800x400/1f2937/ffffff?text=Dark+Mode+Wealth+Dashboard+%F0%9F%8C%99) <!-- Replace with your screenshot URL -->

## 🚀 Features
- **Dashboard Overview**: Net worth pie charts, yearly income summaries, and asset allocations (banks, credits, stocks/ETFs, crypto).
- **Asset Management**: Add/edit/delete with simple forms—date pickers for purchase dates and basic ROI calcs (annualized returns).
- **Crypto Tracking**: Input ticker + qty; auto-values from live CoinGecko prices (e.g., 0.5 BTC at $65K = $32.5K holding).
- **Dark Mode Toggle**: Mint-inspired minimalist UI, default dark for late-night checks.
- **Persistence & Calcs**: LocalStorage saves your data; on-the-fly ROI (e.g., +15% annualized) and income aggregation.
- **Responsive**: Mobile-first for on-the-go family finance.

*Phase 1 MVP—back-end (.NET APIs + Azure SQL) coming for auth, sharing, and real syncs.*

## 🛠 Tech Stack
- **Frontend**: React 18 + Vite (fast dev/build)
- **State/UI**: Zustand (with persist middleware), Tailwind CSS (dark mode), Recharts (interactive pies/lines)
- **Utils**: Date-fns (ROI date math), CoinGecko API (free crypto prices)
- **Hosting**: Vercel (free deploys)

## 📦 Quick Start
1. **Clone & Install**:
2. **Run Locally**:
Open [http://localhost:5173](http://localhost:5173) – add your first asset and watch the magic!
3. **Build & Deploy**:


*Demo*: [Live on Vercel](https://wealth-vault-frontend-react.vercel.app) <!-- Update with your deploy URL -->

## 📈 Example Usage
- Add a bank: Name "Chase Savings", Value $50,000, Yield $200.
- Add crypto: Ticker "bitcoin", Qty 0.1, Purchase Date "2025-01-01", Purchase Value $3,000.
- Dashboard auto-updates: Net worth $53,500 (with BTC at current price), ROI +12.5%, Yearly Income $200.

## 🗺 Roadmap
- **Phase 2**: .NET Web API back-end with JWT auth, Azure SQL for family sharing.
- **Phase 3**: Plaid bank syncs, Stripe subs ($4.99/mo for unlimited holdings), AI insights (e.g., "Rebalance ETFs?").
- **Stretch**: PWA for offline, export to PDF for taxes.

## 🤝 Contributing
Fork, branch (`git checkout -b feat/add-stocks`), PR with tests. Issues welcome—let's build passive income from this hobby!

## 📄 License
MIT – Free to fork and fintech-ify.

---

*Built by [Dharshan Kesavan](https://github.com/kesavanpotti-dharshan) | Oct 2025 | Inspired by real-world wealth chaos. 💰*
