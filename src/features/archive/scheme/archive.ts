import Joi, { ObjectSchema } from 'joi';

// aqui se define la estructuraa del esquema para el inicio de un usuario

// se crea un objeto de tipo ObjectSchema
const archiveSchema: ObjectSchema = Joi.object().keys({
  title: Joi.string().required().min(2).max(15).messages({
    // con "required" especificamos que debe ir este parametro
    // messages es para colocar un mensaje si el usuario incumple uno de los parametros ya colocado anteriormente
    // "min" es el metodo para establecer el minimo de characteres que debe tener y "max" es el tope
    'string.base': 'Title must be of type string',
    // string.base es el tipo que debe ser ese string
    'string.min': 'The title is too short must be at least 2 characteres',
    // "string.min" es para que si el usuario coloca menos de lo establecido muestre este mensaje
    'string.empty': 'Title is a required field'
    // "string.empty" es por si el usuario trata de enviar el archivo sin nombre de error
  }),
  document: Joi.string().required().messages({
    'any.required': 'Document is required'
    // usamos aca "any.required" para que el documento sea obligatorio y el tipo any, para asi englobar todo en caso de que no sea de tipo string
  }),
  fileType: Joi.string()
    .valid(
      // el metodo "valid" de joi se utiliza para especificar un conjunto de valores permitidos para un campo. Este método valida que el valor del campo esté presente en la lista de valores proporcionados
      // en este caso solo estos que estan dentro
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
    .required()
    .messages({
      'any.only': 'Invalid file type, only PDF, TXT, WORD file types are allowed.'
      // colocamos "any.only" para asi requerir que el valor coincida con lo requerido anteriormente, de no ser asi dara error
    })
});

export { archiveSchema };
