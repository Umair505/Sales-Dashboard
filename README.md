📊 Sales Analytics Dashboard

A high-performance, responsive sales dashboard built to visualize transaction data, filter records in real-time, and handle large datasets using cursor-based pagination.

🚀 View Live Demo[https://sales-dashboard-moinul.vercel.app](https://sales-dashboard-moinul.vercel.app) 

📝 Table of Contents

Overview

Key Features

Tech Stack

Architecture & Decisions

Getting Started

Project Structure

Performance Optimizations

🔎 Overview

This project is a technical assessment implementation designed to interact with a Sales API. It authenticates users, fetches sales data based on complex filtering criteria, and visualizes the trends over time.

The core challenge involved implementing Cursor-based Pagination (Before/After tokens) while ensuring a seamless "Previous/Next" navigation experience without re-fetching stale data.

✨ Key Features

1. 🔍 Advanced Filtering

Date Range: Filter sales between specific Start and End dates.

Granular Search: Filter by Minimum Price, Customer Email, and Phone Number.

Real-time Updates: Dashboard automatically refreshes when filters are applied.

2. 📈 Data Visualization

Time-Series Chart: An interactive Area Chart (powered by Recharts) showing total sales trends over time.

Responsive Design: Charts scale beautifully across Desktop, Tablet, and Mobile.

3. ⚡ Smart Pagination & Navigation

Cursor-based Logic: Implements before and after token logic compliant with the API.

History Stack: Solves the common "Previous Button" issue in cursor pagination by maintaining a local history stack, allowing users to navigate back accurately.

4. 📊 Interactive Data Table

Sorting: Server-side sorting for Date and Price columns (Ascending/Descending).

Status Indicators: Loading states and skeletons for a polished UX.

5. 💾 Caching & State Management

Instant Back Navigation: Uses React Query to cache page data. Returning to a previous page loads instantly without a network request.

🛠 Tech Stack

Category

Technology

Usage

Framework

Next.js 14 (App Router)

Core application structure and routing.

Styling

Tailwind CSS

Utility-first styling for responsiveness.

UI Components

Shadcn/UI (Concepts)

Accessible, reusable UI patterns.

State/Async

TanStack Query (React Query)

Server state management, caching, and background refetching.

Charts

Recharts

Composable charting library for React.

Icons

Lucide React

Clean, consistent SVG icons.

Animation

Framer Motion

Smooth entrance animations for tables and charts.

Utils

date-fns

Date formatting and manipulation.

🧠 Architecture & Decisions

Why React Query?

The application requires frequent server synchronization (filtering, sorting, paging). React Query was chosen to:

Deduplicate requests: Prevent multiple API calls for the same data.

Cache Data: Implements the "Bonus" requirement where revisiting a filter or page loads instantly.

Manage Loading States: Provides isLoading and isFetching flags for better UI feedback.

The Pagination Challenge

The API uses before and after cursors. A common pitfall is that moving "Previous" is difficult because you often don't have the before token for the very first page, or the API logic is strictly unidirectional.

Solution: I implemented a Navigation History Stack.

When the user clicks Next, the current cursor is pushed to history.

When the user clicks Previous, we pop from history and use the stored cursor.

This ensures the UI never gets "stuck" and the Previous button works reliably.

🚀 Getting Started

Follow these steps to run the project locally.

Prerequisites

Node.js 18+ installed

npm or yarn

Installation

Clone the repository

git clone [https://github.com/Umair505/Sales-Dashboard](https://github.com/Umair505/Sales-Dashboard)
cd sales-dashboard


Install Dependencies

npm install


Run the Development Server

npm run dev


Access the App
Open http://localhost:3000 in your browser.

📂 Project Structure

src/
├── app/
│   ├── layout.jsx        # Root layout with QueryProvider
│   └── page.jsx          # Main Dashboard Controller (State & Logic)
├── components/
│   ├── dashboard/
│   │   ├── FilterBar.jsx    # Inputs for dates and search
│   │   ├── SalesChart.jsx   # Recharts Area Chart
│   │   └── SalesTable.jsx   # Data grid with sorting/paging
│   └── providers/
│       └── QueryProvider.jsx # React Query Client Config
├── hooks/
│   └── useSalesData.js   # Custom hook for API logic (Integrated in page for this build)
└── lib/
    └── utils.js          # Tailwind class merger
