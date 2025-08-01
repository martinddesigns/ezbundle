import { SameShape, BuildOptions, build } from "esbuild";
import {globSync} from 'glob'
import path from 'path'

const entryPoints = globSync(`./src/**/!(_)*.*`).filter(
  (file) => {
    if(path.basename(file).startsWith("_")) return
    const ext = path.extname(file).toLowerCase();

    return ['.js', '.ts'].includes(ext);
  }
);

export const options = {
  entryPoints,
  external: ['*'],
  format: 'esm',
  outdir: 'dist',
  outbase: 'src',
  bundle: true,
  assetNames: '[dir]/[name]',
  logLevel: 'info'
} satisfies SameShape<BuildOptions, BuildOptions>

build(options)

export { build };
