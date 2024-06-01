import Relation from "./Relation.js";

export default class Model {
  static _table: string;
  static _relations: Relation[];
  static schema: { [key: string]: any };

  #table: string;

  constructor(obj: { id: number; createdAt?: string; updatedAt?: string });

  delete(): Model | null;

  update(obj: { [key: string]: any }): Model;

  #refresh(): Model;

  get table(): string;

  get JSON(): string;

  static get table(): string;

  static _save(models: Model[]): void;

  static count(): number;

  static all(): Model[];

  static paginate(page: number, limit: number): Model[];

  static create(obj: { [key: string]: any }): Model;

  static findBy(key: string, value: any): Model | null;

  static find(id: number): Model | null;

  static where(key: string, value: any): Model[];

  static delete(id: number): Model | null;

  static update(id: number, obj: { [key: string]: any }): Model | null;

  static last(): Model | null;

  static first(): Model | null;

  static filter(callback: (model: Model) => boolean): Model[];

  static clear(): Model[];

  static sanitize(obj: { [key: string]: any }): { [key: string]: any };

  static hasOne(model: typeof Model): Relation;

  static hasMany(model: typeof Model): Relation;

  static belongsTo(model: typeof Model): Relation;

  static belongsToMany(model: typeof Model): Relation;
}
