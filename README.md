# EzBundle
A zero-config esbuild wrapper that bundles your web projects in seconds—so you can focus on code, not build setups.

## Getting Started
> [!NOTE]
> This package was meant for personal use but I decided to publish it for others if they find the need for it. I mainly use it for my Wordpress projects where I upload everything on file save via FTP and need to see changes on live asap.
### Documentation
This is a quick introduction of how to implement ezbundle package into your project.
#### Installation
First, Install the package:
```
npm install ezbundle
```
or
```
pnpm install ezbundle
```
or
```
yarn add ezbundle
```
Then add the following scripts to your package.json:
```
"scripts": {
    "dev": "ezbundle watch",
    "build": "ezbundle build"
},
```
- **dev:** watch mode
- **build:** production mode
#### Configuration (optional)
To configure your setup create a `ezbuild.config.ts` at the root of your project. The following options are available:
```javascript
import type {Config} from 'ezbundle/types'
import tailwindcss from "@tailwindcss/postcss";

export default {
  // The directory structure to replicate when building or watching.
  // If not specified, "src" folder will be used.
  outbase: 'src',
  // The output directory for compiled files.
  // If not specified, files are output in the "build" folder.
  outDir: 'build',
  // Compile app.css file on every file change for Tailwind support.
  // If not specified, defaults to true.
  autoCompileCss: true,
  // Inline any imported dependencies into the file itself
  // If not specified, defaults to false.
  bundle: true,
  // Output format for the generated javascript files.
  // If not specified, using esm as the default option.
  format: 'esm',
  // Path to your tsconfig.json.
  // If not specified, using ezbuild's default tsconfig.json.
  tsconfig: './tsconfig.json',
  // Advanced watch configuration options.
  watch: {
    // Directories or files to watch for when in watch mode.
    // If not specified, watch defaults to src directory.
    directories: [
      './src',
      './index.html'
    ]
  },
  // Support for TailwindCSS
  // For Tailwind 4 you will need to import '@tailwindcss/postcss'
  // For Tailwind 3 you will need to import 'tailwindcss'
  tailwind: tailwindcss
} satisfies Config
```
Happy Coding!
