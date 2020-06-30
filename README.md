# simform-crud-backend

## Installation steps

1. Install nodejs module dependencies

```
npm install
```

## ENV

Create the .env file in the root directory of microservice on your machine. Copy and paste the following environment variables.

```
PORT=3000
PRIVATE_KEY='Simform private key'
MAX_RECORDS = 5

# LOG
SHOW_LOG = true
NODE_ENV = development
```

## How to run application
1. Write down steps here

## How to create database migrations

A Migration in Sequelize is javascript file which exports two functions, `up` and `down`, that dictate how to perform the migration and undo it. Migration is the file where defines the databse schema. Following steps to generate the migrations.

Here, we generates only migrations and seeders (in case of sample or static data of an application). We do not create any model.

1.  Install sequelize-cli globally

```
npm i sequelize-cli -g
```

2.  Below are the few helpful sequelize commands

    - Create migration

    ```
    sequelize-cli migration:generate --name [table_name]
    ```

    - Run pending migrations (It will run all the remaining migration, which tables yet not generates in databse).

    ```
    sequelize-cli db:migrate
    ```

    - List the status of all migrations

    ```
    sequelize-cli db:migrate:status
    ```

    - Generate seeder (to insert static / default records or data)

    ```
    sequelize-cli seed:generate --name [seed_name]
    ```

    - Run specific seeder

    ```
    sequelize-cli db:seed --seed [seed_name]
    ```

    - Run all seeder

    ```
    sequelize-cli db:seed:all
    ```

    - Undo the specific seed

    ```
    sequelize-cli db:seed:undo --seed [seed_name]
    ```

    - Revert all migrations

    ```
    sequelize-cli db:migrate:undo:all
    ```

    - Undo the most recent seed

    ```
    sequelize-cli db:seed:undo
    ```

Following links helps to learn more about sequelize

- [https://sequelize.org/master/manual/migrations.html](https://sequelize.org/master/manual/migrations.html)
