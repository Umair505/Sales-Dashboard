<p align="center">
  <img src="./public/dashboard.png" alt="Sales Dashboard Banner" width="100%" />
</p>

<h1 align="center">📊 Sales Analytics Dashboard</h1>
<p align="center">A clean, high-performance dashboard for visualizing and exploring sales data with cursor-based pagination.</p>

<br/>

---

<h2>📌 Table of Contents</h2>

- <a href="#overview">Overview</a>
- <a href="#features">Key Features</a>
- <a href="#tech">Tech Stack</a>
- <a href="#architecture">Architecture & Decisions</a>
- <a href="#getting-started">Getting Started</a>
- <a href="#structure">Project Structure</a>
- <a href="#optimizations">Performance Optimizations</a>

---

<h2 id="overview">🔎 Overview</h2>

This dashboard interacts with a Sales API to authenticate users, fetch transaction data, apply real-time filters, and visualize sales trends over time.

The main challenge of this build was handling **Cursor-Based Pagination (before/after tokens)** and crafting a smooth Next/Previous navigation experience without re-fetching stale data.

<br/>

---

<h2 id="features">✨ Key Features</h2>

<h3>1. 🔍 Advanced Filtering</h3>
<ul>
  <li>Date filtering with Start and End range</li>
  <li>Minimum price search</li>
  <li>Email and Phone filtering</li>
  <li>Instant data refresh on filter updates</li>
</ul>

<h3>2. 📈 Data Visualization</h3>
<ul>
  <li>Interactive time-series Area Chart (Recharts)</li>
  <li>Responsive design across all screen sizes</li>
</ul>

<h3>3. ⚡ Smart Pagination</h3>
<ul>
  <li>Before/After cursor-based API navigation</li>
  <li>History Stack to solve the Previous Page problem</li>
  <li>No stale data or repeated requests</li>
</ul>

<h3>4. 📊 Interactive Data Table</h3>
<ul>
  <li>Server-side sorting (Date + Price)</li>
  <li>Loading skeletons for smooth UX</li>
</ul>

<h3>5. 💾 Caching & State Management</h3>
<ul>
  <li>React Query for server state management</li>
  <li>Instant back navigation using caching</li>
</ul>

<br/>

---

<h2 id="tech">🛠 Tech Stack</h2>

<table>
  <tr>
    <th>Category</th>
    <th>Technology</th>
    <th>Purpose</th>
  </tr>
  <tr>
    <td>Framework</td>
    <td>Next.js 14</td>
    <td>App structure & routing</td>
  </tr>
  <tr>
    <td>Styling</td>
    <td>Tailwind CSS</td>
    <td>Responsive UI design</td>
  </tr>
  <tr>
    <td>State / Async</td>
    <td>React Query</td>
    <td>Data fetching, caching</td>
  </tr>
  <tr>
    <td>Charting</td>
    <td>Recharts</td>
    <td>Sales trend visualization</td>
  </tr>
  <tr>
    <td>Animation</td>
    <td>Framer Motion</td>
    <td>Visual transitions</td>
  </tr>
  <tr>
    <td>Icons</td>
    <td>Lucide React</td>
    <td>Clean SVG icons</td>
  </tr>
</table>

<br/>

---

<h2 id="architecture">🧠 Architecture & Decisions</h2>

<h3>Why React Query?</h3>
<ul>
  <li>Prevents duplicate requests</li>
  <li>Caches each page for instant back navigation</li>
  <li>Provides isLoading / isFetching for better UX</li>
</ul>

<h3>Pagination Problem & Solution</h3>
<p>The Sales API uses before/after cursor-based pagination, which makes navigating backwards difficult.</p>

<p><strong>Solution:</strong></p>

<ul>
  <li>A <strong>Navigation History Stack</strong> stores previous cursors.</li>
  <li>Next → Push current cursor</li>
  <li>Previous → Pop cursor from history</li>
  <li>Ensures smooth and accurate page navigation</li>
</ul>

<br/>

---

<h2 id="getting-started">🚀 Getting Started</h2>

<h3>Prerequisites</h3>
<ul>
  <li>Node.js 18+</li>
  <li>npm or yarn</li>
</ul>

<h3>Installation Steps</h3>

git clone https://github.com/Umair505/Sales-Dashboard
cd sales-dashboard
npm install
npm run dev

yaml
Copy code

Open ➝ http://localhost:3000

<br/>

---
## Usage

Once the development server is running, you can interact with the Sales Dashboard:

1.  **Access the Dashboard**: Open `http://localhost:3000` in your web browser.
2.  **View Sales Overview**: The main page (`src/app/page.js`) displays an initial overview of sales data, including charts and a table.
3.  **Filter Data**: Use the **Filter Bar** at the top (`src/components/dashboard/FilterBar.jsx`) to refine the displayed sales data. You can filter by:
    *   Date range (start and end dates)
    *   Minimum price
    *   Customer email
    *   Customer phone number
    *   Sort order (ascending/descending)
4.  **Analyze Charts**: The **Sales Chart** (`src/components/dashboard/SalesChart.jsx`) will dynamically update to visualize sales trends based on your applied filters.
5.  **Explore Table Details**: The **Sales Table** (`src/components/dashboard/SalesTable.jsx`) provides detailed records. You can:
    *   Sort columns by clicking on their headers.
    *   Navigate through pages using the pagination controls.
6.  **Real-time Updates**: The dashboard utilizes TanStack React Query to efficiently fetch and update data, providing a near real-time experience.

## Project Structure

The project follows a standard Next.js application structure with clear separation of concerns:

```
.
├── public/                 # Static assets (images, fonts)
├── src/                    # Main application source code
│   ├── app/                # Next.js App Router root layout and pages
│   │   ├── favicon.ico     # Site favicon
│   │   ├── globals.css     # Global stylesheets
│   │   ├── layout.js       # Root layout, global providers (QueryProvider, Toaster)
│   │   └── page.js         # Main dashboard page component
│   ├── components/         # Reusable React components
│   │   ├── dashboard/      # Components specific to the dashboard view
│   │   │   ├── FilterBar.jsx   # UI for filtering sales data
│   │   │   ├── SalesChart.jsx  # Chart visualization of sales data
│   │   │   └── SalesTable.jsx  # Table display of sales records
│   │   ├── providers/      # Context providers for global state
│   │   │   └── QueryProvider.jsx # TanStack React Query context
│   │   └── ui/             # Reusable UI primitives (buttons, input, cards, etc.)
│   ├── hooks/              # Custom React hooks
│   │   └── useSalesData.js # Hook for fetching and managing sales data
│   └── lib/                # Utility functions
│       └── utils.js        # General utility functions (e.g., for Tailwind CSS class merging)
├── .eslintrc.mjs           # ESLint configuration
├── jsconfig.json           # JavaScript configuration for VS Code
├── next.config.mjs         # Next.js configuration
├── package.json            # Project dependencies and scripts
├── postcss.config.mjs      # PostCSS configuration (for Tailwind CSS)
└── README.md               # Project README file
```

## Contributing

Contributions are welcome! If you'd like to improve this project, please follow these steps:

1.  **Fork** the repository.
2.  **Clone** your forked repository: `git clone https://github.com/YOUR_USERNAME/Sales-Dashboard.git`
3.  **Create a new branch**: `git checkout -b feature/your-feature-name`
4.  **Make your changes**.
5.  **Commit your changes**: `git commit -m "feat: Add new feature"`
6.  **Push to the branch**: `git push origin feature/your-feature-name`
7.  **Open a Pull Request** against the `main` branch of the original repository.

Please ensure your code adheres to the project's coding standards and includes appropriate tests if applicable.