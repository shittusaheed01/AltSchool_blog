const Joi = require('joi');

const PostBlogSchema = Joi.object({
    title: Joi.string()
        .trim()
        .min(3)
        .max(20)
        .required(),
    description: Joi.string()
        .min(5)
        .trim(),
    tags: Joi.array()
        .items(Joi.string())
        ,
    body: Joi.string()
        .min(10)
        .required(),
    state: Joi.string()
        .valid('published', 'draft')
        .default("draft")
})


const UpdateBlog = Joi.object({
    title: Joi.string()
        .trim()
        .min(3)
        .max(20),
    description: Joi.string()
        .min(5)
        .trim(),
    tags: Joi.array()
        .items(Joi.string())
        ,
    body: Joi.string()
        .min(10),
    state: Joi.string()
        .valid('published', 'draft')
})


async function PostBlogValidation(req, res, next) {
    const user = req.body

    try {
        await PostBlogSchema.validateAsync(user)
        next()
    } catch (error) {
        next({
            message: error.details[0].message,
            status: 400
        })
    }
}

async function UpdateBlogValidation(req, res, next) {
    const user = req.body

    try {
        await UpdateBlog.validateAsync(user)
        next()
    } catch (error) {
        next({
            message: error.details[0].message,
            status: 400
        })
    }
}

module.exports = {
    PostBlogValidation,
    UpdateBlogValidation
}