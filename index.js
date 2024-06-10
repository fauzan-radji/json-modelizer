import { configDotenv } from "dotenv";
configDotenv({
  path: [
    ".env",
    ".env.local",
    ".env.development",
    ".env.production",
    ".env.test",
  ],
});

export { default as Model } from "./Model.js";
export { default as Relation } from "./Relation.js";
export { default as Field } from "./Field.js";
