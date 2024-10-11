'use strict';

const Joi = require('joi');

module.exports = {
    subscribe: Joi.object().keys({
        activation_type: Joi.string()
            .required()
            .messages({
                'string.empty': `Activation type cannot be an empty field`,
                'any.required': `Activation type is a required field`
            }),
        customer_id: Joi.string()
            .required()
            .messages({
                'string.empty': `Customer Id cannot be an empty field`,
                'any.required': `Customer Id is a required field`
            }),
        mobile_no: Joi.string()
            .required()
            .messages({
                'string.empty': `Mobile No cannot be an empty field`,
                'any.required': `Mobile No is a required field`
            }),
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'in'] } })
            .messages({
                'string.email': `Email must be a valid format`
            }),
        plan_list: Joi.required()
            .messages({
                'string.empty': `Plan list cannot be an empty field`,
                'any.required': `Plan list is a required field`
            })
    }).unknown(true)
};