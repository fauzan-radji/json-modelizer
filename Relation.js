export default class Relation {
  constructor(src, dest, type, key) {
    this.src = src;
    this.dest = dest;
    this.type = type;
    this.key = key;
  }

  // Relation.hasOne(User, Post, "userId");

  static hasOne(src, dest, key) {
    if (!key) key = src.table + "Id";

    return new Relation(src, dest, Relation.#HAS_ONE, key);
  }

  static belongsTo(src, dest, key) {
    if (!key) key = dest.table + "Id";

    return new Relation(src, dest, Relation.#BELONGS_TO, key);
  }

  getRelatedModel() {
    const model = this.src;
    const relatedModel = this.dest;

    switch (this.type) {
      case Relation.#HAS_ONE:
        return relatedModel.find({ [this.key]: model.id });

      case Relation.#BELONGS_TO:
        return relatedModel.find(model[this.key]);

      default:
        throw new Error("Invalid relation type");
    }
  }

  static #HAS_ONE = "hasOne";
  static #BELONGS_TO = "belongsTo";
}
