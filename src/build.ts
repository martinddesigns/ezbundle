import {build as esBuild} from "esbuild";
import { ezBuildSettings } from "./settings.js";

export const build = () => {
  esBuild(ezBuildSettings("build"));
}