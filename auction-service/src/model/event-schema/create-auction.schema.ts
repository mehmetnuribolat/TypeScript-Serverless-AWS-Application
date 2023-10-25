export const createCarAuctionSchema = {
    type: 'object',
    required: ['body'],
    properties: {
      body: {
        type: 'object',
        required: ['chasis', 'make', 'model', 'year', 'color'],
        properties: {
          chasis: {type: 'string'},
          make: {type: 'string'},
          model: {type: 'string'},
          year: {type: 'number'},
          color: {type: 'string'},
        },
      },
    },
};