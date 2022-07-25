const joi = require('joi');

module.exports.bookSchema = joi.object({
    book: joi.object({
        title: joi.string().required(),
        author: joi.string().required(),
        country: joi.string().required(),
        language: joi.string().required(),
        year: joi.number().required(),
        description: joi.string().required(),
    }).required()
});