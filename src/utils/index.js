'use strict'

const _ = require('lodash')

const  getInfoData = ({fileds = [], object = {} }) => {
    return _.pick(object, fileds) 

}
const getSelectData = (select = []) => {
   return Object.fromEntries(select.map(sl => [sl,1]))
   // or return sleect.join(' ')
}
const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map(sl => [sl,0]))
}
const removeTrashInObject = obj => {
    Object.keys(obj).forEach( k => {
        if(obj[k] === null)
            delete obj[k]
    })
    return obj
}
const nestRemoveUndefinedObject = (obj) => {
    const final = {}
    Object.keys(obj).forEach( k => {
        if(typeof obj[k] === "object" && !Array.isArray(obj[k])){
            const res = nestRemoveUndefinedObject(obj[k])
            Object.keys(res).forEach( a => {
                final[`${k}.${a}`] = res[a]
            })
        } else {
            final[k] = obj[k]
        }
    }) 
    return final
}
module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeTrashInObject,
    nestRemoveUndefinedObject
}