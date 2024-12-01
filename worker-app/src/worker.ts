import AWS from 'aws-sdk';
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
        const awsClientECS = new AWS.ECS();

        const params = {
            QueueUrl: process.env.AWS_SQS_URL,
            MaxNumberOfMessages: 1,
            WaitTimeSeconds: 20
        }

        while (true) {
            const reponse = await awsClientSQS.receiveMessage(params).promise();
            console.log('Messages received from the queue', reponse);
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
                    const decodedKey = decodeURIComponent(params.Key);
                    console.log('Processing the event', decodedKey);
                    console.log('Processing the event', params);
                    //ECS Docker spin up
                    const taskCommand = {
                        taskDefinition: process.env.AWS_ECS_TASK_DEFINITION,
                        cluster: process.env.AWS_ECS_CLUSTER,
                        launchType: 'FARGATE',
                        networkConfiguration: {
                            awsvpcConfiguration: {
                                subnets: process.env.AWS_SUBNETS.split(','),
                                assignPublicIp: 'ENABLED'
                            }
                        },
                        overrides: {
                            containerOverrides: [
                                {
                                    name: process.env.AWS_ECS_CONTAINER_NAME,
                                    environment: [
                                        { name: 'AWS_BUCKET_NAME', value: bucket.name },
                                        { name: 'AWS_BUCKET_KEY', value: object.key },
                                        { name: 'AWS_BUCKET_NAME_2', value: process.env.AWS_BUCKET_NAME_2 },
                                        { name: 'AWS_ACCESS_KEY', value: process.env.AWS_ACCESS_KEY },
                                        { name: 'AWS_SECRET_ACCESS_KEY', value: process.env.AWS_SECRET_ACCESS_KEY },
                                        { name: 'AWS_REGION', value: process.env.AWS_REGION }
                                    ]
                                }
                            ]
                        }
                    };

                    await awsClientECS.runTask(taskCommand).promise();
                    console.log('Task started in ECS');

                    //delete the message from the queue
                    await awsClientSQS.deleteMessage({
                        QueueUrl: process.env.AWS_SQS_URL as string,
                        ReceiptHandle: ReceiptHandle as string
                    }).promise();
                    // send the m3u8 files to the backend api
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