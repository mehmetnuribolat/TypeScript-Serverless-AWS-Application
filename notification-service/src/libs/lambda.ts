import middy from '@middy/core';
import sqsJsonBodyParser from '@middy/sqs-json-body-parser';

export default handler => middy(handler)
.use([
  sqsJsonBodyParser(),
]);
