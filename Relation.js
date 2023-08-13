export default class Relation {
  #name;

  constructor(name, src, dest, type, key) {
    this.key = key;
    this.name = name;
    this.src = src;
    this.dest = dest;
    this.type = type;
  }

  as(name) {
    this.name = name;
    return this;
  }

  foreignKey(key) {
    this.key = key;
    return this;
  }

  set name(value) {
    if (typeof value !== "string")
      throw new Error("Relation name must be a string");

    this.#name = value;

    if (this.type === Relation.#BELONGS_TO) {
      this.key = `${value}Id`;
    }
  }

  get name() {
    return this.#name;
  }

  static hasOne(src, dest) {
    const name = dest.table;
    const key = `${src.table}Id`;

    return new Relation(name, src, dest, Relation.#HAS_ONE, key);
  }

  static hasMany(src, dest) {
    const name = dest.table;
    const key = `${src.table}Id`;

    return new Relation(name, src, dest, Relation.#HAS_MANY, key);
  }

  static belongsTo(src, dest) {
    const name = dest.table;
    const key = `${dest.table}Id`;

    return new Relation(name, src, dest, Relation.#BELONGS_TO, key);
  }

  getRelatedModel(model) {
    const relatedModel = this.dest;

    switch (this.type) {
      case Relation.#HAS_ONE:
        return relatedModel.findBy(this.key, model.id);

      case Relation.#BELONGS_TO:
        return relatedModel.find(model[this.key]);

      case Relation.#HAS_MANY:
        return relatedModel.where(this.key, model.id);

      default:
        throw new Error("Invalid relation type");
    }
  }

  static #HAS_ONE = "hasOne";
  static #HAS_MANY = "hasMany";
  static #BELONGS_TO = "belongsTo";
}
