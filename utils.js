import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "fs";

import DEFAULT_CONFIG from "./DEFAULT_CONFIG.js";

function fileExists(path) {
  return existsSync(path) && lstatSync(path).isFile();
}

function dirExists(path) {
  return existsSync(path) && lstatSync(path).isDirectory();
}

function readConfig() {
  if (!fileExists("./json-modelizer.json")) return DEFAULT_CONFIG;

  const content = readFileSync("./json-modelizer.json", "utf-8");
  const config = JSON.parse(content);
  return { ...DEFAULT_CONFIG, ...config };
}

function sanitizeDatapath(datapath) {
  return datapath.endsWith("/") ? datapath : `${datapath}/`;
}

export function data(name, data, replacer = null, space) {
  const config = readConfig();
  const { prettyfy, indent } = config;
  const datapath = sanitizeDatapath(config.datapath);
  const filePath = `${datapath}${name}.json`;
  if (!dirExists(datapath)) {
    mkdirSync(datapath);
  }
  if (!fileExists(filePath)) {
    writeFileSync(filePath, "[]");
    return [];
  }

  if (data) {
    const json = prettyfy
      ? JSON.stringify(data, replacer, space || indent)
      : JSON.stringify(data, replacer);
    writeFileSync(filePath, json);
    return data;
  } else {
    const content = readFileSync(filePath, "utf-8");

    if (!content) {
      writeFileSync(filePath, "[]");
      return [];
    }

    const data = JSON.parse(content);
    return data;
  }
}

export default { data };
