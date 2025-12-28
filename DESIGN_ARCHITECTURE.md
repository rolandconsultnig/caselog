# Design Architecture - CaseLogPro2

Complete design system and UI architecture for the federated SGBV case management system.

## 🎨 Design Philosophy

### Core Principles

1. **Accessibility First**: WCAG 2.1 Level AA compliance
2. **Professional & Trustworthy**: Government-grade interface
3. **Data-Dense but Clear**: Handle complex information elegantly
4. **Role-Aware**: UI adapts to user permissions
5. **Responsive**: Mobile-first approach

## 🏗️ Architecture Pattern

### Atomic Design System

```
Atoms (Basic building blocks)
  ↓
Molecules (Simple combinations)
  ↓
Organisms (Complex components)
  ↓
Templates (Page layouts)
  ↓
Pages (Actual screens)
```

### Component Hierarchy

```
components/
├── atoms/              # Basic UI elements
│   ├── Button
│   ├── Input
│   ├── Badge
│   ├── Avatar
│   └── Icon
├── molecules/          # Simple combinations
│   ├── SearchBar
│   ├── StatCard
│   ├── FormField
│   └── FilterGroup
├── organisms/          # Complex components
│   ├── DataTable
│   ├── CaseCard
│   ├── FormWizard
│   └── Navigation
├── templates/          # Page layouts
│   ├── DashboardLayout
│   ├── FormLayout
│   └── DetailLayout
└── pages/              # Actual pages (in app/)
```

## 🎨 Color System

### Primary Colors

```css
/* Primary - Blue (Trust, Authority) */
--primary-50: #eff6ff;
--primary-100: #dbeafe;
--primary-200: #bfdbfe;
--primary-300: #93c5fd;
--primary-400: #60a5fa;
--primary-500: #3b82f6;  /* Main */
--primary-600: #2563eb;  /* Primary brand */
--primary-700: #1d4ed8;
--primary-800: #1e40af;
--primary-900: #1e3a8a;

/* Secondary - Green (Success, Safety) */
--secondary-50: #f0fdf4;
--secondary-100: #dcfce7;
--secondary-200: #bbf7d0;
--secondary-300: #86efac;
--secondary-400: #4ade80;
--secondary-500: #22c55e;  /* Main */
--secondary-600: #16a34a;
--secondary-700: #15803d;
--secondary-800: #166534;
--secondary-900: #14532d;
```

### Status Colors

```css
/* Success - Green */
--success: #22c55e;
--success-light: #dcfce7;
--success-dark: #15803d;

/* Warning - Orange */
--warning: #f59e0b;
--warning-light: #fef3c7;
--warning-dark: #d97706;

/* Danger - Red */
--danger: #ef4444;
--danger-light: #fee2e2;
--danger-dark: #dc2626;

/* Info - Blue */
--info: #3b82f6;
--info-light: #dbeafe;
--info-dark: #1d4ed8;
```

### Priority Colors

```css
/* Low Priority - Gray */
--priority-low: #6b7280;
--priority-low-bg: #f3f4f6;

/* Medium Priority - Yellow */
--priority-medium: #f59e0b;
--priority-medium-bg: #fef3c7;

/* High Priority - Orange */
--priority-high: #ea580c;
--priority-high-bg: #ffedd5;

/* Urgent Priority - Red */
--priority-urgent: #dc2626;
--priority-urgent-bg: #fee2e2;

/* Critical Priority - Dark Red */
--priority-critical: #991b1b;
--priority-critical-bg: #fecaca;
```

### Neutral Colors

```css
/* Gray Scale */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;
```

## 📐 Typography

### Font Family

```css
/* Primary Font - Inter */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Monospace - For codes */
--font-mono: 'JetBrains Mono', 'Courier New', monospace;
```

### Font Sizes

```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
```

### Font Weights

