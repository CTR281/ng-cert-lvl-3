# NgWeather

An app that showcases how to build a simple app with Angular (running on 17.x)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli).

# STEP \#2 REMARKS

The problem statement mentions: `The parent component doesn’t have to know how to remove a tab or how to
select a tab`.

Please note that I have added an optional feature that allows the app to remember which tab is active even after navigating to the forecast page and back.

This feature is optional and the tabs do not need the parent to manually track the active tab. To make sure of it, you can remove the `select` output and `active` input bindings in `current-conditions.component.html`.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

