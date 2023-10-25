import s3Client from "./s3-client.service";
import S3ImageService from "./s3-image.service";

const s3ImageService = new S3ImageService(s3Client());

export default s3ImageService;