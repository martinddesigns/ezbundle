import { Format } from "esbuild"

export type Config = {
  /**
   * The directory structure to replicate when building or watching.
   * If not specified, "src" folder will be used.
   * @default 'src'
   */
  outbase?: string
  /**
   * The output directory for compiled files.
   * If not specified, files are output in the "build" folder.
   * @default 'dist'
   */
  outDir?: string
  /**
   * Advanced watch configuration options.
   */
  watch?: {
    /**
   * Directories or files to watch for when in watch mode.
   * If not specified, watch defaults to src directory.
   * @default ['./src']
   */
    directories: string[]
  }
   /**
   * Path to your tsconfig.json.
   * If not specified, using ezbuild's default tsconfig.json.
  */
  tsconfig?: string
  /**
   * Output format for the generated javascript files.
   * If not specified, using esm as the default option.
   * @default esm
  */
  format?: Format
  /**
   * Compile app.css file on every file change for Tailwind support.
   * If not specified, defaults to true.
   * @default true
  */
  autoCompileCss?: boolean
  /**
   * Minification of the compiled files.
   * If not specified, defaults to true.
   * @default true
  */
  minify?: boolean
  /**
   * Source maps can make it easier to debug your code. Works only in watch mode.
   * If not specified, defaults to true.
   * @default false
  */
  sourcemap?: boolean
  /**
   * Inline any imported dependencies into the file itself
   * If not specified, defaults to false.
   * @default false
  */
  bundle?: boolean
  /**
   * Support for TailwindCSS
   * For Tailwind 4 you will need to import '@tailwindcss/postcss'
   * For Tailwind 3 you will need to import 'tailwindcss'
  */
  tailwind?: any
}