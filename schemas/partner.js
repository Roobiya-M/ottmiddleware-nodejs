'use strict';

const Joi = require('joi');

module.exports = {
    login: Joi.object().keys({
        username: Joi.string()
            .required()
            .messages({
                'string.empty': `Username cannot be an empty field`,
                'any.required': `Username is a required field`
            }),
        password: Joi.string()
            .required()
            .messages({
                'string.empty': `Password cannot be an empty field`,
                'any.required': `Password is a required field`
            }),
        source: Joi.string()
            .required()
            .messages({
                'string.empty': `Source cannot be an empty field`,
                'any.required': `Source is a required field`
            }),
    }).unknown(true)
};