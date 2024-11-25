"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const pollingSQS = async () => {
    try {
        aws_sdk_1.default.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION
        });
        const awsClientSQS = new aws_sdk_1.default.SQS();
        const awsClientECS = new aws_sdk_1.default.ECS();
        const params = {
            QueueUrl: process.env.AWS_SQS_URL,
            MaxNumberOfMessages: 1,
            WaitTimeSeconds: 20
        };
        while (true) {
            const reponse = await awsClientSQS.receiveMessage(params).promise();
            console.log('Messages received from the queue', reponse);
            if (reponse.Messages) {
                const { Messages } = reponse;
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
                    console.log('Processing the event', params);
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
                                        {
                                            name: 'AWS_BUCKET_NAME',
                                            value: bucket.name
                                        },
                                        {
                                            name: 'AWS_BUCKET_KEY',
                                            value: object.key
                                        },
                                        {
                                            name: 'AWS_BUCKET_NAME_2',
                                            value: process.env.AWS_BUCKET_NAME_2
                                        },
                                        {
                                            name: 'AWS_ACCESS_KEY',
                                            value: process.env.AWS_ACCESS_KEY
                                        },
                                        {
                                            name: 'AWS_SECRET_ACCESS_KEY',
                                            value: process.env.AWS_SECRET_ACCESS_KEY
                                        },
                                        {
                                            name: 'AWS_REGION',
                                            value: process.env.AWS_REGION
                                        }
                                    ]
                                }
                            ]
                        }
                    };
                    console.log(taskCommand.networkConfiguration.awsvpcConfiguration);
                    await awsClientECS.runTask(taskCommand).promise();
                    console.log('Task started in ECS');
                    await awsClientSQS.deleteMessage({
                        QueueUrl: process.env.AWS_SQS_URL,
                        ReceiptHandle: ReceiptHandle
                    }).promise();
                    console.log('Message deleted from the queue');
                }
            }
            console.log('No messages in the queue');
        }
    }
    catch (error) {
        console.log(error);
        console.log("error generating the message");
    }
};
pollingSQS();
//# sourceMappingURL=worker.js.map