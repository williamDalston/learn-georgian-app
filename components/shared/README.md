# Shared Components

This directory contains reusable components used across the application.

## Components

### Container
Wrapper component for consistent page/section width and padding.

**Usage:**
```tsx
import Container from '@/components/shared/Container'

<Container maxWidth="7xl">
  Your content here
</Container>
```

**Props:**
- `maxWidth`: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' (default: '7xl')
- `className`: Additional CSS classes

### Layout
Layout wrapper component for consistent page structure.

**Usage:**
```tsx
import Layout from '@/components/shared/Layout'

<Layout containerMaxWidth="7xl">
  Your page content
</Layout>
```

**Props:**
- `containerMaxWidth`: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' (default: '7xl')
- `className`: Additional CSS classes

## Adding New Shared Components

When creating new shared components:
1. Create the component file in this directory
2. Export as default
3. Use TypeScript with proper prop types
4. Use Tailwind utility classes for styling
5. Follow mobile-first responsive design
6. Document usage in component comments or this README

