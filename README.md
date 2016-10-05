# Slot machine app built with ES6 only

Prerequisites:

 * NodeJS 6.7.0 +
 * Webpack installed globally

To start execute:

* ```npm install ```

To run the application do the following:


* ```npm run dev ```

Then open your browser in http://localhost:8000


To run the tests do the following:

* ```npm run tests ```

Then open the browser in http://localhost:8999/tests to see them

Note: The lasts tests have warnings concerning time of execution, but this is normal since all of them test a function that has a setTimeout of 500ms.

The entry file is /app/app.js. All DOM operations are found there.

As for the test coverage. Only tests were written for the SlotMachine class.

The app has been tested in Chrome (Linux), Firefox (Linux) and Chrome (Android).
