import NotificationService from "./notification.service";
import sqsClient from "./sqs-client.service";


const notificationService = new NotificationService(sqsClient());

export default notificationService;