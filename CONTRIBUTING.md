# Contributing to AI Groceries

Thank you for your interest in contributing to AI Groceries. This guide walks you through the process of submitting changes.

---

## Getting Started

1. **Fork the repository** on GitHub at [github.com/quantnexusai/ai-groceries](https://github.com/quantnexusai/ai-groceries).

2. **Clone your fork** locally:

   ```bash
   git clone https://github.com/<your-username>/ai-groceries.git
   cd ai-groceries
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Create a branch** for your work:

   ```bash
   git checkout -b feature/your-feature-name
   ```

   Use a descriptive branch name. Prefix with `feature/`, `fix/`, or `docs/` as appropriate.

---

## Development Workflow

1. **Run the dev server** to test your changes:

   ```bash
   npm run dev
   ```

2. **Follow the style guide**. See [STYLE-GUIDE.md](STYLE-GUIDE.md) for design system details including colors, typography, and component classes.

3. **Test in demo mode**. If you don't have API keys configured, the app runs in demo mode automatically. Make sure your changes work in both demo and live modes.

4. **Run the build** before submitting to catch any errors:

   ```bash
   npm run build
   ```

---

## Commit Guidelines

Write clear, concise commit messages that describe **what** changed and **why**.

**Format:**

```
<type>: <short description>

<optional longer description>
```

**Types:**

| Type       | Use for                                  |
| ---------- | ---------------------------------------- |
| `feat`     | New features                             |
| `fix`      | Bug fixes                                |
| `docs`     | Documentation changes                    |
| `style`    | Formatting, whitespace (no logic change) |
| `refactor` | Code restructuring (no feature change)   |
| `test`     | Adding or updating tests                 |
| `chore`    | Build process, dependency updates        |

**Examples:**

```
feat: add product search by category
fix: resolve cart total calculation for multi-store orders
docs: update environment variables table in README
```

---

## Submitting a Pull Request

1. **Push your branch** to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a pull request** against the `main` branch of the upstream repository.

3. **Fill out the PR description** with:
   - A summary of what changed
   - Why the change was made
   - Any testing steps or screenshots if the change is visual

4. **Wait for review**. A maintainer will review your PR and may request changes.

---

## Code Standards

- **TypeScript** -- use proper types; avoid `any` where possible.
- **Tailwind CSS** -- use the project's custom theme tokens (see STYLE-GUIDE.md) rather than arbitrary values.
- **Components** -- keep components focused and reusable. Place shared components in `src/components/`.
- **API routes** -- place all API routes under `src/app/api/`. Follow existing patterns for error handling and response formatting.
- **Supabase** -- any schema changes must be reflected in `supabase/schema.sql`. Include RLS policies for new tables.

---

## Reporting Issues

If you find a bug or have a feature request, please open an issue on the [GitHub Issues](https://github.com/quantnexusai/ai-groceries/issues) page. Include:

- A clear description of the problem or request
- Steps to reproduce (for bugs)
- Expected vs. actual behavior
- Browser and OS information if relevant

---

## License

By contributing to AI Groceries, you agree that your contributions will be licensed under the [MIT License](LICENSE).
