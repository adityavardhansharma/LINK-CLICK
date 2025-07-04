# LinkMe - Personal Link Manager

A beautiful, mobile-first link management application built with Next.js, Convex

## Features

- 🔐 **Mock Authentication** - Simple username/email + password signup and login
- 📁 **Folder Organization** - Create folders to organize your links
- 🔗 **Link Management** - Add links with titles, URLs, and keywords
- 🔍 **Global Search** - Search across all links by title, URL, or keywords with live updates
- 📋 **Copy URLs** - Easy one-click URL copying
- 🏷️ **Keywords** - Tag your links for better organization

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: Convex (serverless database)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Fonts**: Libre Baskerville, Lora, IBM Plex Mono
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- A Convex account (free at [convex.dev](https://convex.dev))

### Installation

1. **Clone and install dependencies**:
   ```bash
   pnpm install
   ```

2. **Set up Convex**:
   ```bash
   npx convex dev
   ```
   This will:
   - Create a new Convex project (if needed)
   - Generate a `.env.local` file with your Convex URL
   - Start the Convex development server

3. **Start the development server**:
   ```bash
   pnpm dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

### Environment Variables

The application needs one environment variable:

```env
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
```

This is automatically created when you run `npx convex dev`.

## Usage

### Getting Started
1. **Sign Up**: Create an account with username, email, and password
2. **Create Folders**: Organize your links into folders
3. **Add Links**: Add links with titles, URLs, and optional keywords
4. **Search**: Use the global search to find links across all folders
5. **Copy & Share**: Easily copy URLs for sharing

### Features

- **Folder Management**: Click on folders to view their contents
- **Live Search**: Search updates as you type
- **Mobile Optimized**: Responsive design that works great on mobile
- **Persistent Sessions**: Stay logged in until you explicitly log out
- **Visual Feedback**: Beautiful hover effects and animations

## Design

The application features a **liquid glass** design inspired by Apple's iOS 26 design language:

- **Glass Effects**: Translucent surfaces with backdrop blur
- **Warm Color Palette**: Cream and brown tones for a sophisticated look
- **Typography**: Libre Baskerville for headings, clean and readable
- **Mobile-First**: Responsive design optimized for mobile usage
- **Smooth Animations**: Subtle transitions and hover effects

## Database Schema

The application uses four main tables:

- **Users**: Username, email, password (base64 encoded for demo)
- **Folders**: Name, user association, timestamps
- **Links**: Title, URL, keywords, folder association
- **Sessions**: Token-based authentication with expiration

## Development

### Project Structure

```
src/
├── app/                 # Next.js app router
├── components/
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Main app components
│   ├── providers/      # Context providers
│   └── ui/            # Reusable UI components
├── lib/               # Utilities and context
convex/               # Database schema and functions
```

### Contributing
Feel free to fork and modify for your own use!

## License

MIT License - feel free to use this code for your own projects!
