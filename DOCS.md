# Documentation

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Model](#model)
    - [Definition](#definition)
    - [Methods](#methods)
    - [Instance](#instance)
    - [Relationships](#relationships)
      - [Has One](#has-one)
      - [Has Many](#has-many)
      - [Belongs To](#belongs-to)

## Installation

```bash
npm install json-modelizer
```

## Usage

### Model

The `Model` class is the main class of the ORM (Object-Relational Mapping) library, providing various static methods to interact with JSON data. It represents a model for a specific type of JSON data, allowing you to define attributes and relationships for the data.

#### Model Definition

```javascript
import { Model } from "json-modelizer";

class User extends Model {
  static _table = "users";
  static _fields = ["name", "email"];
}
```

#### Methods

1. `Model.create(obj) => Model`:

   - Description: Create a new record for the model in the JSON data.
   - Parameters:
     - `obj` (Object): An object representing the data for the new record.
   - Returns: A Model instance representing the newly created record.

   ```javascript
   const user = User.create({ name: "John Doe", email: "john@doe.com" });
   console.log(user.name); // John Doe
   console.log(user.email); // john@doe
   console.log(user.id); // 1
   ```

2. `Model.all() => Model[]`:

   - Description: Retrieve all records of the model from the JSON data.
   - Returns: An array of Model instances, representing all records of the model.

   ```javascript
   const users = User.all();
   console.log(users); // [{ name: "John Doe", email: "john@doe"}]
   ```

3. `Model.find(id) => Model`:

   - Description: Find a record of the model by its ID from the JSON data.
   - Parameters:
     - `id` (string): The ID of the record to find.
   - Returns: A Model instance representing the found record, or `null` if not found.

   ```javascript
   const user = User.find(1);
   console.log(user.name); // John Doe
   console.log(user.email); // john@doe
   console.log(user.id); // 1
   ```

4. `Model.findBy(key, value) => Model`:

   - Description: Find the first record of the model that matches the given key-value pair from the JSON data.
   - Parameters:
     - `key` (string): The attribute key to search for.
     - `value` (any): The value to match for the given attribute key.
   - Returns: A Model instance representing the found record, or `null` if not found.

   ```javascript
   const user = User.findBy("email", "john@doe.com");
   console.log(user.name); // John Doe
   console.log(user.email); // john@doe
   console.log(user.id); // 1
   ```

5. `Model.where(key, value) => Model[]`:

   - Description: Find all records of the model that match the given key-value pair from the JSON data.
   - Parameters:
     - `key` (string): The attribute key to search for.
     - `value` (any): The value to match for the given attribute key.
   - Returns: An array of Model instances representing the found records.

   ```javascript
   const users = User.where("email", "john@doe.com");
   console.log(users); // [{ name: "John Doe", email: "john@doe"}]
   ```

6. `Model.delete(id) => Model`:

   - Description: Delete a record of the model by its ID from the JSON data.
   - Parameters:
     - `id` (string): The ID of the record to delete.
   - Returns: A Model instance representing the deleted record, or `null` if not found.

   ```javascript
   const deletedUser = User.delete(1);
   console.log(deletedUser.name); // John Doe
   console.log(deletedUser.email); // john@doe
   console.log(deletedUser.id); // 1
   ```

7. `Model.update(id, obj) => Model`:

   - Description: Update a record of the model by its ID with the provided data in the JSON data.
   - Parameters:
     - `id` (string): The ID of the record to update.
     - `obj` (Object): An object representing the data to update for the record.
   - Returns: A Model instance representing the updated record, or `null` if not found.

   ```javascript
   const updatedUser = User.update(1, { name: "Jane Doe" });
   console.log(updatedUser.name); // Jane Doe
   console.log(updatedUser.email); // john@doe
   console.log(updatedUser.id); // 1
   ```

8. `Model.first() => Model`:

   - Description: Retrieve the first record of the model from the JSON data.
   - Returns: A Model instance representing the first record, or `null` if no records exist.

   ```javascript
   const firstUser = User.first();
   console.log(firstUser.name); // John Doe
   console.log(firstUser.email); // john@doe
   console.log(firstUser.id); // 1
   ```

9. `Model.last() => Model`:

   - Description: Retrieve the last record of the model from the JSON data.
   - Returns: A Model instance representing the last record, or `null` if no records exist.

   ```javascript
   const lastUser = User.last();
   console.log(lastUser.name); // John Doe
   console.log(lastUser.email); // john@doe
   console.log(lastUser.id); // 1
   ```

10. `Model.filter(callback) => Model[]`:

    - Description: Filter records of the model based on a provided callback function from the JSON data.
    - Parameters:
      - `callback` (Function): A function that takes a Model instance as an argument and returns `true` to include the record in the result or `false` to exclude it.
    - Returns: An array of Model instances representing the filtered records.

    ```javascript
    const users = User.filter((user) => user.name.includes("Doe"));
    console.log(users); // [{ name: "John Doe", email: "john@doe"}]
    ```

11. `Model.clear() => Model[]`:

    - Description: Delete all records of the model from the JSON data.
    - Returns: An array of Model instances representing the deleted records.

    ```javascript
    const deletedUsers = User.clear();
    console.log(deletedUsers); // [{ name: "John Doe", email: "john@doe"}]
    ```

#### Instance

<!-- TODO -->

#### Relationships

Relations can be defined on a model definition via the `_relations` static property. The `_relations` property is an array of `Relation` objects, which can be imported from the `json-modelizer` package.

```javascript
import { Model, Relation } from "json-modelizer";

class Post extends Model {
  static _table = "posts";
  static _fields = ["title", "body"];
}

class User extends Model {
  static _table = "users";
  static _fields = ["name", "email"];
  static _relations = [new Relation(this, Relation.HAS_MANY, Post)];
}
```

The `Relation` constructor takes 4 arguments:

1. `model` (Model): The model class that the relation is defined on.
2. `type` (string): The type of relation. Can be one of `Relation.HAS_MANY` or `Relation.HAS_ONE`.
3. `relatedModel` (Model): The model class that the relation is defined on.

Note that `Post` model does not have any relations defined on it. This is because the relation is defined on the `User` model as a `hasMany` relation to `Post` and automatically creates a `belongsTo` relation on the `Post` model to `User`.

The field name for the relation is automatically generated by the model table name + `id`. In this case, the field name is `users_id`. To access the `User` model from the `Post` model, the `users` field is used instead of `user` because the table name of the `User` model is `users` and vice versa.

##### Has One

A `hasOne` relation is defined on the model class as follows:

```javascript
import { Model, Relation } from "json-modelizer";

class Post extends Model {
  static _table = "posts";
  static _fields = ["title", "body"];
}

class User extends Model {
  static _table = "users";
  static _fields = ["name", "email"];
  static _relations = [new Relation(this, Relation.HAS_ONE, Post)];
}

const user = User.first();
console.log(user.posts); // { title: "My First Post", body: "..." }

const post = Post.first();
console.log(post.users); // { name: "John Doe", email: "john@doe" }
```

The `Post` model will automatically have a `belongsTo` relation to `User` defined on it.

##### Has Many

A `hasMany` relation is defined on the model class as follows:

```javascript
import { Model, Relation } from "json-modelizer";

class Post extends Model {
  static _table = "posts";
  static _fields = ["title", "body"];
}

class User extends Model {
  static _relations = [new Relation(this, Relation.HAS_MANY, Post)];
}
```

The `Post` model will automatically have a `belongsTo` relation to `User` defined on it.

##### Belongs To

A `belongsTo` relation is automatically created when a `hasOne` or `hasMany` relation is defined on a model class.

##### Belongs To Many

<!-- TODO -->

##### Has Many Through

<!-- TODO -->
