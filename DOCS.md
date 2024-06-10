# Documentation

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Model](#model)
    - [Model Definition](#model-definition)
    - [Methods](#methods)
    - [Instance](#instance)
      - [Methods](#methods-1)
      - [Properties](#properties)
  - [Fields](#fields)
    - [Methods](#methods-2)
  - [Relationships](#relationships)
    - [Definition](#definition)
    - [Methods](#methods-3)
    - [One to One](#one-to-one)
    - [One to Many](#one-to-many)
    - [Many to Many](#many-to-many)

## Installation

```bash
npm install json-modelizer
```

## Configuration

Add these variables to your `.env` file:

```env
JSON_MODELIZER_DATAPATH=./data
JSON_MODELIZER_PRETTYFY=false
JSON_MODELIZER_INDENT=2
```

- **DATAPATH**: is the path to the directory where your JSON data files will be stored. The default value is `./data`.
- **PRETTIFY**: is a boolean value that determines whether the JSON data files should be prettyfied or not. The default value is `false`.
- **INDENT**: is the number of spaces to use for indentation when prettyfying the JSON data files. The default value is `2`. Only applicable if `prettyfy` is set to `true`.

## Usage

### Model

The `Model` class is the main class of the ORM (Object-Relational Mapping) library, providing various static methods to interact with JSON data. It represents a model for a specific type of JSON data, allowing you to define attributes and relationships for the data.

#### Model Definition

```javascript
import { Field, Model } from "json-modelizer";

class User extends Model {
  static _table = "users";
  static schema = {
    name: Field.String,
    age: Field.Number.Nullable,
  };
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

3. `Model.paginate(page, limit) => Model[]`:

   - Description: Paginate all records of the model.
   - Parameters:
     - `page` (number): the page number
     - `limit` (number): how much data per page
     - `filterFunction` (Function): a function that takes a Model instance as an argument and returns `true` to include the record in the result or `false` to exclude it.
   - Returns: An array of Model instances where `0 <= length <= limit`

   ```javascript
   const page = 2;
   const limit = 5;
   const users = User.paginate(page, limit, (user) =>
     user.name.includes("Doe")
   );
   console.log(users);
   /*
   [
    { name: "John Doe", email: "john@doe"},
    ...,
    {name: "Jane Doe", email: "jane@doe"},
   ]
   */
   ```

4. `Model.find(id) => Model`:

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

5. `Model.findBy(key, value) => Model`:

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

6. `Model.where(key, value) => Model[]`:

   - Description: Find all records of the model that match the given key-value pair from the JSON data.
   - Parameters:
     - `key` (string): The attribute key to search for.
     - `value` (any): The value to match for the given attribute key.
   - Returns: An array of Model instances representing the found records.

   ```javascript
   const users = User.where("email", "john@doe.com");
   console.log(users); // [{ name: "John Doe", email: "john@doe"}]
   ```

7. `Model.delete(id) => Model`:

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

8. `Model.update(id, obj) => Model`:

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

9. `Model.first() => Model`:

   - Description: Retrieve the first record of the model from the JSON data.
   - Returns: A Model instance representing the first record, or `null` if no records exist.

   ```javascript
   const firstUser = User.first();
   console.log(firstUser.name); // John Doe
   console.log(firstUser.email); // john@doe
   console.log(firstUser.id); // 1
   ```

10. `Model.last() => Model`:

    - Description: Retrieve the last record of the model from the JSON data.
    - Returns: A Model instance representing the last record, or `null` if no records exist.

    ```javascript
    const lastUser = User.last();
    console.log(lastUser.name); // John Doe
    console.log(lastUser.email); // john@doe
    console.log(lastUser.id); // 1
    ```

11. `Model.filter(callback) => Model[]`:

    - Description: Filter records of the model based on a provided callback function from the JSON data.
    - Parameters:
      - `callback` (Function): A function that takes a Model instance as an argument and returns `true` to include the record in the result or `false` to exclude it.
    - Returns: An array of Model instances representing the filtered records.

    ```javascript
    const users = User.filter((user) => user.name.includes("Doe"));
    console.log(users); // [{ name: "John Doe", email: "john@doe"}]
    ```

12. `Model.clear() => Model[]`:

    - Description: Delete all records of the model from the JSON data.
    - Returns: An array of Model instances representing the deleted records.

    ```javascript
    const deletedUsers = User.clear();
    console.log(deletedUsers); // [{ name: "John Doe", email: "john@doe"}]
    ```

#### Instance

A model instance represents a single record of the model. It provides various methods to interact with the record.

##### Methods

1. `Model#update(obj) => Model`:

   - Description: Update the record with the provided data in the JSON data.
   - Parameters:
     - `obj` (Object): An object representing the data to update for the record.
   - Returns: A Model instance representing the updated record.

   ```javascript
   const user = User.find(1);
   const updatedUser = user.update({ name: "Jane Doe" });
   console.log(updatedUser.name); // Jane Doe
   console.log(updatedUser.email); // john@doe
   console.log(updatedUser.id); // 1
   ```

2. `Model#delete() => Model`:

   - Description: Delete the record from the JSON data.
   - Returns: A Model instance representing the deleted record.

   ```javascript
   const user = User.find(1);
   const deletedUser = user.delete();
   console.log(deletedUser.name); // John Doe
   console.log(deletedUser.email); // john@doe
   console.log(deletedUser.id); // 1
   ```

##### Properties

1. `Model#id` (getter => number): The ID of the record.

   ```javascript
   const user = User.find(1);
   console.log(user.id); // 1
   ```

2. `Model#table` (getter => string): The table name of the model.

   ```javascript
   const user = User.find(1);
   console.log(user.table); // users
   ```

3. `Model#createdAt` (getter => Date): The date the record was created.

   ```javascript
   const user = User.find(1);
   console.log(user.createdAt); // 2021-01-01T00:00:00.000Z
   ```

4. `Model#updatedAt` (getter => Date): The date the record was last updated.

   ```javascript
   const user = User.find(1);
   console.log(user.updatedAt); // 2021-01-01T00:00:00.000Z
   ```

### Fields

The `Field` class provides various methods to define attributes for a model. The following types of attributes are supported:

- Number
- String
- Text
- Boolean
- Date

```javascript
import { Field, Model } from "json-modelizer";

class User extends Model {
  static _table = "users";
  static schema = {
    name: Field.String,
    age: Field.Number.Nullable,
  };
}
```

The `Field` class provides the following methods to define attributes:

1. `Field.Number => Field`:

   - Description: Define a number attribute.
   - Returns: A Field instance representing the number attribute.

   ```javascript
   import { Field, Model } from "json-modelizer";

   class User extends Model {
     static _table = "users";
     static schema = {
       age: Field.Number.Nullable,
     };
   }
   ```

2. `Field.String => Field`:

   - Description: Define a string attribute.
   - Returns: A Field instance representing the string attribute.

   ```javascript
   import { Field, Model } from "json-modelizer";

   class User extends Model {
     static _table = "users";
     static schema = {
       name: Field.String,
     };
   }
   ```

3. `Field.Text => Field`:

   - Description: Define a text attribute.
   - Returns: A Field instance representing the text attribute.

   ```javascript
   import { Field, Model } from "json-modelizer";

   class User extends Model {
     static _table = "users";
     static schema = {
       bio: Field.Text,
     };
   }
   ```

4. `Field.Boolean => Field`:

   - Description: Define a boolean attribute.
   - Returns: A Field instance representing the boolean attribute.

   ```javascript
   import { Field, Model } from "json-modelizer";

   class User extends Model {
     static _table = "users";
     static schema = {
       isVerified: Field.Boolean,
     };
   }
   ```

5. `Field.Date => Field`:

   - Description: Define a date attribute.
   - Returns: A Field instance representing the date attribute.

   ```javascript
   import { Field, Model } from "json-modelizer";

   class User extends Model {
     static _table = "users";
     static schema = {
       birthday: Field.Date,
     };
   }
   ```

Each of the above methods returns a `Field` instance, which can be used to define additional properties for the attribute (see [Fields > Methods](#methods)).

#### Methods

The field object is an instance of the `Field` class, which provides various methods to define the attribute.

1. `Field#Nullable => Field`:

   - Description: Define the attribute as nullable. By default all attributes are required unless the `Nullable` method is called.
   - Returns: The Field instance.

   ```javascript
   import { Field, Model } from "json-modelizer";

   class User extends Model {
     static _table = "users";
     static schema = {
       name: Field.String.Nullable,
     };
   }
   ```

2. `Field#Default(value) => Field`:

   - Description: Define the default value for the attribute.
   - Parameters:
     - `value` (any): The default value for the attribute. This can be a value or a function that returns a value. Make sure the value or the return value of the function matches the type of the attribute.
   - Returns: The Field instance.

   ```javascript
   import { Field, Model } from "json-modelizer";

   class User extends Model {
     static _table = "users";
     static schema = {
       age: Field.Number.Default(18),
     };
   }
   ```

### Relationships

The `Model` class provides various methods to define relationships between models. The following types of relationships are supported:

- One-to-One
- One-to-Many
- Many-to-Many

#### Definition

Relationships are defined on the model class using one of the `hasOne`, `hasMany`, `belongsTo`, `belongsToMany` methods. For example, to define a `hasOne` relationship between a `User` model and a `Contact` model:

```javascript
import { Field, Model } from "json-modelizer";

class User extends Model {
  static _table = "users";
  static schema = {
    name: Field.String,
    age: Field.Number.Nullable,
  };
}

class Contact extends Model {
  static _table = "contacts";
  static schema = {
    phone: Field.String,
    email: Field.String,
  };
}

User.hasOne(Contact);
Contact.belongsTo(User);
```

The `hasOne`, `hasMany`, `belongsTo`, and `belongsToMany` methods takes only one parameter, which is the related model class. Each of these methods returns a `Relationship` instance, which can be used to define additional properties for the relationship (see [Relationships > Methods](#methods-2)). The `hasOne` and `hasMany` methods are used to define the relationship from the model that owns the foreign key, while the `belongsTo` and `belongsToMany` methods are used to define the relationship from the model that contains the foreign key.

#### Methods

The relation object is an instance of the `Relation` class, which provides various methods to define the relationship.

1. `Relation#as(name) => Relation`:

   - Description: Define the name of the relationship. If not defined, the name of the relationship will be the name of the related model's table. For belongs-to relationships, the name of the relationship will be the name of the related model's table with the suffix `Id`, this can be overridden by the `foreignKey` method.
   - Parameters:
     - `name` (string): The name of the relationship.
   - Returns: The Relation instance.

   ```javascript
   console.log(Contact._table); // contacts

   User.hasOne(Contact);
   // The name of the relationship will be "contacts"

   User.hasOne(Contact).as("contact");
   // The name of the relationship will be "contact"
   ```

2. `Relation#foreignKey(key) => Relation`:

   - Description: Define the foreign key of the relationship. If not defined, the foreign key of the relationship will be the name of the related model's table with the suffix `Id`. If the `as` method is used after the `foreignKey` method and the type of the relationship is `belongsTo`, the name of the relationship will be overridden by the name provided to the `as` method. Please make sure to call the `foreignKey` method after the `as` method.
   - Parameters:
     - `key` (string): The foreign key of the relationship.
   - Returns: The Relation instance.

   ```javascript
   console.log(Contact._table); // contacts

   User.hasOne(Contact);
   // The foreign key of the relationship will be "contactsId"

   User.hasOne(Contact).foreignKey("contactId");
   // The foreign key of the relationship will be "contactId"

   console.log(User._table); // users
   Contact.belongsTo(User);
   // The foreign key of the relationship will be "usersId"

   Contact.belongsTo(User).as("user");
   // The foreign key of the relationship will be "userId"

   Contact.belongsTo(User).foreignKey("userId");
   // The foreign key of the relationship will be "userId"

   Contact.belongsTo(User).foreignKey("userId").as("owner");
   // The foreign key of the relationship will be "ownerId"

   Contact.belongsTo(User).as("owner").foreignKey("userId");
   // The foreign key of the relationship will be "userId"
   ```

#### One to One

A One-to-One relationship is defined on the model class as follows:

```javascript
import { Model, Field } from "json-modelizer";

class User extends Model {
  static _table = "users";
  static schema = {
    name: Field.String,
    age: Field.Number.Nullable,
  };
}

class Contact extends Model {
  static _table = "contacts";
  static schema = {
    phone: Field.String,
    email: Field.String,
  };
}

User.hasOne(Contact);
Contact.belongsTo(User);
```

#### One to Many

A One-to-Many relationship is defined on the model class as follows:

```javascript
import { Model, Field } from "json-modelizer";

class User extends Model {
  static _table = "users";
  static schema = {
    name: Field.String,
    age: Field.Number.Nullable,
  };
}

class Post extends Model {
  static _table = "posts";
  static schema = {
    title: Field.String,
    content: Field.String,
  };
}

User.hasMany(Post);
Post.belongsTo(User);
```

#### Many to Many

A Many-to-Many relationship is defined on the model class as follows:

```javascript
import { Model, Field } from "json-modelizer";

class User extends Model {
  static _table = "users";
  static schema = {
    name: Field.String,
    age: Field.Number.Nullable,
  };
}

class Role extends Model {
  static _table = "roles";
  static schema = {
    name: Field.String,
  };
}

User.hasMany(Role);
Role.belongsToMany(User);
```
