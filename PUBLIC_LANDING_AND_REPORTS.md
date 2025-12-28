# Public Landing Page & Enhanced Reports System

Complete documentation for the new public-facing landing page and comprehensive reports & analytics system.

---

## 🌐 Public Landing Page

### Overview
A comprehensive public-facing website providing information about SGBV support services, helplines, medical assistance, and partner organizations across Nigeria.

### Features

#### 1. **Hero Section**
- Prominent call-to-action
- 24/7 support messaging
- Quick access to help services
- Staff login button

#### 2. **Emergency Banner**
- Always visible emergency helplines
- Police: 112
- National SGBV Helpline: 0800-033-3333
- Prominent red banner for visibility

#### 3. **Services Section** (6 Service Categories)
- ✅ **Legal Support**: Free counseling, court representation, documentation
- ✅ **Medical Assistance**: Emergency care, examinations, treatment
- ✅ **Counseling Services**: Trauma counseling, psychological support
- ✅ **Safe Shelter**: Emergency accommodation, safe houses
- ✅ **Referral Services**: Hospital, legal aid, NGO connections
- ✅ **Case Management**: Documentation, follow-up, tracking

#### 4. **24/7 Helplines Section**
- **National SGBV Helpline**: 0800-033-3333
- **Police Emergency**: 112
- **Medical Emergency**: 199
- **Federal Ministry of Justice**: 09-462-1901
- **Women Affairs**: 0800-011-1111
- **Child Protection**: 0800-080-0800
- **State-Specific Helplines**: Lagos, FCT, Kano, Rivers, Kaduna, etc.

#### 5. **Medical Assistance Section**
- Emergency medical care information
- Designated hospitals list:
  - National Hospital Abuja
  - Lagos University Teaching Hospital
  - University of Nigeria Teaching Hospital
- What to expect (4-step process)
- Medical examination and reporting

#### 6. **Partners Section**
- **Government Agencies**:
  - Federal Ministry of Justice
  - Ministry of Women Affairs
  - Nigeria Police Force
  - Federal Ministry of Health

- **NGO & Civil Society Partners**:
  - WARIF Foundation
  - Mirabel Centre
  - Project Alert
  - FIDA
  - ActionAid Nigeria
  - Plan International
  - UNICEF Nigeria

- **International Partners**:
  - UN Women
  - UNFPA
  - WHO
  - USAID

#### 7. **Resources Section**
- Know Your Rights
- Support Someone
- Prevention Programs

#### 8. **Call-to-Action Section**
- Prominent help buttons
- Phone numbers
- 24/7 availability message

#### 9. **Footer**
- Quick links
- Legal information
- Contact details
- Staff login link

### Design Features
- ✅ Responsive design (mobile-first)
- ✅ Accessible (WCAG 2.1 compliant)
- ✅ Clean, modern UI
- ✅ Easy navigation
- ✅ Color-coded sections
- ✅ Icon-based visual hierarchy
- ✅ Hover effects and transitions

### URL Structure
```
/ (root)                    → Public landing page (if not logged in)
                            → Dashboard redirect (if logged in)
/auth/signin                → Staff login page
```

---

## 📊 Enhanced Reports & Analytics System

### Overview
Comprehensive reporting system with 4 report types, multiple export formats, and advanced analytics capabilities.

### Report Types

#### 1. **Summary Report**
**Purpose**: Quick overview of case statistics

**Includes**:
- Total cases count
- Status breakdown (Draft, Pending, Approved, Rejected, etc.)
- SGBV type distribution
- Resolution rate (%)
- Average processing time (days)

**Visualizations**:
- Bar chart: Status distribution
- Pie chart: SGBV type distribution

**Access**: Level 3+

---

#### 2. **Detailed Report**
**Purpose**: Complete case-by-case listing

**Includes**:
- Full case details
- Victim information
- Perpetrator information
- Offence details
- Tenant information
- Created by information
- Timestamps

**Format**: Tabular data with all fields

**Access**: Level 3+

---

#### 3. **Trends Analysis Report**
**Purpose**: Time-series analysis of cases

**Includes**:
- Monthly case trends
- Status trends over time
- SGBV type trends
- Growth patterns
- Seasonal variations

**Visualizations**:
- Area chart: Cases over time
- Line chart: Trend analysis

**Access**: Level 3+

---

#### 4. **Performance Metrics Report**
**Purpose**: Operational performance analysis

**Includes**:
- Approval rate (%)
- Rejection rate (%)
- Pending cases count
- Average approval time (hours)
- Case processing efficiency
- Workflow performance

**Visualizations**:
- Bar chart: Performance metrics
- KPI cards: Key metrics

**Access**: Level 3+

---

### Filtering Options

#### Date Range
- Start date selector
- End date selector
- Custom date ranges
- Predefined ranges (planned)

#### Tenant Filter
- All states (Federal users)
- Specific state selection
- Own state only (State users)

#### SGBV Type Filter (planned)
- Filter by specific SGBV types
- Multiple type selection

#### Status Filter (planned)
- Filter by case status
- Multiple status selection

---

### Export Formats

#### Planned Export Options
1. **PDF Export**
   - Formatted report with charts
   - Professional layout
   - Print-ready

2. **Excel Export**
   - Spreadsheet format
   - Multiple sheets
   - Formulas and calculations

3. **CSV Export**
   - Raw data export
   - Import-friendly
   - Universal compatibility

4. **JSON Export**
   - API-friendly format
   - Structured data
   - Integration support

---

### API Endpoints

