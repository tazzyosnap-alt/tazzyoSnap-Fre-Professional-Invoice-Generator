# Overview

TazzyoSnap is a professional invoice generator web application that allows users to create, preview, and export invoices as PDFs. The application features a modern, responsive design with both light and dark themes, real-time invoice preview, and comprehensive invoice management capabilities including company details, client information, itemized billing, tax calculations, and custom branding with logo upload.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built with React 18 and TypeScript, using a modern component-based architecture. The application leverages Vite for fast development and building, with hot module replacement for efficient development workflow. The UI is constructed using Radix UI primitives with shadcn/ui components, providing accessible and customizable interface elements.

**State Management**: Uses React's built-in state management with useState and useContext for theme management. TanStack Query is integrated for server state management and caching, though the current implementation appears to be primarily client-side.

**Routing**: Implements client-side routing using Wouter, a lightweight routing library. The application currently has a single main route for the invoice generator with a 404 fallback.

**Styling**: Uses Tailwind CSS with a custom design system that supports both light and dark themes. The design follows Material Design/Carbon hybrid principles with professional color palettes and typography optimized for business applications.

## Component Structure
The application follows a modular component architecture:
- **Core Components**: Header with theme toggle, invoice form, live preview, and PDF generator
- **UI Components**: Complete shadcn/ui component library for consistent design patterns
- **Theme System**: Context-based theme provider with localStorage persistence
- **Form Handling**: Uses React Hook Form with Zod validation for robust form management

## Data Architecture
**Schema Definition**: Uses Zod schemas for runtime type validation and TypeScript type generation. Invoice data structure includes comprehensive fields for business information, client details, line items, tax calculations, and payment terms.

**File Handling**: Supports logo upload with client-side file processing, including image validation and base64 encoding for storage and preview.

**PDF Generation**: Implements client-side PDF generation using html2canvas and jsPDF libraries, converting the preview component to a downloadable PDF document.

## Backend Architecture
The backend uses Express.js with TypeScript, following a modular route-based architecture. Currently implements a minimal server structure with placeholder storage interface, designed to be easily extended with database integration.

**Database Integration**: Configured for PostgreSQL with Drizzle ORM, including migration support. The schema defines user authentication tables and is prepared for invoice data persistence.

**Session Management**: Includes connect-pg-simple for PostgreSQL session storage, indicating planned user authentication and session management.

## Development and Build System
**Build Process**: Vite handles frontend building with esbuild for server-side bundling. The configuration supports both development and production environments with appropriate optimizations.

**Development Tools**: Includes TypeScript checking, hot reload, and development-specific tooling for efficient development workflow.

**Configuration**: Comprehensive configuration files for TypeScript, Tailwind, PostCSS, and Drizzle ORM with proper path aliases and build optimization.

# External Dependencies

## UI and Design
- **Radix UI**: Complete set of accessible, unstyled UI primitives for building the component system
- **Tailwind CSS**: Utility-first CSS framework for styling and responsive design
- **Lucide React**: Icon library providing consistent iconography throughout the application
- **shadcn/ui**: Pre-built component library built on Radix UI for accelerated development

## Frontend Libraries
- **React 18**: Core frontend framework with hooks and modern React features
- **TypeScript**: Static typing for improved developer experience and code reliability
- **Wouter**: Lightweight client-side routing library
- **TanStack Query**: Server state management and caching library
- **React Hook Form**: Form handling library with validation support
- **Zod**: Runtime type validation and schema definition

## PDF and File Processing
- **html2canvas**: Converts DOM elements to canvas for PDF generation
- **jsPDF**: Client-side PDF generation library
- **date-fns**: Date manipulation and formatting utilities

## Backend Infrastructure
- **Express.js**: Web server framework for API and static file serving
- **Drizzle ORM**: Type-safe database ORM for PostgreSQL integration
- **Neon Database**: Serverless PostgreSQL database solution
- **connect-pg-simple**: PostgreSQL session store for Express sessions

## Development Tools
- **Vite**: Fast build tool and development server
- **esbuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Autoprefixer for browser compatibility
- **tsx**: TypeScript execution for development server