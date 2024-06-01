export default class Field {
  #type: string;
  #isNullable: boolean;
  #default: any;

  constructor(type: string);

  get Nullable(): this;

  Default(value: string | (() => any)): this;

  validateAndSanitize(value: any): any;

  static get Number(): Field;
  static get String(): Field;
  static get Text(): Field;
  static get Boolean(): Field;
  static get Date(): Field;

  static #NUMBER: string;
  static #STRING: string;
  static #TEXT: string;
  static #BOOLEAN: string;
  static #DATE: string;
}
