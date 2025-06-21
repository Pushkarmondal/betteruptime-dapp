# BetterUptime DApp

A modern decentralized application built with Turborepo for optimal development experience and performance.

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh/) (recommended) or Node.js
- Git

### Installation

1. **Clone and navigate to the project**
   ```bash
   cd betteruptime-dapp
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Start development server**
   ```bash
   bun run dev
   ```

4. **Enable Remote Caching** (recommended)
   ```bash
   bunx turbo login
   ```
   Learn more about [Turborepo Remote Cache](https://turborepo.com/remote-cache)


## 🛠️ Available Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development servers for all apps |
| `bun run build` | Build all apps and packages |
| `bun run lint` | Lint all apps and packages |
| `bun run check-types` | Run TypeScript type checking |
| `bun run format` | Format code using Prettier |

## 💡 Development Tips

- **Turborepo Caching**: Run any command twice to benefit from Turborepo's intelligent caching system
- **Parallel Development**: All apps and packages run concurrently during development
- **Shared Dependencies**: Common packages are automatically linked across the monorepo

## 🏗️ Built With

- **[Turborepo](https://turborepo.org/)** - Build system and monorepo tools
- **[Bun](https://bun.sh/)** - Fast JavaScript runtime and package manager
- **TypeScript** - Type-safe JavaScript development

**Happy coding!** 🎉