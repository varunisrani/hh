# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based film production management UI kit called "FILMUSTAGE" built with Vite, TypeScript, and shadcn/ui components. The application helps manage various aspects of film production including script breakdown, scheduling, budgeting, and analysis.

The app features a project-based workflow where users can create multiple projects, each with their own script and production data. Projects are stored in localStorage and users can switch between them seamlessly.

## Core Technologies

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite with SWC plugin for fast compilation
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router DOM
- **State Management**: TanStack Query (React Query) for server state
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **AI Integration**: Google Gemini 2.5 Flash for automatic scene breakdown analysis

## Development Commands

```bash
# Start development server (runs on port 8080)
npm run dev

# Build for production
npm run build

# Build for development mode
npm run build:dev

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

## Project Architecture

### Application Structure
- **App.tsx**: Main application component with router setup, query client, and global providers
- **main.tsx**: Application entry point with React 18 root rendering
- **components/layout/**: Layout components including TopNavigation, ProjectLayout, and MainApp
- **components/ui/**: shadcn/ui component library (accordion, button, card, etc.)
- **hooks/**: Custom React hooks including useSelectedProject for project state management
- **pages/**: Route components for different sections
  - **ProjectListPage.tsx**: Project management dashboard with project cards
  - **CreateProjectPage.tsx**: Form for creating new projects with script upload
  - **ScriptPage.tsx**: Script breakdown and analysis
  - **SummaryPage.tsx**: Project summary view
  - **Other pages**: Reports, Analysis, Scheduling, Call Sheets, Budgeting
- **types/index.ts**: TypeScript type definitions for Scene, Project, CastMember, BudgetItem, ScheduleItem
- **data/mockData.ts**: Mock data for development and testing

### Key Features
- **Project Management**: Create, view, and manage multiple film projects
- **Script Upload**: Support for PDF and TXT script file uploads
- **AI Scene Analysis**: Automatic scene breakdown using Google Gemini 2.5 Pro
- **localStorage Integration**: Projects and data persist locally
- **Conditional Routing**: Shows project list when no project is selected, main app when project is active
- **AI-Enhanced Script Breakdown**: Detailed scene analysis with characters, props, locations, complexity scores
- **Cast tracking and scheduling**: Manage cast members and their schedules
- **Budget management with category codes**: Track production costs by category
- **Analysis parameters for production planning**: Various analysis tools for production
- **Responsive navigation with active state tracking**: Dynamic navigation based on selected project

### Routing Structure
The app always shows the project list first, then navigates to specific project sections:

**Main Routes:**
- `/` - ProjectListPage (always shows first - lists all projects, FILMUSTAGE branding only)
- `/create-project` - CreateProjectPage (form to create new project)

**Project-specific Routes (require project selection):**
- `/script` - ScriptPage (script breakdown and analysis)
- `/summary` - SummaryPage (project summary)
- `/reports` - ReportsPage (production reports)  
- `/analysis` - AnalysisPage (script analysis)
- `/scheduling` - SchedulingPage (production scheduling)
- `/callsheets` - CallSheetsPage (call sheets management)
- `/budgeting` - BudgetingPage (budget tracking)

**Navigation Behavior:**
- App startup always shows project list at `/`
- Navigation tabs (Script, Summary, etc.) only appear when project is selected
- Project list page shows only FILMUSTAGE branding, no navigation tabs

### Configuration Notes
- Uses path alias `@/` pointing to `src/` directory
- Tailwind configured with custom design tokens and sidebar colors
- TypeScript with relaxed settings (noImplicitAny: false, strictNullChecks: false)
- ESLint configured for React with TypeScript, unused vars disabled
- Server runs on port 8080 with IPv6 support

### Development Integration
- Integrates with Lovable platform for collaborative development
- Uses lovable-tagger plugin in development mode
- Project URL: https://lovable.dev/projects/feca55d3-721f-43d3-9018-e57d7e3808b0

## Component Patterns
- Functional components with TypeScript
- shadcn/ui component composition
- React Router for navigation with conditional routing
- localStorage for project data persistence
- TanStack Query for data fetching (though currently using mock data)
- Responsive design with Tailwind utility classes

## Data Storage
- **Projects**: Stored in localStorage under `filmustage_projects` key as JSON array
- **Selected Project**: Current active project stored under `selected_project` key
- **Project Structure**: Each project contains id, name, description, scriptContent, created date, and aiAnalysis
- **AI Analysis Results**: Complete scene breakdown data with characters, props, locations, complexity scores
- **File Upload**: Supports PDF and TXT formats for script upload

## Custom Hooks
- **useSelectedProject**: Manages project selection state with localStorage persistence
  - Provides `selectedProject`, `isLoading`, `selectProject()`, and `clearProject()` methods
  - Handles storage events for cross-tab synchronization
  - Uses custom events for same-tab state updates

## AI Integration
- **Gemini Service**: `src/services/geminiService.ts` handles all AI communication
- **Automatic Analysis**: Scripts are analyzed immediately upon project creation
- **Scene Breakdown**: AI extracts characters, props, locations, complexity scores, time estimates
- **Background Processing**: Analysis runs while user navigates to script page
- **Real-time Updates**: Script page updates automatically when analysis completes
- **Error Handling**: Graceful fallback to manual scene creation if AI fails
- **Custom Events**: `projectAnalysisComplete` and `projectAnalysisError` for cross-component communication