```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

## 📏 Spacing System

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

## 🎯 Component Specifications

### 1. Dashboard Layout

```
┌─────────────────────────────────────────────┐
│ Header (h-16)                               │
│ [Logo] [Search] [Notifications] [Profile]  │
├──────┬──────────────────────────────────────┤
│      │                                      │
│ Side │  Main Content Area                   │
│ bar  │  - Breadcrumbs                       │
│      │  - Page Title                        │
│ (w-  │  - Stats Cards (grid-cols-4)        │
│ 64)  │  - Charts (grid-cols-2)             │
│      │  - Data Tables                       │
│      │                                      │
└──────┴──────────────────────────────────────┘
```

**Specifications:**
- Sidebar: 256px (w-64) fixed
- Header: 64px (h-16) fixed
- Content: Fluid with max-width-7xl
- Padding: p-6 (24px)
- Gap: gap-6 (24px)

### 2. Stat Cards

```
┌─────────────────────────────────┐
│ 📊 Icon (48x48)    Value (3xl)  │
│                                 │
│ Label (sm, gray-600)            │
│ Trend ↑ +12% (xs, green)        │
└─────────────────────────────────┘
```

**Specifications:**
- Height: auto (min-h-32)
- Padding: p-6
- Border radius: rounded-lg
- Shadow: shadow-sm hover:shadow-md
- Transition: all 200ms

### 3. Case Detail Tabs

```
┌─────────────────────────────────────────┐
│ [Overview] [Victim] [Perpetrator]       │
│ [Evidence] [Timeline] [Court Records]   │
├─────────────────────────────────────────┤
│                                         │
│  Tab Content Area                       │
│  - Form fields (2-column grid)          │
│  - Read-only data display               │
│  - Action buttons (bottom-right)        │
│                                         │
└─────────────────────────────────────────┘
```

**Specifications:**
- Tab height: h-12
- Active tab: border-b-2 border-primary-600
- Content padding: p-6
- Grid: grid-cols-1 md:grid-cols-2 gap-6

### 4. Multi-Step Form Wizard

```
┌─────────────────────────────────────────┐
│ Step 1 ━━━ Step 2 ─── Step 3 ─── Step 4│
│   ✓        ●                            │
├─────────────────────────────────────────┤
│                                         │
│  Form Content                           │
│  - Section title                        │
│  - Form fields                          │
│  - Validation messages                  │
│                                         │
├─────────────────────────────────────────┤
│  [← Back]              [Next →] [Save]  │
└─────────────────────────────────────────┘
```

**Specifications:**
- Stepper height: h-16
- Progress bar: h-1
- Form padding: p-8
- Footer height: h-20
- Button spacing: gap-4

### 5. Data Table

```
┌─────────────────────────────────────────┐
│ [Search] [Filter ▼] [Export ↓]         │
├─────────────────────────────────────────┤
│ ☑ | Case No. | Victim | Status | Date  │
├─────────────────────────────────────────┤
│ ☐ | LA-2024  | Name   | 🟢 App | 11/10 │
│ ☐ | LA-2025  | Name   | 🟡 Pen | 11/09 │
│ ☐ | LA-2026  | Name   | 🔴 Rej | 11/08 │
├─────────────────────────────────────────┤
│ Showing 1-20 of 150   [← 1 2 3 ... →]  │
└─────────────────────────────────────────┘
```

**Specifications:**
- Header height: h-14
- Row height: h-16
- Hover: bg-gray-50
- Selected: bg-primary-50
- Pagination height: h-16

## 🎭 Role-Based UI Variations

### Level 1 (Read Only)
- View-only mode
- No action buttons
- Export functionality only
- Gray color scheme for restrictions

### Level 2 (Creator)
- Create button prominent (primary color)
- Edit own cases
- Draft status visible
- Green accents for actions

### Level 3 (Approver)
- Approve/Reject buttons prominent
- Pending cases highlighted (orange)
- Decision forms
- Blue accents for authority

### Level 4 (Delete Requester)
- Delete request button (red)
- Reason input required
- Warning states
- Orange accents for caution

### Level 5 (Full Authority)
- All actions available
- Approval workflows
- Critical actions (red)
- Purple accents for authority

### Super Admin
- System settings visible
- User management
- All permissions
- Dark blue accents

### App Admin
- Application configuration
- Federal oversight
- Cross-state access
- Indigo accents

## 📱 Responsive Breakpoints

```css
/* Mobile First */
--screen-sm: 640px;   /* Small devices */
--screen-md: 768px;   /* Tablets */
--screen-lg: 1024px;  /* Laptops */
--screen-xl: 1280px;  /* Desktops */
--screen-2xl: 1536px; /* Large screens */
```

### Layout Adaptations

**Mobile (< 768px):**
- Sidebar: Hidden (hamburger menu)
- Grid: 1 column
- Stats: Stacked
- Tables: Horizontal scroll

**Tablet (768px - 1024px):**
- Sidebar: Collapsible
- Grid: 2 columns
- Stats: 2x2 grid
- Tables: Full width

**Desktop (> 1024px):**
- Sidebar: Fixed visible
- Grid: 3-4 columns
- Stats: 4 columns
- Tables: Full features

## ♿ Accessibility

### WCAG 2.1 Level AA Compliance

**Color Contrast:**
- Text: Minimum 4.5:1
- Large text: Minimum 3:1
- UI components: Minimum 3:1

**Keyboard Navigation:**
- Tab order logical
- Focus indicators visible
- Skip links available
- Keyboard shortcuts

**Screen Readers:**
- ARIA labels
- Semantic HTML
- Alt text for images
- Live regions for updates

**Focus States:**
```css
:focus-visible {
  outline: 2px solid var(--primary-600);
  outline-offset: 2px;
}
```

## 🎬 Animations

### Transitions

```css
/* Fast - UI feedback */
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);

