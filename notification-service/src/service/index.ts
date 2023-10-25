import MailSenderService from "./mail-sender.service";
import awsSESClient from "./ses-client.service";


const mailSenderService = new MailSenderService(awsSESClient());

export default mailSenderService;


