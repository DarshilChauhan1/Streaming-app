const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const fs = require('fs');
const Fs = require('node:fs/promises');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

dotenv.config();

const videoProcess = async () => {
    try {
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION
        });
        const awsS3Client = new AWS.S3();

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: process.env.AWS_BUCKET_KEY
        };
        const videoFile = await awsS3Client.getObject(params).promise();
        console.log('Video file:', videoFile);

        const videoFilePath = path.join('/tmp', process.env.AWS_BUCKET_KEY); // Ensure correct temp path
        console.log('Video file path:', videoFilePath);

        // Ensure the directory exists
        const videoDir = path.dirname(videoFilePath);
        console.log('Video directory:', videoDir);
        if (!fs.existsSync(videoDir)) {
            fs.mkdirSync(videoDir, { recursive: true });
            console.log('Directory created:', videoDir);
        }

        await fs.promises.writeFile(videoFilePath, videoFile.Body); // Write video to file

        // Process video with FFmpeg
        await processVideo();

        // Upload processed video files to another S3 bucket
        const outputDir = `/outputs/${process.env.AWS_BUCKET_KEY}`;
        const files = fs.readdirSync(outputDir);
        console.log('Files:', files);

        for (const file of files) {
            const filePath = path.join(outputDir, file);
            const fileContent = fs.createReadStream(filePath);

            const processedVideoUploadParams = {
                Bucket: process.env.AWS_BUCKET_NAME_2,
                Key: `${process.env.AWS_BUCKET_KEY}/${file}`,
                Body: fileContent
            };

            const upload = await awsS3Client.upload(processedVideoUploadParams).promise();
            console.log('Uploaded:', upload.Location);
        }
    } catch (error) {
        console.error('Error processing video:', error);
    }
};

const processVideo = () => {
    const inputPath = `/tmp/${process.env.AWS_BUCKET_KEY}`;
    const outputPath = `/outputs/${process.env.AWS_BUCKET_KEY}`;

    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }

    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .outputOptions([
                '-start_number 0',
                '-hls_time 10',
                '-hls_list_size 0',
                '-hls_segment_filename', `${outputPath}/segment%03d.ts`, // Correctly separate option and value
                '-c:v libx264', // Ensure codec is specified
                '-c:a aac',
                '-f hls'
            ])
            .output(`${outputPath}/playlist.m3u8`) // M3U8 file
            .on('end', resolve)
            .on('error', reject)
            .run();
    });
    
};

// videoProcess().finally(() => process.exit(0));
