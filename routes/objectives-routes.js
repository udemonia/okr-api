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


// reroute /:objectiveId/keyresults to the key results router
// todo => hide protected routes
router.use('/:objectiveId/keyresults', keyResultsRouter)

router.route('/')
    .get(advancedResults(Objectives), getObjectives)
    .post(postObjective)

router.route('/:id')
    .get(getSingleObjective)
    .put(updateObjective)
    .delete(deleteObjective)


module.exports = router;