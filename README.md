<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
# 📈 Stockverse - Virtual Stock Trading Platform

A hackathon-ready virtual stock trading platform built with React and React Router.

## 🚀 Features

- **Dashboard**: View your virtual balance, portfolio value, and market overview
- **Buy/Sell**: Trade virtual stocks with real-time price updates
- **Account**: Track your portfolio holdings and transaction history
- **Settings**: Customize your experience with theme options and data management

## 🛠️ Tech Stack

- **Frontend**: React 18.2.0
- **Routing**: React Router DOM 7.9.4
- **Styling**: Tailwind CSS (via CDN)
- **State Management**: React Context API

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🎯 Project Structure

```
src/
├── components/
│   └── Navbar.jsx          # Navigation component
├── pages/
│   ├── Dashboard.jsx       # Main dashboard with balance & stocks
│   ├── BuySell.jsx         # Trading interface
│   ├── Account.jsx         # User profile & portfolio
│   └── Settings.jsx        # App settings & preferences
├── context/
│   └── DataContext.jsx     # Global state management
├── App.jsx                 # Main app component with routing
├── App.css                 # Global styles with Tailwind
└── index.js                # React entry point
```

## 🎨 UI Components

### Navigation
- Clean navbar with emoji icons
- Responsive design for mobile/desktop
- Active state highlighting

### Dashboard
- Virtual balance display
- Portfolio overview with gain/loss
- Market overview with stock prices
- Card-based layout with Tailwind styling

### Buy/Sell Interface
- Stock selection dropdown
- Quantity input with validation
- Buy/Sell action buttons
- Real-time price calculations
- Transaction feedback

### Account Page
- User profile information
- Portfolio holdings table
- Transaction history
- Performance metrics

### Settings
- Username editing
- Theme toggle (placeholder)
- Data export/import
- Reset functionality

## 💾 Data Management

The app uses React Context for state management with:
- User profile data
- Virtual balance tracking
- Portfolio holdings
- Transaction history
- Stock price data

## 🎯 Hackathon Ready

This project is designed to be demo-ready with:
- Clean, modern UI using Tailwind CSS
- Responsive design
- Interactive components
- Real-time calculations
- Professional styling
- Complete navigation system

## 🚀 Getting Started

1. Clone the repository
2. Run `npm install`
3. Run `npm start`
4. Navigate to different pages using the navbar
5. Try buying/selling stocks
6. Check your account and portfolio

## 📱 Responsive Design

The app is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🎨 Styling

Uses Tailwind CSS for:
- Consistent spacing and typography
- Responsive grid layouts
- Hover effects and transitions
- Color-coded status indicators
- Card-based component design

Enjoy trading! 📈
>>>>>>> 84967ae8e13ca7c9ebfa85b82569050428a7266f
