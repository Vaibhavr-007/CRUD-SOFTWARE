const joi=require('joi');
module.exports.campgroundschema=joi.object({
    campground:joi.object({
        title:joi.string().required(),
        price:joi.number().required().min(0),
        image:joi.string().required(),
        image:joi.string().required(),
        description:joi.string().required()
    }).required()
})