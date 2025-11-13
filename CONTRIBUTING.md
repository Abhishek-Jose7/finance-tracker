# Contributing to FinAI

Thank you for your interest in contributing to FinAI! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear, descriptive title
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Your environment (OS, Node version, browser)

### Suggesting Features

1. Check existing feature requests
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/finance-tracker.git
   cd finance-tracker
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Write clear commit messages
   - Add tests if applicable
   - Update documentation

4. **Test your changes**
   ```bash
   npm run lint
   npm run build
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Provide clear description
   - Reference related issues
   - Ensure CI checks pass

## Development Setup

1. **Clone and install**
   ```bash
   git clone <repo-url>
   cd fpti
   npm install
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env
   # Add your GEMINI_API_KEY
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

## Coding Standards

### TypeScript
- Use TypeScript for all new code
- Define proper types, avoid `any`
- Use interfaces for object shapes

### React
- Use functional components with hooks
- Follow React best practices
- Keep components small and focused

### Styling
- Use Tailwind CSS utility classes
- Follow existing design patterns
- Ensure responsive design

### Naming Conventions
- Files: `kebab-case.tsx`
- Components: `PascalCase`
- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`

## Commit Messages

Follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Test additions or changes
- `chore:` Build process or auxiliary tool changes

Example:
```
feat: add budget export functionality

- Add CSV export button
- Implement data formatting
- Add download functionality
```

## Testing

- Write tests for new features
- Ensure existing tests pass
- Test across different browsers
- Test responsive behavior

## Documentation

- Update README.md for significant changes
- Add JSDoc comments for functions
- Update DEPLOYMENT.md for deployment changes
- Keep inline comments clear and relevant

## Questions?

Feel free to:
- Open an issue for discussion
- Reach out to maintainers
- Check existing documentation

Thank you for contributing! 🎉
