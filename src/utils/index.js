'use strict'

const _ = require('lodash')

const getInfoData = ({feilds = [], object = {} }) => {
    return _.pick( object, feilds)

}

module.exports = {
    getInfoData
}