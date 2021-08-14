const request = require('supertest')
const app = require('../../server') // import our server/entry point
const mockObjective = require('../mock/objectiveMockData.json')
const endpoint = '/api/v1/objectives' // testing only the objective endpoint

//* To use supertest, bring in your app and supertest

//? POST Request Checks

describe(endpoint, () => {
    it('POST' + endpoint, async () => {

        const response = await request(app)
            .post(endpoint)
            .send(mockObjective)
            expect(response.statusCode).toBe(401)
    })

})

