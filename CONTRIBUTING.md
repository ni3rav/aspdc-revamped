# Contribution guide to ASPDC

We’re excited that you want to contribute! 🎉  
This guide will walk you through the contribution process so you can get started smoothly.

---

## 🔧 Tech Stack

Our site is built with:

- [Next.js](https://nextjs.org/) (Full Stack React Framework)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Query](https://tanstack.com/query/latest) (for data fetching and hooks)
- [Neon + Drizzle ORM](https://orm.drizzle.team/) (database)

---

## 📂 Setting Up Locally

Before you begin, make sure you have the following installed locally:

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [pnpm](https://pnpm.io/) (run `npm install -g pnpm` to install)

---

1. **Fork the repository**  
   Click the “Fork” button on the repo page.

2. **Clone your fork**

    ```bash
    git clone https://github.com/<your-username>/<repo-name>.git
    cd <repo-name>
    ```

3. **Install dependencies**

    ```bash
    pnpm install
    ```

4. **Set up environment variables**
    - Copy `.env.example` → `.env`
    - Fill in missing values as described (ask a maintainer if unsure).

5. **Run the development server**

    ```bash
    pnpm dev
    ```

6. Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🌱 Branching

Always create a **new branch** for your work:

```bash
git checkout -b fix/favicon
```

Branch naming convention:

- `fix/...` → for bug fixes
- `feature/...` → for new features
- `chore/...` → for tooling/docs changes

---

## ✅ Commit Messages

Follow this format:

```
<type>(scope): short description
```

Example:

```
fix(ui): adjust padding on mobile
feature(blog): add fallback UI
```

Types: `fix`, `feature`, `chore`, `docs`, `style`

---

## 🔄 Pull Requests

1. Push your branch to your fork:

    ```bash
    git push origin fix/favicon
    ```

2. Open a Pull Request (PR) against the `dev` branch of the main repo.

3. Make sure your PR includes:
    - A short description of your changes
    - Screenshots/GIFs if it’s a UI fix

---

## 💡 Contribution Tips

- Check existing issues before starting
- Assign yourself to an issue by commenting “I’ll take this”
- Small PRs are easier to review
- Be respectful and collaborative in code reviews

Happy contributing 🚀
