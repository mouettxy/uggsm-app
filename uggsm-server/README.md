# Start Application

**Install dependencies using npm :**

`npm install`

**Create .env file in `src` with following variables :**

-   `MONGO_USER`
-   `MONGO_PASSWORD`
-   `DB_CONNECTION_STRING`
-   `DB_SERVER`
-   `PORT`
-   `JWT_SECRET`

**_Example :_**

Mongodb connection URI:

`mongodb://<mongodb_password>:<password>@mongodb0.example.com:27017/admin`

    MONGO_USER=<database_password>
    MONGO_PASSWORD=<database_password>
    DB_CONNECTION_STRING=mongodb://
    DB_SERVER=@mongodb0.example.com:27017/admin
    PORT=<desired_port>
    JWT=<desired_jwt_secret>

### Available scripts in `package.json`

#### _Start server using nodemon as filewatcher on .ts files (with node command)_

`npm run dev`

#### _Start server without filewatcher (with node command)_

`npm run dev:start`

#### _Build application_

`npm run build`

#### _Clean application_

`npm run clean`

#### _Execute linter on application_

`npm run lint`

#### _Compile application_

`npm run tsc`

#### _Start server using nodemon as filewatcher on .ts files (with ts-node command)_

`npm run dev:typescript`
