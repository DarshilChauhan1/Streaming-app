"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const pollingSQS = async () => {
    try {
        aws_sdk_1.default.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION
        });
        const awsClientSQS = new aws_sdk_1.default.SQS();
        const params = {
            QueueUrl: process.env.AWS_SQS_URL,
            MaxNumberOfMessages: 1,
            VisibilityTimeout: 20,
            WaitTimeSeconds: 20
        };
        while (true) {
            const reponse = await awsClientSQS.receiveMessage(params).promise();
            if (reponse.Messages) {
                const { Messages, $response } = reponse;
                for (const message of Messages) {
                    const { Body, ReceiptHandle } = message;
                    if (!Body)
                        continue;
                    const event = JSON.parse(Body);
                    if ("Service" in event && event['Event'] == "s3:TestEvent") {
                        continue;
                    }
                    const { s3 } = event.Records[0];
                    const { bucket, object } = s3;
                    const params = {
                        Bucket: bucket.name,
                        Key: object.key
                    };
                }
            }
            console.log('No messages in the queue');
        }
    }
    catch (error) {
        console.log('error', error);
    }
};
pollingSQS();
//# sourceMappingURL=woker.js.map