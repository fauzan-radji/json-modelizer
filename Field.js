export default class Field {
  #type;
  #isRequired;
  #default;

  constructor(type) {
    this.#type = type;
    this.#isRequired = false;
  }

  Required() {
    this.#isRequired = true;

    return this;
  }

  Default(value) {
    if (typeof value === "function") {
      this.validateAndSanitize(value());
      this.#default = value;
    } else {
      this.#default = this.validateAndSanitize(value);
    }

    return this;
  }

  validateAndSanitize(value) {
    const shouldCheckDefaultValue = this.isRequired && value === undefined;
    if (shouldCheckDefaultValue) {
      const doesntHaveDefaultValue = this.default === undefined;
      if (doesntHaveDefaultValue) throw new Error("This field is required");

      value =
        typeof this.default === "function" ? this.default() : this.default;
    }

    const isUndefinedOrNull = value === undefined || value === null;
    if (isUndefinedOrNull) {
      return value;
    }

    switch (this.type) {
      case Field.#NUMBER:
        if (typeof value !== "number" && isNaN(+value))
          throw new Error(`This field must be a number (got ${typeof value})`);
        return +value;

      case Field.#STRING:
        if (`${value}`.length > 255) throw new Error("This field is too long");
        return `${value}`;

      case Field.#TEXT:
        return `${value}`;

      case Field.#BOOLEAN:
        return !!value;

      case Field.#DATE:
        if (isNaN(new Date(value).getTime()))
          throw new Error("This field must be a valid date");
        return new Date(value);

      default:
        throw new Error(`Unknown field type: ${this.type}`);
    }
  }

  get type() {
    return this.#type;
  }

  get isRequired() {
    return this.#isRequired;
  }

  get default() {
    return this.#default;
  }

  static Number() {
    return new Field(Field.#NUMBER);
  }

  static String() {
    return new Field(Field.#STRING);
  }

  static Text() {
    return new Field(Field.#TEXT);
  }

  static Boolean() {
    return new Field(Field.#BOOLEAN);
  }

  static Date() {
    return new Field(Field.#DATE);
  }

  static #NUMBER = "NUMBER";
  static #STRING = "STRING";
  static #TEXT = "TEXT";
  static #BOOLEAN = "BOOLEAN";
  static #DATE = "DATE";
}
