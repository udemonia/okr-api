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

const router = express.Router()

router.route('/')
    .get(advancedResults(Objectives), getObjectives)
    .post(postObjective)

router.route('/:id')
    .get(getSingleObjective)
    .put(updateObjective)
    .delete(deleteObjective)


module.exports = router;