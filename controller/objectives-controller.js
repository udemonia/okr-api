// const KeyResult = require('../Models/KeyResults')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async') 
const Objectives = require('../Models/Objectives')

//todo - auth errors returning as html, we'll want to update this so we're responding with json

exports.getObjectives = async (req,res,next) => {
    try {
        const objectives = await Objectives.find()
        res.status(200).json(res.advancedResults)
    } catch (error) {
        res.status(400).json({
            success: false
        })
    }
}

exports.postObjective = async (req,res,next) => {
    try {
        const objective = await Objectives.create(req.body)
        res.status(201).json({
            success: true,
            data: objective
    })
    } catch (err) {
        res.status(400).json({
            success: false
        })
    }
}

exports.getSingleObjective = async (req,res,next) => {
    const objectiveId = req.params.id
    console.log(req.params.id)

    try {  
        const objective = await Objectives.findById(objectiveId)

        if(!objective) {
            return res.status(404).json({
                success: false,
                error: 'Objective Not Found'
            })
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
    console.log(req.params.id)

    try {  
        const objective = await Objectives.findByIdAndUpdate(objectiveId, req.body, {
            new: true,
            validators: true
        })

        if(!objective) {
            return res.status(404).json({
                success: false,
                error: 'Objective Not Found'
            })
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

exports.deleteObjective = async (req,res,next) => {
    const objectiveId = req.params.id
    console.log(req.params.id)
    try {  
        const objective = await Objectives.findById(objectiveId)

        if(!objective) {
            return res.status(404).json({
                success: false,
                error: 'Objective Not Found'
            })
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