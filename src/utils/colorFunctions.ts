import { Color } from "../models/colorModel"


export const insertManyColors = async (data: object[]) => {
    const colors = await Color.insertMany(data)
        .catch((err) => {
            throw new Error(err)
        })
    return colors
}

export const deleteManyColors = async (ids: string[]) => {
    const deletedColors = await Color.deleteMany( {_id: {$in: ids}} )
        .catch((err) => {
        throw new Error(err.message)
        })
    return deletedColors
}

export const bulkUpdateColors = async (colorOpts: object[]) => {
    const colorsUpdated = await Color.bulkWrite(colorOpts)
        .catch((err) => {
        throw new Error(err.message)
        })
    return colorsUpdated
}