# Chat with NodeJS

This is an Chat service that provides authorization functionality and includes api's folders for users, groups and messaging in groups.

It uses MongoDB as the database

### Postman documentation

https://documenter.getpostman.com/view/5153977/2sA3rwMEZ6#5bd08856-b6de-45f4-b214-32a68f0f35f3

### Project Structure

- `index.js`: The main entry point of the application.
- `config.js`: Contains configuration files for the application.
- `authorization`
  - `controllers`: Controller files for authentication endpoints.
  - `schemas`: JSON Schemas against which the body of various routes will be validated.
  - `routes.js`: Registers all the authentication routes.
- `groups`
  - `controllers`: Controller files for group master CRUD endpoints.
  - `schemas`: JSON Schemas against which the body of various routes will be validated.
  - `routes.js`: Registers all the product CRUD routes.
- `users`
  - `controllers`: Controller files for user master CRUD endpoints.
  - `schemas`: JSON Schemas against which the body of various routes will be validated.
  - `routes.js`: Registers all the user CRUD routes.
- `common`
  - `middlewares`: Various middlewares that can be used in various routes like (isAuthenticated, CheckPermissions etc.)
  - `models`: MongoDB models for the Group and User
- `dbconnector`: MongoDB storage, that stores all the data.

### Prerequisites

Before running the application, make sure you have the following installed:

1. NodeJS
2. NPM

### Installation

1. Clone the repository: `git clone https://github.com/harinathpamu/chat`
2. Navigate to the project directory: `cd chat`
3. Install the dependencies: `npm install`

### Usage

To start the service, run the following command:

```shell
npm run start
```

To run tests, run the following commands:

start server first

```shell
npm run start
```

then

```shell
npm run test
```
