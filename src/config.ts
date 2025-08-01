import path from "path";
import type { Config } from "../types.d.ts";
import {load} from 'ts-import';

let cachedConfig: Config | null = null;

export const loadConfig = async() => {
  if (cachedConfig) return cachedConfig;

  try {
    const configPath = path.join(process.cwd(), 'ezbuild.config.ts');
    const configModule = await load(configPath, {
        // allowConfigurationWithComments: false,
    });
    // const configModule = await import(configPath.startsWith('file://') ? configPath : `file://${configPath}`);
    const config = configModule.default || configModule;

    cachedConfig = config
    return config as Config
  } catch (error) {
    console.warn('No ezbuild.config.ts found, using default configuration');
    return {};
  }
}