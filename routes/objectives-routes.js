const express = require('express')
const advancedResults = require('../middleware/advancedResults')
const Objectives = require('../Models/Objectives')

const { 
    getObjectives
    , postObjective
    , getSingleObjective
    , updateObjective
    , deleteObjective
    } = require('../controller/objectives-controller')

const keyResultsRouter = require('./keyResults')
const router = express.Router()

//? bring in the User Authentication middleware and hide our routes behind them
const { loginRequiredRoutes } = require('../middleware/bearerAuth')

//? reroute /:objectiveId/keyresults to the key results router
router.use('/:objectiveId/keyresults', keyResultsRouter)

router.route('/')
    .get(loginRequiredRoutes, advancedResults(Objectives), getObjectives)
    .post(loginRequiredRoutes, postObjective)

router.route('/:id')
    .get(loginRequiredRoutes, getSingleObjective)
    .put(loginRequiredRoutes, updateObjective)
    .delete(loginRequiredRoutes, deleteObjective)


module.exports = router;