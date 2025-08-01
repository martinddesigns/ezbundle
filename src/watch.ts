import {build as esBuild} from "esbuild";
import { ezBuildSettings, entryPoints } from "./settings.js";
import colors from "colors";
import chokidar from 'chokidar'
import path from "path";
import { loadConfig } from "./config.js";

// If the call above had an `await`, Node would return
// immediately and you would NOT have the watcher
// running. Alternative, you could use an iife[1]:
export const watcher = async() => {
  const config = await loadConfig()
  // The same code from the `watch` function above.
  // Notice that it also doesn't have an `await` in
  // front of it.

  await esBuild(ezBuildSettings('build'));
  console.log(`\n${colors.green("👀 I'm Watching...")}\n`);

  chokidar.watch(config.watch?.directories || './src').on('all', (event, filePath) => {
    if (event === 'change') {
      let changedEntry: Record<string, string> = {}

      for (const [outPath, inPath] of Object.entries(entryPoints)) {
        if (filePath.includes(inPath)) { // Check if `filePath` matches the input path
          changedEntry = {
            [outPath]: inPath
          }; // Resolve full path
          break; // Exit loop once found
        }
      }

      esBuild(ezBuildSettings('watch', changedEntry));
    }
  })

}
