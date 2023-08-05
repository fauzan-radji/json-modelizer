import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "fs";

function fileExists(path) {
  return existsSync(path) && lstatSync(path).isFile();
}

function dirExists(path) {
  return existsSync(path) && lstatSync(path).isDirectory();
}

function readConfig() {
  if (!fileExists("./json-modelizer.json")) return {};

  const content = readFileSync("./json-modelizer.json", "utf-8");
  const config = JSON.parse(content);
  return config;
}

function getDataPath() {
  const config = readConfig();
  const dataPath = config.dataPath || "./data";

  return dataPath.endsWith("/") ? dataPath : `${dataPath}/`;
}

export function data(name, data) {
  const { prettyfy } = readConfig();
  const dataPath = getDataPath();
  const filePath = `${dataPath}${name}.json`;
  if (!dirExists(dataPath)) {
    mkdirSync(dataPath);
  }
  if (!fileExists(filePath)) {
    writeFileSync(filePath, "[]");
    return [];
  }

  if (data) {
    const json = prettyfy
      ? JSON.stringify(data, null, 2)
      : JSON.stringify(data);
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
