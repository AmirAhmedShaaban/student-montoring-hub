# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev      # Start dev server (Vite)
npm run build    # Production build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Architecture

**Framework**: React 19 with Vite, TypeScript-ready.

**Routing**: React Router DOM v7 with nested layouts:
- `src/app/router/AppRouter.jsx` - Route definitions
- `src/layouts/` - AuthLayout and DashboardLayout wrapper components
- `src/pages/` - Route-level components (dashboard, students, behavior-management, clustering, settings, help, auth)

**Data Layer**:
- `src/services/` - API service modules (axios-based)
  - `authService.js`, `studentService.js`, `dashboardService.js`, `behaviorService.js`, `clusteringService.js`, `settingsService.js`, etc.
  - `axiosConfig.js` - HTTP client configuration
- `src/mocks/` - Mock data for development/testing

**UI**:
- Tailwind CSS for styling
- Recharts for data visualizations (PieChart, BarChart, ScatterChart)
- Formik + Yup for form state and validation

**Structure**:
```
src/
  app/router/      - Routing configuration
  layouts/         - Page wrapper components
  pages/           - Route-level pages with nested components/
  services/        - API service modules
  mocks/           - Mock data
  utils/           - Utilities (auth.js for token handling)
```

**No test framework** is currently configured in this project.