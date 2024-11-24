import AWS from 'aws-sdk';
import type { S3Event } from 'aws-lambda';
import * as dotenv from 'dotenv';

dotenv.config();

const pollingSQS = async () => {
    try {
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION
        })
        const awsClientSQS = new AWS.SQS();

        const params = {
            QueueUrl: process.env.AWS_SQS_URL as string,
            MaxNumberOfMessages: 1,
            VisibilityTimeout: 20,
            WaitTimeSeconds: 20
        }

        while (true) {
            const reponse = await awsClientSQS.receiveMessage(params).promise();
            if (reponse.Messages) {
                const { Messages } = reponse;
                for (const message of Messages) {
                    const { Body, ReceiptHandle } = message;
                    if (!Body) continue;
                    const event = JSON.parse(Body);

                    // ignore the s3 test event
                    if ("Service" in event && event['Event'] == "s3:TestEvent") {
                        continue;
                    }

                    // process the event here
                    const { s3 } = event.Records[0];
                    const { bucket, object } = s3;
                    const params = {
                        Bucket: bucket.name,
                        Key: object.key
                    }
                    // ECS Docker spin up
                    // delete the message from the queue
                    await awsClientSQS.deleteMessage({
                        QueueUrl: process.env.AWS_SQS_URL as string,
                        ReceiptHandle: ReceiptHandle as string
                    }).promise();
                    console.log('Message deleted from the queue');
                }

            }
            console.log('No messages in the queue');
        }

    } catch (error) {
        // if any error occurs, log it and retry after 5 seconds
        console.log(error);
        console.log("error generating the message"); 
    }
}
pollingSQS();