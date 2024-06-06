import Relation from "./Relation.js";
import { data } from "./utils.js";

export default class Model {
  static _table;
  static _relations = [];
  static schema = {};
  #table;

  /**
   * @param {Object} obj
   * @param {number} obj.id
   * @returns {Model}
   */
  constructor(obj) {
    this.#table = this.constructor._table;
    Object.defineProperty(this, "id", {
      value: obj.id || 0,
      enumerable: true,
      writable: false,
      configurable: false,
    });

    for (const [key, field] of Object.entries(this.constructor.sanitize(obj))) {
      this[key] = field;
    }

    for (const relation of this.constructor._relations) {
      if (relation.key in obj) {
        this[relation.key] = obj[relation.key];
      }

      Object.defineProperty(this, relation.name, {
        get: () => relation.getRelatedModel(this),
        enumerable: true,
      });
    }

    Object.defineProperty(this, "createdAt", {
      value: new Date(obj.createdAt) || new Date(),
      enumerable: true,
      writable: false,
      configurable: false,
    });

    Object.defineProperty(this, "updatedAt", {
      value: new Date(obj.updatedAt) || new Date(),
      enumerable: true,
      writable: false,
      configurable: false,
    });
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
    const relationNames = this.constructor._relations.map(
      (relation) => relation.name
    );
    if (model)
      for (const [key, value] of Object.entries(model)) {
        if (["id", "createdAt", "updatedAt", ...relationNames].includes(key))
          continue;
        this[key] = value;
      }

    return this;
  }

  get table() {
    return this.#table;
  }

  get JSON() {
    return JSON.stringify(this);
  }

  static get table() {
    return this._table;
  }

  static _save(models) {
    const relationNames = this._relations.map((relation) => relation.name);
    data(this.table, models, (key, value) => {
      if (relationNames.includes(key)) return undefined;

      return value;
    });
  }

  static count() {
    return this.all().length;
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
   * Paginate Models using given page and limit params
   * @param {Number} page
   * @param {Number} limit
   * @returns {Model[]}
   */
  static paginate(page, limit, filterFunction = () => true) {
    if (limit < 1) throw new Error("The limit variable should be more than 0");
    const start = (page - 1) * limit;
    const end = page * limit;
    return this.filter(filterFunction).slice(start, end);
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
    obj.createdAt = new Date();
    obj.updatedAt = new Date();

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
   * @example
   * Contact.findBy("chatId", 1234567890); // => Contact
   * Contact.findBy("chatId", 999); // => null
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
    return this.findBy("id", id);
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
    models[index] = new this({ ...model, ...obj, updatedAt: new Date() });
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
   * @returns {Model[]}
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

  static sanitize(obj) {
    const newObj = {};
    for (const [key, field] of Object.entries(this.schema)) {
      try {
        const validated = field.validateAndSanitize(obj[key]);
        if (validated === undefined) continue;
        newObj[key] = validated;
      } catch (e) {
        throw new Error(`${key}: ${e.message}`);
      }
    }

    return newObj;
  }

  /**
   * @param {Model} model
   * @returns {void}
   */
  static hasOne(model) {
    this._relations = this._relations.slice();
    const relation = Relation.hasOne(this, model);
    this._relations.push(relation);

    return relation;
  }

  /**
   * @param {Model} model
   * @returns {void}
   */
  static hasMany(model) {
    this._relations = this._relations.slice();
    const relation = Relation.hasMany(this, model);
    this._relations.push(relation);

    return relation;
  }

  /**
   * @param {Model} model
   * @returns {void}
   */
  static belongsTo(model) {
    this._relations = this._relations.slice();
    const relation = Relation.belongsTo(this, model);
    this._relations.push(relation);

    return relation;
  }

  static belongsToMany(model) {
    this._relations = this._relations.slice();
    const relation = Relation.belongsToMany(this, model);
    this._relations.push(relation);

    return relation;
  }
}
