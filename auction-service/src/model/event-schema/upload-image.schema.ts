export const uploadImageSchema = {
    type: 'object',
    required: ['body'],
    properties: {
      body: {
        type: 'object',
        required: ['content'],
        properties: {
          content: {type: 'string'},
        },
      },
    },
  };