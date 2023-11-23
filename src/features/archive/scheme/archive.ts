import Joi, { ObjectSchema } from 'joi';

// aqui se define la estructuraa del esquema para el inicio de un usuario

// schema para validar lo que es enviado en el body del req
const archiveBodySchema: ObjectSchema = Joi.object().keys({
  title: Joi.string().required().min(2).max(15).messages({
    'string.base': 'Title must be of type string',
    'string.min': 'The title is too short, must be at least 2 characters',
    'string.max': 'The title is too long, must be at least 15 characters',
    'string.empty': 'Title is a required field'
  })
});

// schema para validar lo que es enviado en el file del req
const archiveFileSchema: ObjectSchema = Joi.object().keys({
  // OJO NO SE COLOCAN MUCHAS RESTRICCIONES PERSONALIZADAS YA QUE ESTO VIENE DENTRO DE FILE Y ESO EL CLIENT NO LO PUEDE CONTROLAR
  fieldname: Joi.string().valid('document').required(),
  originalname: Joi.string().required(),
  encoding: Joi.string().required(),
  mimetype: Joi.string()
    // se quiere limitar a solo estos tipos de mimeType por eso se usa valid
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
  buffer: Joi.binary().required(), //buffer es un numero binario por eso se coloca este
  size: Joi.number().required()
});

export { archiveBodySchema, archiveFileSchema };
