export default class Relation {
  constructor(userModel, type, model, localKey, foreignKey) {
    this.model = model;
    this.type = type;
    this.table = model.table;
    this.localKey = localKey;
    this.foreignKey = foreignKey;

    if (!this.localKey) {
      if (type === Relation.HAS_ONE || type === Relation.HAS_MANY) {
        this.localKey = "id";
      } else {
        this.localKey = `${model.table}_id`;
      }
    }

    if (!this.foreignKey) {
      if (type === Relation.HAS_ONE || type === Relation.HAS_MANY) {
        this.foreignKey = `${userModel.table}_id`;
      } else {
        this.foreignKey = "id";
      }
    }

    if (type !== Relation.BELONGS_TO) {
      model._relations.push(
        new Relation(
          model,
          Relation.BELONGS_TO,
          userModel,
          foreignKey,
          localKey
        )
      );
    }
  }

  static HAS_ONE = "hasOne";
  static HAS_MANY = "hasMany";
  static BELONGS_TO = "belongsTo";
}
