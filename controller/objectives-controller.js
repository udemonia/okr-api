// const KeyResult = require('../Models/KeyResults')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async') 
const Objectives = require('../Models/Objectives')
const chalk = require('chalk')

//todo - auth errors returning as html, we'll want to update this so we're responding with json

exports.getObjectives = async (req,res,next) => {
    try {
        res.status(200).json(res.advancedResults)
    } catch (error) {
        res.status(400).json({
            success: false
        })
    }
}

exports.postObjective = async (req,res,next) => {
    //* add the user objectives on post creation request
    req.body.user = req.user.id

    try {
        const objective = await Objectives.create(req.body)
        res.status(201).json({
            success: true,
            data: objective
    })
    } catch (err) {
        res.status(500).json({
            success: false
        })
    }
}

exports.getSingleObjective = async (req,res,next) => {
    const objectiveId = req.params.id;
    const userId = req.user.id;

    try {  
        const objective = await Objectives.findById(objectiveId)

        if(!objective) {
            return res.status(404).json({
                success: false,
                error: 'Objective Not Found'
            })
        }

        //* check to ensure the user Id in the returned collection matches the logged in users
        if (objective.user._id.toString() != userId) {
            return next( new ErrorResponse('Unauthorized Request', 401))
        }

        res.status(200).json({
            success: true,
            data: objective
        })
    } catch (err) {
        res.status(400).json({
            success: false
        })
    }
}

exports.updateObjective = async (req,res,next) => {
    const objectiveId = req.params.id
    const userId = req.user.id;

    try {

        let objective = await Objectives.findByIdAndUpdate(objectiveId)
        console.log(objective)

        if(!objective) {
            return res.status(404).json({
                success: false,
                error: 'Objective Not Found'
            })
        }

        //* compare the mongo object Id string to the logged in user's id
        //* if they don't match, error out
        if (objective.user._id.toString() != userId) {
            return next( new ErrorResponse('Unauthorized Request', 401))
        }

        objective = await Objectives.findByIdAndUpdate(objectiveId, req.body, {
            new: true,
            validators: true
        })

        res.status(200).json({
            success: true,
            data: objective
        })

    } catch (err) {
        res.status(400).json({
            success: false,
            error: err
        })
    }
}

exports.deleteObjective = async (req,res,next) => {

    const userId = req.user.id;
    const objectiveId = req.params.id

    try {  

        const objective = await Objectives.findById(objectiveId)

        //* handle objective not found
        if(!objective) {
            return res.status(404).json({
                success: false,
                error: 'Objective Not Found'
            })
        }

        //* compare the mongo object Id string to the logged in user's id
        //* if they don't match, error out
        if (objective.user._id.toString() != userId) {
            return next( new ErrorResponse('Unauthorized Request', 401))
        }
        
        objective.remove()

        res.status(200).json({
            success: true,
            data: {}
        })

    } catch (err) {
        res.status(400).json({
            success: false
        })
    }

}