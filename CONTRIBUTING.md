# Contributing Guide

Thank you for considering contributing to the WhatsApp Chat to PDF Converter!

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported
2. Use the bug report template
3. Include:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots (if applicable)
   - Environment (browser, OS, etc.)

### Suggesting Features

1. Check if the feature has already been suggested
2. Explain the use case
3. Describe the expected behavior
4. Consider implementation complexity

### Code Contributions

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Test thoroughly
5. Commit with clear messages: `git commit -m "Add feature: description"`
6. Push to your fork: `git push origin feature/your-feature-name`
7. Create a Pull Request

## Development Setup

See [QUICKSTART.md](QUICKSTART.md) for setup instructions.

## Code Style

### JavaScript
- Use ES6+ features
- Use const/let instead of var
- Add JSDoc comments for functions
- Keep functions small and focused

### React/Next.js
- Use functional components
- Use hooks appropriately
- Keep components focused on single responsibility
- Use CSS Modules for styling

### Naming Conventions
- Components: PascalCase (e.g., `FileUpload.js`)
- Files: camelCase or kebab-case
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE

## Testing

Before submitting:
- Test with both Android and iPhone format chats
- Test with different file sizes
- Test authentication flow
- Test on mobile devices
- Check browser console for errors

## Pull Request Guidelines

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Keep PRs focused on single feature/fix
5. Write clear commit messages
6. Reference related issues

## Areas for Contribution

### High Priority
- Payment gateway integration (bKash, Nagad)
- Enhanced PDF formatting options
- Batch file processing
- Email delivery of PDFs

### Medium Priority
- Dark mode support
- Multiple language support
- Chat statistics/analytics
- Export to other formats (Word, CSV)

### Low Priority
- Image support in PDFs
- Emoji rendering improvements
- Custom PDF templates
- Social media sharing

## Questions?

Open an issue for discussion or clarification.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
