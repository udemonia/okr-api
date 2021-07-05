const express = require('express')
const advancedResults = require('../middleware/advancedResults')
const KeyResults = require('../Models/KeyResults')
const Objectives = require('../Models/Objectives')

//? bring in the User Authentication middleware and hide our routes behind them
const { loginRequiredRoutes } = require('../middleware/bearerAuth')

const { 
    getKeyResults
    , getKeyResult
    , addKeyResult
} = require('../controller/keyResults-controller')

const router = express.Router({ mergeParams: true })

// get handles both /keyresults and /:objectiveId/keyresults
// todo => add put/delete routes
// todo => advanced Routes appear to not be working??
router.route('/')
    .get(advancedResults(KeyResults), loginRequiredRoutes, getKeyResults)
    .post(loginRequiredRoutes, addKeyResult)

router.route('/:keyResultId')
    .get(loginRequiredRoutes, getKeyResult)

module.exports = router;