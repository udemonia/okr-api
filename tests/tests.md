# TESTS

> Dependencies:
> Jest
> Jest Runner
> Node Mock http
> JEST Runner VS Code Ext.

We're using JEST <https://jestjs.io/>

Testing was implemented after the api was built but we've reworked the code base to add TDD best practices

## Basics - check that controller routes are functions

Within our controller.js file, we want to ensure that our exports are functions... to do this we bring in the file w/ require, describe it, the second argument in describe is a callback - w/ in the callback, we pass - it('text version of our code check', callback) - within the callback as the second argument of IT - we write out our expect clause

``` js

describe('objectiveController.getObjectives', () => {
    it('Should be a get function', () => {
        expect(typeof objectiveController.getObjectives).toBe('function')
    })
})

```

## SPY

> Override Mongoose create method to test that our controller fires off the .create() method when called...

❗**we're spying on .create( ) but not actually calling it**

``` js
//* Bring in the objective model -> 
const ObjectiveModel = require('../../Models/Objectives')

//* over ride the original create mongoose create method with jest.fn()
//* This allows us to spy on the method
ObjectiveModel.create = jest.fn()
```

``` js
describe('objectiveController.postObjective', () => {
    
    // it should be of type function
    it('Should have a post function', () => {
        expect(typeof objectiveController.postObjective).toBe('function')
    })
    
    // calling the create mongoose method should fire
    it('Should call ObjectiveModel.create', () => {
        ObjectiveModel.create();
        expect(ObjectiveModel.create).toBeCalled();
    })

})

```

> Example output

``` md

 PASS  tests/unit/objective.controller.test.js
  objectiveController.deleteObjective
    ✓ Should have a delete function
  objectiveController.getObjectives
    ✓ Should be a get function
  objectiveController.postObjective
    ✓ Should have a post function
    ✓ Should call ObjectiveModel.create
  objectiveController.getSingleObjective
    ✓ Should have a get function
  objectiveController.updateObjective
    ✓ Should have a put function (1 ms)

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        0.51 s, estimated 1 s
Ran all test suites.

```

for more on spy and mock - jest.fn() see the docs <https://jestjs.io/docs/mock-functions>

## Using JEST w/ Mongoose

Create a jest.config.js file in your root folder.

Within the file, add the below code

``` js
module.exports = {
  testEnvironment: 'node'
};
```

For more, read the docs here <https://mongoosejs.com/docs/jest.html>

## Updating the Mongoose Create method with mock requests

lets bring in a new library that will help us in making mock http requests

``` bash

🔥 $npm install node-mocks-http --save

```

Lets update our post test to use node mock http

> in the it() callback, we're now bringing in node mock http, create .createRequest and .createResponse while keeping next as null, we pass these as arguments to our create i/o network call

``` js
describe('objectiveController.postObjective', () => {

    it('Should have a post function', () => {

                            //! function should exist ? 
        expect(typeof objectiveController.postObjective).toBe('function')
    })
                         //! function should exist ?
    it('Should call ObjectiveModel.create', () => {
        
        let req, res, next;
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = null
        ObjectiveModel.create(req, res, next);

        expect(ObjectiveModel.create).toBeCalled();
    })
})
```

## Supertest - Unit Testing

> download here <https://www.npmjs.com/package/supertest>

We can use Supertest to do integration tests across our whole Node JS Application

``` js
const request = require('supertest')
const app = require('../../server') // import our app
const mockObjective = require('../mock/objectiveMockData.json')

const endpoint = '/api/v1/objectives'

describe(endpoint, () => {
    it('POST' + endpoint, async () => {
        const response = await request(app)
            .post(endpoint);
            .send(mockObjective);
            expect(response.statusCode).toBe(201);
            expect(response.name).toBe(mockObjective.name)
    })
})
```
