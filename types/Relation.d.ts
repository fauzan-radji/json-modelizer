import type Model from "./Model";

export default class Relation {
  #name: string;

  constructor(
    name: string,
    src: typeof Model,
    dest: typeof Model,
    type: string,
    key: string
  );

  key: string;
  name: string;
  src: typeof Model;
  dest: typeof Model;
  type: string;

  as(name: string): this;

  foreignKey(key: string): this;

  getRelatedModel(model: typeof Model): typeof Model | (typeof Model)[];

  static hasOne(src: typeof Model, dest: typeof Model): Relation;

  static hasMany(src: typeof Model, dest: typeof Model): Relation;

  static belongsTo(src: typeof Model, dest: typeof Model): Relation;

  static belongsToMany(src: typeof Model, dest: typeof Model): Relation;

  static #HAS_ONE: string;
  static #HAS_MANY: string;
  static #BELONGS_TO: string;
  static #BELONGS_TO_MANY: string;
}
