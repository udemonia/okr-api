const express = require('express')
const advancedResults = require('../middleware/advancedResults')
const KeyResults = require('../Models/KeyResults')
const Objectives = require('../Models/Objectives')

const { 
    getKeyResults
    , getKeyResult
    , addKeyResult
} = require('../controller/keyResults-controller')

const router = express.Router({ mergeParams: true })

// get handles both /keyresults and /:objectiveId/keyresults
// todo => add put/delete routes
router.route('/')
    .get(getKeyResults)
    .post(addKeyResult)

router.route('/:keyResultId')
    .get(getKeyResult)

module.exports = router;