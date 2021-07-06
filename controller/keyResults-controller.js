const ErrorResponse = require('../utils/errorResponse');
// const asyncHandler = require('../middleware/async') 
const Objective = require('../Models/Objectives');
const KeyResults = require('../Models/KeyResults');

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

    // const userId = req.user.id;
    // // lets check and see if this request came in with an objective Id
    // let query;
    // console.log(req.params)
    // if (req.params.objectiveId) {
    //     console.log(`I've found the objective Id`)
    //     query = await KeyResults.find({objective: req.params.objectiveId})
    // } else {
    //     query = await KeyResults.find().populate({
    //         path: 'objective',
    //         select: 'name description '
    //     })
    // }
    // try {
    //     //* query our object for only results where our logged in users id is in the collection db
    //     const keyResult  = await query;

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

// get a single keyResult
exports.getKeyResult = async (req,res,next) => {

    const keyResult = await KeyResults.findById(req.params.keyResultId).populate({
        path: 'objective',
        select: 'name description'
    })

    if (!keyResult) {
        return next(new ErrorResponse(`No Key Result with an ID of ${req.params.keyResultId}`, 404))
    }
debugger
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

///

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