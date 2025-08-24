# DemoProject

Simple grid/form application that let's the user visualize and create new Users. Some of the included features are:
- Angular material templates
- Faking latency using observables and delay (between 1500 and 2000 ms)
- Sync (match-passwords-validator) and async (username-exists-validator) validators in the create-user form
- Unit testing for all components, service and validators
- i18n localization (english - spanish)
- Documentation in Compodoc

## Development server

To start a local development server, run:

```bash
ng serve
```

Or, for a spanish version of the app, run:
```bash
ng serve --configuration=es
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.


## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Documentation

To generate and view documentation (Compodoc) run the following commands:

```bash
npx compodoc -p tsconfig.json -d documentation
```
```bash
npx compodoc -s -d documentation
```

Once the server is running, open your browser and navigate to `http://localhost:8080/`.
