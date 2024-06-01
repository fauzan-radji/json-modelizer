import Relation from "./Relation.js";

export default class Model {
  static _table: string;
  static _relations: Relation[];
  static schema: { [key: string]: any };

  #table: string;

  delete(): Model | null;

  update(obj: { [key: string]: any }): Model;

  #refresh(): Model;

  get table(): string;

  get JSON(): string;

  static get table(): string;

  static _save<M extends Model>(this: new () => M, models: M[]): void;

  static count(): number;

  static all<M extends Model>(this: new () => M): M[];

  static paginate<M extends Model>(this: new () => M, page: number, limit: number, filterFunction: (model: M) => boolean): M[];

  static create<M extends Model>(this: new () => M, obj: M): M;

  static findBy<M extends Model>(this: new () => M, key: string, value: any): M | null;

  static find<M extends Model>(this: new () => M, id: number): M | null;

  static where<M extends Model>(this: new () => M, key: string, value: any): M[];

  static delete<M extends Model>(this: new () => M, id: number): M | null;

  static update<M extends Model, O extends Partial<M>>(this: new () => M, id: number, obj: O): M | null;

  static last<M extends Model>(this: new () => M): M | null;

  static first<M extends Model>(this: new () => M): M | null;

  static filter<M extends Model>(this: new () => M, callback: (model: M) => boolean): M[];

  static clear<M extends Model>(this: new () => M): M[];

  static sanitize(obj: { [key: string]: any }): { [key: string]: any };

  static hasOne(model: typeof Model): Relation;

  static hasMany(model: typeof Model): Relation;

  static belongsTo(model: typeof Model): Relation;

  static belongsToMany(model: typeof Model): Relation;
}
