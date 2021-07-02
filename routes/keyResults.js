const express = require('express')
const advancedResults = require('../middleware/advancedResults')
const KeyResults = require('../Models/KeyResults')

const { 
    getKeyResults
    , getKeyResult
    , addKeyResult
} = require('../controller/keyResults-controller')

const router = express.Router({ mergeParams: true })

// get handles both /keyresults and /:objectiveId/keyresults
router.route('/')
    .get(getKeyResults)
    .post(addKeyResult)

router.route('/:keyResultId')
    .get(getKeyResult)


// router.route('/')
//     .get(advancedResults(Objectives), getObjectives)
//     .post(postObjective)

// router.route('/:id')
//     .get(getSingleObjective)
//     .put(updateObjective)
//     .delete(deleteObjective)


module.exports = router;