#### GET `/api/reports`

**Query Parameters**:
```typescript
{
  type: 'summary' | 'detailed' | 'trends' | 'performance',
  startDate?: string,  // ISO date
  endDate?: string,    // ISO date
  tenantId?: string,   // For Federal users
  formOfSGBV?: string  // Filter by type
}
```

**Response Format**:
```typescript
{
  reportType: string,
  generatedAt: string,  // ISO timestamp
  data: {
    // Report-specific data
  },
  totalRecords?: number  // For detailed reports
}
```

**Permissions Required**:
- `canGenerateReports` (Level 3+)

---

### Dashboard Integration

#### Navigation
- New "Reports" menu item
- Visible to Level 3+ users
- Icon: BarChart3

#### Quick Stats
- Accessible from main dashboard
- Real-time statistics
- Visual indicators

---

### Performance Metrics

#### Calculated Metrics

1. **Resolution Rate**
```typescript
(Resolved Cases / Total Cases) × 100
// Resolved = Approved + Closed + Archived
```

2. **Average Processing Time**
```typescript
Sum(Approval Date - Creation Date) / Total Cases
// In days
```

3. **Approval Rate**
```typescript
(Approved Cases / Total Cases) × 100
```

4. **Average Approval Time**
```typescript
Sum(Approval Date - Creation Date) / Approved Cases
// In hours
```

---

### Visualizations

#### Chart Types

1. **Bar Charts**
   - Status distribution
   - Performance metrics
   - Comparative analysis

2. **Pie Charts**
   - SGBV type distribution
   - Percentage breakdowns

3. **Line Charts**
   - Trend analysis
   - Time-series data

4. **Area Charts**
   - Cumulative trends
   - Growth patterns

#### Chart Library
- **Recharts**: Responsive, customizable charts
- **Colors**: Consistent with design system
- **Tooltips**: Interactive data exploration
- **Legends**: Clear labeling

---

### Access Control

| Role | View Reports | Generate | Export | Schedule |
|------|-------------|----------|--------|----------|
| Level 1 | ❌ | ❌ | ❌ | ❌ |
| Level 2 | ❌ | ❌ | ❌ | ❌ |
| Level 3 | ✅ | ✅ | ✅ | ❌ |
| Level 4 | ✅ | ✅ | ✅ | ✅ |
| Level 5 | ✅ | ✅ | ✅ | ✅ |
| Super Admin | ✅ | ✅ | ✅ | ✅ |
| App Admin | ✅ | ✅ | ✅ | ✅ |

---

### Future Enhancements

#### Planned Features

1. **Scheduled Reports**
   - Daily, weekly, monthly schedules
   - Email delivery
   - Automated generation

2. **Custom Report Builder**
   - Drag-and-drop interface
   - Custom field selection
   - Save report templates

3. **Advanced Filters**
   - Multiple filter combinations
   - Saved filter presets
   - Complex queries

4. **Data Visualization**
   - More chart types
   - Interactive dashboards
   - Drill-down capabilities

5. **Comparative Analysis**
   - State-to-state comparison
   - Year-over-year analysis
   - Benchmark metrics

6. **Real-time Reports**
   - Live data updates
   - WebSocket integration
   - Auto-refresh

---

## 🎨 Design Specifications

### Public Landing Page

#### Color Scheme
- **Primary**: Green (#16a34a) - Safety, growth
- **Emergency**: Red (#ef4444) - Urgency
- **Info**: Blue (#2563eb) - Trust
- **Warning**: Yellow/Orange - Caution

#### Typography
- **Headings**: Bold, large (3xl-5xl)
- **Body**: Regular, readable (base-lg)
- **Links**: Underlined on hover

#### Spacing
- Generous padding (py-20 sections)
- Clear visual hierarchy
- Breathing room

### Reports Dashboard

#### Layout
- Clean, data-focused
- Card-based design
- Responsive grid

#### Colors
- Consistent with design system
- Chart colors: Blue, Green, Orange, Red, Purple
- Status colors: Success, Warning, Danger

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Optimizations
- Stacked layouts
- Touch-friendly buttons (44px min)
- Simplified navigation
- Readable text sizes

---

## ♿ Accessibility

### WCAG 2.1 Level AA Compliance
- ✅ Color contrast ratios met
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ ARIA labels
- ✅ Focus indicators
- ✅ Semantic HTML

---

## 🔒 Security

### Public Page
- No authentication required
- No sensitive data exposed
- Rate limiting on form submissions
- CSRF protection

### Reports System
- Authentication required
- Permission-based access
- Tenant data isolation
- Audit logging
- Secure API endpoints

---

## 📊 Performance

### Optimization
- Server-side rendering (SSR)
- Code splitting
- Lazy loading
- Image optimization
- Caching strategies

### Metrics
- Page load: < 3 seconds
- Time to interactive: < 5 seconds
- Chart rendering: < 1 second

---

## 🧪 Testing

### Test Coverage
- Unit tests for calculations
- Integration tests for API
- E2E tests for user flows
- Accessibility testing
- Performance testing

---

## 📚 Related Documentation

- **[README.md](./README.md)** - Main documentation
- **[DESIGN_ARCHITECTURE.md](./DESIGN_ARCHITECTURE.md)** - Design system
- **[ACCESS_CONTROL.md](./ACCESS_CONTROL.md)** - Permissions
- **[API.md](./API.md)** - API reference

---

**Version**: 1.0.0
**Last Updated**: November 2024
**Status**: ✅ Complete and Ready

