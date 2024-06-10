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
  const datapath = process.env.JSON_MODELIZER_DATAPATH
    ? process.env.JSON_MODELIZER_DATAPATH
    : DEFAULT_CONFIG.datapath;
  const prettyfy = process.env.JSON_MODELIZER_PRETTYFY
    ? process.env.JSON_MODELIZER_PRETTYFY === "true"
    : DEFAULT_CONFIG.prettyfy;
  const indent = process.env.JSON_MODELIZER_INDENT
    ? process.env.JSON_MODELIZER_INDENT
    : DEFAULT_CONFIG.indent;

  return { datapath, prettyfy, indent };
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
