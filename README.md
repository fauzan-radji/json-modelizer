# JSON-Modelizer

JSON-Modelizer is a lightweight and intuitive Object-Relational Mapping (ORM) package designed to work with JSON files as a data storage solution. It simplifies the process of creating, managing, and querying structured data models from JSON files, providing a seamless integration between your Node.js application and JSON-based data storage.

## Key Features

- **JSON Data Mapping**: Define data models using JavaScript classes, and effortlessly map them to JSON files for data storage.

- **CRUD Operations**: Perform Create, Read, Update, and Delete operations on JSON data models using simple and expressive methods.

- **Relationship Handling**: Easily handle relationships between JSON data models, including one-to-one, one-to-many, and many-to-many relationships.

## Installation

To install "json-modelizer," simply run the following command:

```
npm install json-modelizer
```

## Usage

For detailed usage instructions and API documentation, please refer to the [documentation](DOCS.md).

## Examples

Here's a quick example of how to use "json-modelizer" to create and query a JSON data model:

```javascript
const { Model, Field } = require("json-modelizer");

class User extends Model {
  static schema = {
    username: Field.String().isRequired(),
    email: Field.String().isRequired(),
    age: Field.Number(),
  };
}

// Create a new user
const newUser = User.create({
  username: "john_doe",
  email: "john@example.com",
  age: 30,
});

// Find all users aged 30 or above
const usersAbove30 = User.where({ age: { $gte: 30 } });
```

## Contributions

We welcome contributions from the community! If you encounter any issues, have suggestions for improvements, or want to contribute new features, feel free to submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
