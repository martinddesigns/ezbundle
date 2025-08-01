#!/usr/bin/env node

import { Command } from 'commander';
import {build} from '../dist/build.js';
import {watcher} from '../dist/watch.js';
const program = new Command();

program
  .name('ezbundle')
  .description('esbuild wrapper which simplifies bundling.')
  .version('1.0.0');

program
  .command('build')
  .description('Production mode. Compiles all the files.')
  .action(() => {
    build()
})

program
  .command('watch')
  .description('Watch mode. Watches for file changes.')
  .action(() => {
    watcher()
})

program.parse(process.argv)