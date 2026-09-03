# EFO DocQuery Frontend

A modern Next.js frontend for the DocQuery FEC filing querying system, featuring a clean UI built with React, TypeScript, and Tailwind CSS.

## Features

- ✅ **FEC filing querying system** - read
- ✅ **Real-time Search** - Search documents by title and content
- ✅ **Pagination** - Navigate through large document collections
- ✅ **Health Monitoring** - Real-time backend health status
- ✅ **Rate Limit Display** - Shows remaining API requests
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Toast Notifications** - User-friendly success/error messages
- ✅ **Loading States** - Skeleton screens and loading indicators
- ✅ **Form Validation** - Client-side validation with error messages

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- EFO DocQuery Backend running on `http://localhost:5000`

### Installation

```bash
# Install dependencies
npm install
# or
yarn install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
# or
yarn dev
```

Visit **http://localhost:3000**

## ⚙️ Configuration

### Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_API_KEY=DEMO
```

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | http://localhost:5000/api/v1 |
| `NEXT_PUBLIC_API_KEY` | API authentication key | DEMO |

## 📂 Project Structure

```
efo-docquery-frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with Toaster
│   │   ├── page.tsx            # Main page component
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── DocumentList.tsx    # Document list with actions
│   │   ├── DocumentForm.tsx    # Create/edit form
│   │   ├── SearchBar.tsx       # Search input
│   │   └── HealthStatus.tsx    # Backend health indicator
│   ├── lib/
│   │   └── api.ts              # API client with type definitions
│   └── types/
├── public/                      # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md
```
