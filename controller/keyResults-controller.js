const ErrorResponse = require('../utils/errorResponse');
// const asyncHandler = require('../middleware/async') 
const Objective = require('../Models/Objectives');
const KeyResults = require('../Models/KeyResults');
const chalk = require('chalk')

//todo - do we have a route defined to only get an KeyResult by ID?


// GET all Key Results
// GET api/v1/keyResults

// get all Key Results for a specific Objective
// GET api/v1/objective/:objectiveId/keyResults
exports.getKeyResults = async (req,res,next) => {

    //! going to try this... 

    try {
        res.status(200).json(res.advancedResults)
    } catch (error) {
        res.status(400).json({
            success: false
        })
    }
}

// get a single keyResult
exports.getKeyResult = async (req,res,next) => {

    //! Trying something there....
    console.log(chalk.red(JSON.stringify(req.params, null, 2)))
    const keyResultId = req.params.keyResultId;
    console.log(`Key Result: ${keyResultId}`)
    const userId = req.user.id;

    try {  
        const getKeyResult = await KeyResults.findById(keyResultId)

        if(!getKeyResult) {
            return res.status(404).json({
                success: false,
                error: 'Key Result Not Found'
            })
        }

        //* check to ensure the user Id in the returned collection matches the logged in users
        if (getKeyResult.user._id.toString() != userId) {
            return next( new ErrorResponse('Unauthorized Request', 401))
        }

        res.status(200).json({
            success: true,
            data: getKeyResult
        })
    } catch (err) {
        res.status(400).json({
            success: false
        })
    }
    // const KeyResultId = req.params.keyResultId

    // try {
    //     const keyResult = await KeyResults.findById(KeyResultId).populate({
    //         path: 'objective',
    //         select: 'name description'
    //     })
    
    //     if (!keyResult) {
    //         return next(new ErrorResponse(`No Key Result with an ID of ${req.params.keyResultId}`, 404))
    //     }

    //     res.status(200).json({
    //         success: true,
    //         count: keyResult.length,
    //         data: keyResult
    //     })
    // } catch (error) {
    //     res.status(400).json({
    //         success: false
    //     })
    // }
}

///!

//* create a key result
//* post api/v1/objective/:objectiveId/keyResult
exports.addKeyResult = async (req,res,next) => {

    //* 1. take the ob id and put it in the body for key results.objective
    req.body.objective = req.params.objectiveId

    //* 2. find the objective
    const objective = await Objective.findById(req.params.objectiveId)

    //* 3. handle not found
    if (!objective) {
        return next(new ErrorResponse(`Objective Not Found: ${req.params.objectiveId}`, 404))
    }
    //* lets look at our req.body
    console.log(req.body)

    //* create a new Key Result
    const keyResult = await KeyResults.create(req.body)

    res.status(201).json({
        success: true,
        data: keyResult
    })
}