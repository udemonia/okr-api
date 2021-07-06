const ErrorResponse = require('../utils/errorResponse');
// const asyncHandler = require('../middleware/async') 
const Objective = require('../Models/Objectives');
const KeyResults = require('../Models/KeyResults');
const chalk = require('chalk')

//todo - do we have a route defined to only get an KeyResult by ID?

exports.getKeyResults = async (req,res,next) => {

    //* only this Key Result request comes through the advanced routing middleware
    //* we have to handle sorting, searching, filtering, etc.
    //* while also handling requests that come with an objective Id (get all key results for this objective)
    //* & get all objectives with url parameters attached;
    try {
        res.status(200).json(res.advancedResults)
    } catch (error) {
        res.status(400).json({
            success: false
        })
    }
}

//* get a single keyResult by its ID in req.params.:keyResultId
exports.getKeyResult = async (req,res,next) => {
    //* pull out the user and key result id's from the request obj.
    // const objectiveId = req.params.id
    const keyResultId = req.params.keyResultId;
    const userId = req.user.id;

    try {
        debugger

        //* find key results by id - mongoose
        const getKeyResult = await KeyResults.findOne({_id: keyResultId}).populate('objective')


        //* handle undefined
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

        //* good to go - send the response on out
        res.status(200).json({
            success: true,
            data: getKeyResult
        })
    } catch (err) {
        res.status(400).json({
            success: false
        })
    }
}


// todo - should we validate the objective is associated with the user and only proceed after that?
//* create a key result
//* post api/v1/objective/:objectiveId/keyResult
exports.addKeyResult = async (req,res,next) => {

    //* 1. take the ob id and put it in the body for key results.objective
    req.body.objective = req.params.objectiveId

    //* 2. Add the users id to req.body for inserting
    req.body.user = req.user.id

    //* 3. find the objective
    const objective = await Objective.findById(req.params.objectiveId)

    //* 4. handle not found
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

//! Returning a 500 -> hitting the catch for some reason, start here!
exports.updateKeyResult = async (req,res,next) => {
    
    //* grab the keyResult and User Id from the request
    const getKeyResultId = req.params.keyResultId; 
    const userId = req.user.id;

    try {
        //* lets find the key result in question:
        let keyResult = await KeyResults.findById(getKeyResultId)

        //* handle not found:
        if (!keyResult) {
            return res.status(404).json({
                success: false,
                error: `Key Result Not Found with an Id of ${getKeyResultId}`
            })
        }

        //* compare the mongo object Id string to the logged in user's id
        //* if they don't match, error out
        if (keyResult.user._id.toString() != userId) {
            return next( new ErrorResponse('Unauthorized Request', 401))
        }

        //* we should be good to go now, lets mke the update
        keyResult = await KeyResults.findByIdAndUpdate(getKeyResultId, req.body, {
            new: true,
            validators: true
        })

        //* w/ validators = true, we return the updated obj from the mongo db
        res.status(200).json({
            success: true,
            data: keyResult
        })
    } catch (error) {
        next( new ErrorResponse('Failed To Update', 500))
    }
}

exports.deleteKeyResult = async (req,res,next) => {
        //* grab the keyResult and User Id from the request
        const getKeyResultId = req.params.keyResultId; 
        const userId = req.user.id;

        try {
            //* find the key Result in question:
            let keyResult = await KeyResults.findById(getKeyResultId)

            //* handle unauthorized requests:
            //* compare the mongo object Id string to the logged in user's id
            //* if they don't match, error out
            if (keyResult.user._id.toString() != userId) {
                return next( new ErrorResponse('Unauthorized Request', 401))
            }

            //* handle not found:
            if (!keyResult) {
                return next(new ErrorResponse(`Key Result ${getKeyResultId} not found`, 404))
            }

            //* At this point, we ought to be authorized to make the request and we ought to have a request to remove
            keyResult.remove()

            res.status(200).json({
                success: true,
                data: {}
            })

        } catch (error) {
            next(new ErrorResponse('Failed to Delete', 500))
        }
}
