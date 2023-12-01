import Joi, { ObjectSchema } from 'joi';

// Schema for validate only request body
const archiveBodySchema: ObjectSchema = Joi.object().keys({
  title: Joi.string().required().min(2).max(15).messages({
    'string.base': 'Title must be of type string',
    'string.min': 'The title is too short, must be at least 2 characters',
    'string.max': 'The title is too long, must be at least 15 characters',
    'string.empty': 'Title is a required field'
  })
});

// Schema for validate only request file
const archiveFileSchema: ObjectSchema = Joi.object()
  .required()
  .label('Document file')
  .keys({
    fieldname: Joi.string().valid('document').required().messages({
      'string.only': 'Invalid fieldname, only document name is allowed.',
      'string.empty': 'Fieldname is a required field'
    }),
    originalname: Joi.string().required().messages({
      'string.empty': 'Original name is a required field'
    }),
    encoding: Joi.string().required().messages({
      'string.empty': 'Original name is a required field'
    }),
    mimetype: Joi.string()
      .valid(
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      )
      .required()
      .messages({
        'any.only': 'Invalid file type, only PDF, TXT, WORD file types are allowed.'
      }),
    buffer: Joi.binary().required(),
    size: Joi.number().required().messages({
      'number.empty': 'Size is a required field'
    })
  })
  .messages({ 'any.required': 'Document file is a required field' });

export { archiveBodySchema, archiveFileSchema };
