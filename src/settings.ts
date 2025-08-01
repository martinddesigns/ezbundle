import { globSync } from "glob";
import path from "path";

import { sassPlugin } from "esbuild-sass-plugin";
import { copy } from "esbuild-plugin-copy";
import clean from 'esbuild-plugin-clean'
import fs from 'fs'

import postcss from "postcss";
import autoprefixer from "autoprefixer";
import colors from 'colors'
import { loadConfig } from "./config.js";

import type { SameShape, BuildOptions } from "esbuild";

const config = await loadConfig()

const defaultAutoCompileCss = config.autoCompileCss !== undefined ? config.autoCompileCss : true
const defaultWatchDir = config.outbase || 'src'
const defaultOutDir = config.outDir || 'build'

export const entryPoints = globSync(`${defaultWatchDir}/**/!(_)*.*`).filter(
  (file) => {
    if(path.basename(file).startsWith("_")) return
    const ext = path.extname(file).toLowerCase();

    return ['.js', '.ts', '.css', '.scss'].includes(ext);
  }
).reduce((acc, entry) => {
  const ext = path.extname(entry).toLowerCase();
  const baseName = path.basename(entry, ext);
  if (['.ts', '.js'].includes(ext)) {
    acc[`scripts/${baseName}`] = entry; // Record format
  } else if (['.scss', '.css'].includes(ext)) {
    acc[`styles/${baseName}`] = entry; // Record format
  }
  return acc;
}, {} as Record<string, string>);

export function removeFolder(folderPath: string) {

  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        removeFolder(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(folderPath);
  }
}


export const ezBuildSettings = (mode: 'watch' | 'build', changedEntry?: Record<string, string>) => {
  if(mode === 'build') {
    removeFolder(`./${defaultOutDir}`)
  }

  return {
    ...mode === 'watch' ? {
      entryPoints: [
        ...defaultAutoCompileCss ? [path.resolve(`./${defaultWatchDir}/styles/app.scss`)] : [],
        ...(changedEntry ? Object.entries(changedEntry).map(([out, inPath]) => ({
          in: inPath,
          out: out
        })) : [])
      ],
      sourcemap: config.sourcemap,
    } : {
      entryPoints,
    },
    minify: config.minify !== undefined ? config.minify : true,
    outdir: defaultOutDir,
    outbase: config.outbase || 'src',
    format: config.format || 'esm',
    tsconfig: config.tsconfig || './tsconfig.json',
    bundle: config.bundle,
    logLevel: 'info',
    loader: {
      ".scss": "empty",
      ".css": "empty",
      ".woff2": "file",
      ".svg": "file",
    },
    external: config.bundle ? ['*.scss', '*.css'] : [],
    assetNames: '[dir]/[name]',
    plugins: [
      {
        name: "rebuild-log",
        setup({ onStart, onEnd }: {onStart: any, onEnd: any}) {
          let t: any;
          onStart(() => {
            t = Date.now();
            if(mode === 'build') {
              console.log(colors.bold.black.bgYellow("\n🚀 EZBuild version 1.0.0 🚀"));
            }
          });
        },
      },
      copy({
        resolveFrom: "cwd",
        assets: mode === 'build' ? [
            {
              from: [`./${defaultWatchDir}/fonts/*`],
              to: [`./${defaultOutDir}/fonts`],
            },
            {
              from: [`./${defaultWatchDir}/images/**/*`],
              to: [`./${defaultOutDir}/images`],
            }
          ] : []
      }),
      sassPlugin({
        async transform(source, path) {
          const tailwindcss = config.tailwind
          const { css } = await postcss(tailwindcss ? [autoprefixer, config.tailwind] : [autoprefixer]).process(
            source,
            {
              from: path,
            }
          );
          return css;
        },
        loadPaths: [
          path.resolve('node_modules'), // Add node_modules to loadPaths
        ]
      }),
      ...mode === 'build' ? [clean({
        patterns: [`./${defaultOutDir}/*`],
      })] : [],
    ]
  } satisfies SameShape<BuildOptions, BuildOptions>
}