import Relation from "./Relation.js";
import { data } from "./utils.js";

export default class Model {
  static _table;
  static _fields = [];
  static _relations = [];
  #table;

  /**
   * @param {Object} obj
   * @param {number} obj.id
   * @param {number} obj._id
   * @returns {Model}
   */
  constructor(obj) {
    this.#table = this.constructor._table;
    this._id = obj.id || obj._id || 0;

    const filteredObj = this.constructor.filtered(obj);
    for (const [key, value] of Object.entries(filteredObj)) this[key] = value;

    for (const relation of this.constructor._relations) {
      Object.defineProperty(this, relation.table, {
        get() {
          const { model, type, foreignKey, localKey } = relation;
          switch (type) {
            case Relation.HAS_ONE:
              return model.findBy(foreignKey, this[localKey]);

            case Relation.HAS_MANY:
              return model.where(foreignKey, this[localKey]);

            case Relation.BELONGS_TO:
              return model.findBy(foreignKey, this[localKey]);
          }
        },
        enumerable: true,
      });
    }
  }

  delete() {
    return this.constructor.delete(this.id);
  }

  update(obj) {
    this.constructor.update(this.id, obj);
    return this.#refresh();
  }

  #refresh() {
    const model = this.constructor.find(this.id);
    if (model) {
      for (const [key, value] of Object.entries(model)) {
        this[key] = value;
      }
    }
    return this;
  }

  get id() {
    return this._id;
  }

  get table() {
    return this.#table;
  }

  static get table() {
    return this._table;
  }

  get filtered() {
    const obj = {};
    obj.id = this.id;
    for (const key of this.constructor._fields) {
      obj[key] = this[key];
    }
    for (const relation of this.constructor._relations) {
      obj[relation.localKey] = this[relation.localKey];
    }
    return obj;
  }

  static filtered(obj) {
    const newObj = {};

    for (const field of this._fields) newObj[field] = obj[field];
    for (const relation of this._relations) {
      if (relation.type !== Relation.BELONGS_TO) continue;
      newObj[relation.localKey] = obj[relation.localKey];
    }

    return newObj;
  }

  static _save(models) {
    data(
      this.table,
      models.map((model) => model.filtered)
    );
  }

  /**
   * Retrieve all Models from the table
   * @returns {Model[]}
   */
  static all() {
    const table = this.table;
    return data(table).map((model) => new this(model));
  }

  /**
   * Create new Model and save it to the table
   * @param {Object} obj
   * @returns {Model}
   */
  static create(obj) {
    const models = this.all();
    const lastId = Math.max(0, ...models.map((model) => model.id));
    obj.id = lastId + 1;

    const model = new this(obj);
    models.push(model);
    this._save(models);

    return model;
  }

  /**
   * Find a Model by key and value
   * @param {string} key
   * @param {*} value
   * @returns {Model | null}
   */
  static findBy(key, value) {
    const models = this.all();
    const model = models.find((model) => model[key] === value);
    if (model) return model;
    else return null;
  }

  /**
   * Find a Model by id
   * @param {number} id
   * @returns {Model | null}
   * @example
   * Contact.find(1); // => Contact
   * Contact.find(999); // => null
   */
  static find(id) {
    return this.findBy("_id", id);
  }

  /**
   * Find all Models by key and value
   * @param {string} key
   * @param {*} value
   * @returns {Model[]}
   * @example
   * Contact.where("chat_id", 1234567890); // [Contact, Contact, Contact]
   */
  static where(key, value) {
    return this.filter((model) => model[key] === value);
  }

  /**
   * Delete a Model by id
   * @param {number} id
   * @returns {Model | null}
   */
  static delete(id) {
    const models = this.all();
    const index = models.findIndex((model) => model.id === id);
    if (index === -1) return null;

    const model = models[index];
    models.splice(index, 1);
    this._save(models);

    return model;
  }

  /**
   * Update a Model by id
   * @param {number} id
   * @param {Object} obj
   * @returns {Model | null}
   */
  static update(id, obj) {
    const models = this.all();
    const index = models.findIndex((model) => model.id === id);
    if (index === -1) return null;

    const model = models[index];
    models[index] = new this({ ...model, ...obj });
    this._save(models);

    return model;
  }

  /**
   * Retrieve the last Model from the table
   * @returns {Model | null}
   */
  static last() {
    const models = this.all();
    if (models.length === 0) return null;

    return models[models.length - 1];
  }

  /**
   * Retrieve the first Model from the table
   * @returns {Model | null}
   */
  static first() {
    const models = this.all();
    if (models.length === 0) return null;

    return models[0];
  }

  /**
   * Retrieve the number of Models in the table that match the callback
   * @param {Function} callback
   * @returns {number}
   */
  static filter(callback) {
    const models = this.all();
    return models.filter(callback);
  }

  /**
   * Clear the table
   * @returns {Model[]} The deleted Models
   */
  static clear() {
    const models = this.all();
    this._save([]);
    return models;
  }
}
