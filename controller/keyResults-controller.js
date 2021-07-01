// const KeyResult = require('../Models/KeyResults')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async') 
const Objective = require('../Models/Objectives')
const KeyResults = require('../Models/KeyResults')

// GET all Key Results
// GET api/v1/keyResults

// get all Key Results for a specific Objective
// GET api/v1/objective/:objectiveId/keyResults
exports.getKeyResults = async (req,res,next) => {
    // lets check and see if this request came in with an objective Id
    let query;
    console.log(req.params)
    if (req.params.objectiveId) {
        console.log(`I've found the objective Id`)
        query = await KeyResults.find({objective: req.params.objectiveId})
    } else {
        query = await KeyResults.find().populate({
            path: 'objective',
            select: 'name description '
        })
    }
    try {
        const keyResult  = await query;
        res.status(200).json({
            success: true,
            count: keyResult.length,
            data: keyResult
        })
    } catch (error) {
        res.status(400).json({
            success: false
        })
    }
}

// get a single keyResult
exports.getKeyResult = async (req,res,next) => {
    const keyResult = await KeyResults.findById(req.params.keyResultId).populate({
        path: 'objective',
        select: 'name description'
    })

    if (!keyResult) {
        return next(new ErrorResponse(`No Key Result with an ID of ${req.params.keyResultId}`, 404))
    }

    try {
        const keyResult  = await query;
        res.status(200).json({
            success: true,
            count: keyResult.length,
            data: keyResult
        })
    } catch (error) {
        res.status(400).json({
            success: false
        })
    }
}


// create a key result
// post api/v1/objective/:objectiveId/keyResult
exports.addKeyResult = async (req,res,next) => {
    
}