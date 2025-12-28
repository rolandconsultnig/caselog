# Contributing to CaseLogPro2

Thank you for your interest in contributing to CaseLogPro2! This document provides guidelines for contributing to the project.

## Code of Conduct

This project serves the Nigerian justice system and handles sensitive SGBV case data. All contributors must:

- Maintain confidentiality of any case data they may encounter
- Follow security best practices
- Respect the privacy and dignity of victims and survivors
- Adhere to professional conduct standards

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Follow the [SETUP.md](./SETUP.md) guide to set up your development environment
4. Create a new branch for your feature or bugfix

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or modifications

### 2. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run the development server
npm run dev

# Test your changes thoroughly
# - Create test cases
# - Test different user roles
# - Verify permissions work correctly
```

### 4. Commit Your Changes

Use clear, descriptive commit messages:

```bash
git add .
git commit -m "feat: add witness management functionality"
# or
git commit -m "fix: resolve case approval permission issue"
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Test additions or changes
- `chore:` - Maintenance tasks

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear description of changes
- Screenshots if UI changes
- Testing steps
- Any breaking changes

## Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type when possible
- Use meaningful variable names

```typescript
// Good
interface CaseData {
  victimName: string;
  offenceType: string;
  dateReported: Date;
}

// Avoid
const data: any = {};
```

### React Components

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper prop types

```typescript
// Good
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function Button({ onClick, children, variant = 'primary' }: ButtonProps) {
  // Component logic
}
```

### API Routes

- Validate all inputs
- Handle errors properly
- Return appropriate HTTP status codes
- Log important operations

```typescript
// Good
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const validatedData = schema.parse(body);
    
    // Process request
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Database

- Use Prisma for all database operations
- Never write raw SQL unless absolutely necessary
- Always use transactions for related operations
- Add appropriate indexes

```typescript
// Good
await prisma.$transaction(async (tx) => {
  await tx.case.create({ data: caseData });
  await tx.auditLog.create({ data: auditData });
});
```

## Security Guidelines

### Authentication & Authorization

- Always check user permissions before operations
- Use the `getPermissions()` helper function
- Verify tenant isolation
- Log all sensitive operations

```typescript
const permissions = getPermissions(user.accessLevel, user.tenantType);
if (!permissions.canCreate) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

### Data Handling

- Never log sensitive data
- Sanitize all user inputs
- Use parameterized queries (Prisma does this automatically)
- Encrypt sensitive data at rest

### Biometric Data

- Never store raw biometric data
- Only store reference IDs
- Follow GDPR and NDPR guidelines
- Implement proper consent mechanisms

## Testing

### Manual Testing

Test your changes with different user roles:

1. **Level 1 (Read Only)**
   - Can view cases
   - Cannot create or modify

2. **Level 2 (Creator)**
   - Can create cases
   - Cannot approve

3. **Level 3 (Approver)**
   - Can approve/reject cases

4. **Level 4 (Delete Requester)**
   - Can request deletions

5. **Level 5 (Full Authority)**
   - Can approve deletions

6. **Super Admin**
   - Full system access

7. **Federal vs State Users**
   - Federal can see all states
   - State users see only their state

### Test Checklist

- [ ] Feature works as expected
- [ ] Permissions are enforced correctly
- [ ] Error handling works properly
- [ ] UI is responsive (mobile, tablet, desktop)
- [ ] No console errors
- [ ] Database operations are efficient
- [ ] Audit logging works
- [ ] Works in different browsers

## Documentation

Update documentation when:
- Adding new features
- Changing existing functionality
- Modifying API endpoints
- Updating database schema

Files to update:
- `README.md` - Main documentation
- `SETUP.md` - Setup instructions
- `DEPLOYMENT.md` - Deployment guide
- Code comments - Inline documentation

## Pull Request Process

1. **Before Submitting:**
   - Test thoroughly
   - Update documentation
   - Run linter: `npm run lint`
   - Ensure build succeeds: `npm run build`

2. **PR Description Should Include:**
   - What changes were made
   - Why the changes were needed
   - How to test the changes
   - Screenshots (if UI changes)
   - Breaking changes (if any)

3. **Review Process:**
   - PRs require at least one approval
   - Address review comments
   - Keep PR scope focused

4. **After Approval:**
   - Squash commits if needed
   - Merge to main branch
   - Delete feature branch

## Feature Requests

To request a new feature:

1. Check existing issues first
2. Create a new issue with:
   - Clear description
   - Use case
   - Expected behavior
   - Priority level

## Bug Reports

To report a bug:

1. Check if already reported
2. Create issue with:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots/logs
   - Environment details

## Questions?

- Create a discussion thread
- Contact the development team
- Check existing documentation

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to CaseLogPro2 and helping improve justice delivery in Nigeria!

