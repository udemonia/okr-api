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
    , updateKeyResult
    , deleteKeyResult
} = require('../controller/keyResults-controller')

const router = express.Router({ mergeParams: true })

// get handles both /keyresults and /:objectiveId/keyresults
router.route('/')
    .get(loginRequiredRoutes, advancedResults(KeyResults, {
        path: 'objective',
        select: 'name description '
    }), getKeyResults)
    .post(loginRequiredRoutes, addKeyResult)

router.route('/:keyResultId')
    .get(loginRequiredRoutes, getKeyResult)
    .put(loginRequiredRoutes, updateKeyResult)
    .delete(loginRequiredRoutes, deleteKeyResult)

module.exports = router;