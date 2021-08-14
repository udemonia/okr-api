const objectiveController = require('../../controller/objectives-controller');
const ObjectiveModel = require('../../Models/Objectives')
const httpMocks = require('node-mocks-http')
const newObjective = require('../mock/objectiveMockData.json')

//* Bring in the objective model -> 
//* over ride the original create mongoose create method with jest.fn()
//* This allows us to spy on the method
ObjectiveModel.create = jest.fn()

//? Global Scoped req, res, next
let req, res, next;

//? call before each for all network i/o tests
beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = null

})

//! Functions should exist within OKR Objective Controller

describe('objectiveController.deleteObjective', () => {

                            //! function should exist ? 
    it('Should have a delete function', () => {
        expect(typeof objectiveController.deleteObjective).toBe('function')
    })
})

describe('objectiveController.getObjectives', () => {
    it('Should be a get function', () => {
        expect(typeof objectiveController.getObjectives).toBe('function')
    })
})


describe('objectiveController.postObjective', () => {

    it('Should have a post function', () => {
        expect(typeof objectiveController.postObjective).toBe('function')
    })
    it('Should call ObjectiveModel.create', async () => {

        // the controller needs to get req.user to proceed
        req.user = {id: '60e2f4d5a85e1c5ba5fc995e'}
        req.body = newObjective

        await objectiveController.postObjective(req, res, next);
        expect(ObjectiveModel.create).toBeCalledWith(req.body);

    })
    it('Valid user post response should return a 201 ', async () => {
        // the controller needs to get req.user to proceed
        req.user = {id: '60e2f4d5a85e1c5ba5fc995e'}
        req.body = newObjective
        await objectiveController.postObjective(req, res, next);
        expect(res.statusCode).toBe(201);
    })
})



describe('objectiveController.getSingleObjective', () => {
    it('Should have a get function', () => {
        expect(typeof objectiveController.getSingleObjective).toBe('function')
    })
})


describe('objectiveController.updateObjective', () => {
    it('Should have a put function', () => {
        expect(typeof objectiveController.updateObjective).toBe('function')
    })
})

//! Testing our Mongoose/Mongo Model Methods







