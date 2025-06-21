# Success! Created your Turborepo at betteruptime-dapp

# To get started:
# 1. Change to the project directory
cd betteruptime-dapp

# 2. Enable Remote Caching (recommended)
bunx turbo login`
#    Learn more: https://turborepo.com/remote-cache

# 3. Available commands:
bun run build   # Build all apps and packages
bun run dev     # Develop all apps and packages
bun run lint    # Lint all apps and packages

# Tip: Run a command twice to hit cache

# BetterUptime DApp

Welcome to the BetterUptime DApp monorepo! This project is built using Turborepo for optimal development experience.

## Project Structure

- `/apps` - Contains the main applications
  - `/web` - Web application
  - `/docs` - Documentation site
- `/packages` - Shared packages and libraries

## Getting Started
`
1. Install dependencies:
    ```bash
   bun install
    ```

2. Start the development server:
    ```bash
   bun run dev
    ```

## Development

- Run type checking: `bun run check-types`
- Format code: `bun run format`