# Types Directory

This directory contains all TypeScript type definitions organized by domain for better maintainability.

## File Organization

### `index.ts`
- Barrel export file that re-exports all types from domain-specific files
- Import from this file for convenience: `import { Parent, Product } from '@/types'`

### `parent.type.ts`
- Contains all parent-related types and interfaces
- Includes API request/response types
- Includes filter and CRUD operation types

### `product.type.ts`
- Contains all product-related types, enums, and interfaces
- Includes ProductStatus, ProductLabel, ProductPriority enums
- Includes API request/response types

### `navigation.type.ts`
- Contains navigation-related types
- Includes NavItem, MainNavItem, SidebarNavItem
- Includes configuration types for navigation components

### `site.type.ts`
- Contains site configuration types
- Includes SiteConfig for general site settings

## Usage Examples

```typescript
// Import specific types
import { Parent, ParentApiResponse } from '@/types/parent.type';

// Or import from barrel export (recommended)
import { Parent, Product, NavItem } from '@/types';
```

## Best Practices

1. **Domain Separation**: Keep types organized by domain/feature
2. **Naming Convention**: Use descriptive names with `.type.ts` suffix
3. **API Types**: Include both request and response types for each entity
4. **Enums**: Define enums in the same file as related types
5. **Barrel Exports**: Always re-export from `index.ts` for convenience
