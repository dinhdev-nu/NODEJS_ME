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
module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData
}