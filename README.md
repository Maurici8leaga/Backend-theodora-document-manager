# Theodora Document Manager Server

This is the server of theodora-document-manager app which will complemented the whole app. Theodora-document-manager is a page in which it consists of managing documents, where the user can; create, update, delete and view PDF, TXT or Word documents.

## Get Started

The first thing to do is open the terminal of your code editor of your choice and once there you will have to run following comand:

```sh
   yarn install
```

This command will installs the necessary packages to run the app, after that you can run the next one which is;

```sh
   yarn run dev
```

Which will run on the 5001 port of your browser.

## Available Scripts

In the project directory, you can run:

### `yarn run dev`

In this folder is our Backend, once we enter and execute the following command it will only run the code on the side of the BackEnd. To get started in the user interface section, you will need to type the following command;

```sh
   yarn run dev
```

### `yarn run lint:check`

This command will review all files with a ".ts" extension in the project and provide you with information about any errors, style issues, or problematic patterns it finds in the TypeScript code.

### `yarn run lint:fix`

This command will walk through all the files in the project and apply automatic fixes to styling issues and lint errors that it can fix based on configured rules. This helps keep your code consistent and free of styling issues, saving you time by not having to manually fix every issue detected by ESLint.

### `yarn run prettier:check`

This command will run Prettier will check the format of the TypeScript files in the "src" folder and its subfolders. If it finds any file that does not meet the set format rules, it will display an error message on the console.

### `yarn run prettier:fix`

This command will automatically format the TypeScript files in the "src" folder and its subfolders, applying the established formatting rules. Prettier will make changes directly to existing files to ensure they conform to the correct format. This allows you to maintain a uniform and consistent code style in your project without having to manually make formatting changes.

### `yarn run build`

The TypeScript compiler "ttsc" will compile the TypeScript files to JavaScript based on the settings set in the "tsconfig.json" file. This will allow you to generate a compiled, production-ready version of your project in JavaScript, which can be executed in production environments.

## ABOUT

This project was built with; bunyan,compression, cors, dotenv, express, express-async-errors, helmet, hpp, http-status-code, joi, moment, mongoose, typescript, multer, cloudinary.

Additionally, it should be noted that for the structure of this project was implemented Onion architecture with design patterns and SOLID principles. Which are;

| Design patterns          |              SOLID principles              |
| :----------------------- | :----------------------------------------: |
| Chains of responsability | Interface SegregationInterface Segregation |
| Doble token security     |             Liskov Sustitution             |
| Prototype                |                Open / close                |
| Mediator                 |           Single responsability            |
| Singleton                |                                            |
| Facade                   |                                            |