/* Base - Standard interactions */
--transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);

/* Slow - Complex animations */
--transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
```

### Animation Types

**Fade In:**
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

**Slide In:**
```css
@keyframes slideIn {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

**Scale:**
```css
@keyframes scale {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
```

## 🎯 User Flows

### 1. Case Creation Flow (4 Steps)

```
Step 1: Case Overview
├─ Form of SGBV (required)
├─ Legal service type
└─ Case identifiers

Step 2: Victim Details
├─ Personal information (required)
├─ Contact details
└─ Biometric data (optional)

Step 3: Perpetrator Details
├─ Personal information (required)
├─ Relationship to victim
└─ Criminal history

Step 4: Offence Details
├─ Offence information (required)
├─ Investigation status
└─ Evidence summary
```

### 2. Evidence Upload Flow

```
1. Select Evidence Type
   ↓
2. Fill Evidence Form
   ├─ Description (required)
   ├─ Date collected
   └─ Collected by
   ↓
3. Upload Files
   ├─ Validation (type, size)
   ├─ Progress indicator
   └─ Preview
   ↓
4. Chain of Custody
   ├─ Custody log
   ├─ Signatures
   └─ Timestamps
   ↓
5. Confirmation
   └─ Success message
```

### 3. Approval Workflow

```
Case Submitted
   ↓
Notification to Level 3+
   ↓
Review Case Details
   ├─ View all information
   ├─ Check completeness
   └─ Verify evidence
   ↓
Decision
   ├─ Approve → Update status → Notify creator
   └─ Reject → Enter reason → Notify creator
```

## 🎨 Component Library

### Using Radix UI Primitives

```typescript
// Accessible components
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Tabs from '@radix-ui/react-tabs';
import * as Select from '@radix-ui/react-select';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as RadioGroup from '@radix-ui/react-radio-group';
```

### Icons - Lucide React

```typescript
import {
  FileText,      // Cases
  Users,         // Users
  BarChart3,     // Statistics
  Shield,        // Security
  AlertCircle,   // Warnings
  CheckCircle,   // Success
  XCircle,       // Error
  Clock,         // Pending
  Trash2,        // Delete
  Edit,          // Edit
  Eye,           // View
  Download,      // Export
} from 'lucide-react';
```

### Charts - Recharts

```typescript
import {
  LineChart,
  BarChart,
  PieChart,
  AreaChart,
} from 'recharts';
```

## 📊 Data Visualization

### Chart Types

**Line Chart:**
- Cases over time
- Trend analysis
- Height: 300px

**Bar Chart:**
- Cases by type
- State comparison
- Height: 400px

**Pie Chart:**
- Status distribution
- Type breakdown
- Size: 300x300px

**Area Chart:**
- Cumulative cases
- Growth trends
- Height: 350px

### Chart Colors

```typescript
const chartColors = {
  primary: '#2563eb',
  secondary: '#16a34a',
  tertiary: '#f59e0b',
  quaternary: '#ef4444',
  quinary: '#8b5cf6',
};
```

## 🎨 Design Tokens

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

### Border Radius

```css
--radius-sm: 0.25rem;   /* 4px */
--radius-base: 0.375rem; /* 6px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1rem;      /* 16px */
--radius-full: 9999px;  /* Circular */
```

### Z-Index Scale

```css
--z-base: 0;
--z-dropdown: 1000;
--z-sticky: 1100;
--z-fixed: 1200;
--z-modal-backdrop: 1300;
--z-modal: 1400;
--z-popover: 1500;
--z-tooltip: 1600;
```

## 📱 Mobile-First Approach

### Design Priorities

1. **Touch Targets**: Minimum 44x44px
2. **Readable Text**: Minimum 16px base
3. **Simplified Navigation**: Bottom nav on mobile
4. **Optimized Forms**: One column, large inputs
5. **Performance**: Lazy loading, code splitting

### Mobile Optimizations

- Collapsible sidebar
- Bottom sheet modals
- Swipe gestures
- Pull to refresh
- Offline indicators

## 🎯 Performance

### Loading States

- Skeleton screens
- Spinner for actions
- Progress bars for uploads
- Optimistic UI updates

### Code Splitting

- Route-based splitting
- Component lazy loading
- Dynamic imports
- Prefetching

## 🔍 Search & Filters

### Search Bar
- Debounced input (300ms)
- Clear button
- Loading indicator
- Recent searches

### Filter Panel
- Collapsible sections
- Multi-select
- Date range picker
- Quick filters
- Clear all button

---

**Design System Version**: 1.0.0
**Last Updated**: November 2024
**Maintained By**: CaseLogPro2 Design Team

