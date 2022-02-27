import { request, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Color } from '../models/colorModel';
import { Palette } from '../models/paletteModel';


export const createPalette = async (req: Request, res: Response) => {
    const request = req.body;
    const individualColors = []
    for (let field in request){ // prepare data for insert colors in color collection
        for (let color in request[field]){
            individualColors.push({
                type: field,
                hexCode: request[field][color]
            })
        }
    }
    try {
        const colorData = await Color.insertMany(individualColors) // insert at Color collection
        const colorsSet: Record<string, any> = {} // create ids array per field
        let type: string = ""
        for (let color in colorData) {
            type = colorData[color].type
            colorsSet[type] ? 
                colorsSet[type].push(colorData[color]._id) : colorsSet[type] = [colorData[color]._id]
        }
        const paletteData = await Palette.create(colorsSet) // insert at Color collection
        res.status(201).json(paletteData)
    } catch(err: any){
        throw new Error(err.message)
    }
};

export const getPalette = async (req: Request, res: Response) => {
    const { id: paletteId } = req.params;
    await Palette.findOne(
        {_id: paletteId}, 
        {createdAt: false, updatedAt: false, __v: false}
    ).populate([
        { path: 'primaryColor', select: '_id hexCode' }, 
        { path: 'secondaryColor', select: '_id hexCode' }, 
        { path: 'textColor', select: '_id hexCode' }, 
        { path: 'backgroundColors', select: '_id hexCode' }, 
        { path: 'extraColors', select: '_id hexCode' }
    ]).then((palette) => {
        res.status(200).json({ ...palette._doc });
    }).catch((err) => {
        throw new Error(err.message)
    })
};

export const updatePalette = async (req: Request, res: Response) => {
    const request = req.body
    delete request._id
    const updateOpts = []
    for (let field in request){ // prepare data for insert colors in color collection
        for (let color in request[field]){
            updateOpts.push({
                updateOne : {
                    "filter" : {_id: request[field][color]._id},
                    "update" : {
                        $set : { hexCode: request[field][color].hexCode }
                    }
            }})
        }
    }
    const colors = await Color.bulkWrite(updateOpts)
        .catch((err) => {
            throw new Error(err.message)
        })
    res.status(200).json(colors)
}

export const deletePalette = async (req: Request, res: Response) => {
    const { id: paletteId } = req.params;
    const request = req.body
    let response: any
    let palette = await Palette.findOne({ _id: paletteId }, {
        _id: true,
        primaryColor: true,
        secondaryColor: true,
        textColor: true, 
        backgroundColors: true,
        extraColors: true
    });
    if (!palette) 
        throw new Error(`No palette with id : ${paletteId}`);
    try {
        const paletteData = palette._doc
        const ids = []
        if (Object.keys(request).length != 0){ // delete color from array
            delete paletteData._id
            ids.push(...request.colors_ids.map((id: string) => new mongoose.Types.ObjectId(id)))
            let index: number = 0
            for (let field in paletteData){
                ids.forEach((id: any) => {
                    if (paletteData[field].includes(id)){
                        index = paletteData[field].indexOf(id)                        
                        paletteData[field].splice(index, 1) // remove id or ids color from palette array
                    }
                });
            }
            const updatedPalette = await Palette.updateOne( // update of palette array
                {_id: paletteId},
                {$set: palette}, {new: true, runValidators: true}
            )
            response = updatedPalette
        } else { // delete complete palette
            await palette.remove();
            for (let field in paletteData)
                ids.push(...paletteData[field])
            response = `Palette with id : ${paletteId} successfully removed`
        }
        await Color.deleteMany( {_id: {$in: ids}} ) // delete of color 
        res.status(200).json({ msg: response });
    } catch(err: any){
        res.status(400).json(err.message)
    }
} 
