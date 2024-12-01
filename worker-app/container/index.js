const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const fs = require('fs');
const Fs = require('node:fs/promises');
const path = require('path');
const exec = require('child_process').exec;
const axios = require('axios');

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

        const videoFilePath = path.join('/tmp', process.env.AWS_BUCKET_KEY); // Ensure correct temp path

        // Ensure the directory exists
        const videoDir = path.dirname(videoFilePath);
        if (!fs.existsSync(videoDir)) {
            fs.mkdirSync(videoDir, { recursive: true });
            console.log('Directory created:', videoDir);
        }

        await fs.promises.writeFile(videoFilePath, videoFile.Body); // Write video to file

        const inputPath = `/tmp/${process.env.AWS_BUCKET_KEY}`;
        const outputPath = `${process.env.AWS_BUCKET_KEY}`;
        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath, { recursive: true });
        }
    
        const fileName = path.basename(outputPath, path.extname(outputPath));

        await convertToHls(inputPath, outputPath, fileName);

        // Generate master playlist
        await generateMasterPlaylist(outputPath, fileName);

        // Upload processed video files to another S3 bucket
        const outputDir = `${process.env.AWS_BUCKET_KEY}`;
        const files = fs.readdirSync(outputDir);

        const m3u8Files = {};

        for await (const file of files) {
            const fileStream = fs.createReadStream(`${outputDir}/${file}`);
            const uploadParams = {
                Bucket: process.env.AWS_BUCKET_NAME_2,
                Key: `${outputDir}/${file}`,
                Body: fileStream
            }
            const fileUpload = await awsS3Client.upload(uploadParams).promise();
            if (file.endsWith('.m3u8') && file.includes('_')) {
                const quality = file.split('_')[0];
                m3u8Files[quality] = fileUpload.Location;
            }
        }
        console.log('Files uploaded to S3:');
        // unlink the files
        fs.unlinkSync(inputPath);
        fs.rmdirSync(outputPath, { recursive: true });

        await axios.post('http://${PUBLIC_IP}:4000/uploads/uploaded-files', {
            files: m3u8Files,
            key : process.env.AWS_BUCKET_KEY
        })
        
    } catch (error) {
        console.error('Error processing video:', error);
    }
};

const convertToHls = async (inputPath, outputPath, fileName) => {
    const ffmpegCommand = `ffmpeg -hide_banner -y -i "${inputPath}" -vf scale=w=640:h=360:force_original_aspect_ratio=decrease -c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -hls_time 4 -hls_playlist_type vod -b:v 800k -maxrate 856k -bufsize 1200k -b:a 96k -hls_segment_filename "${outputPath}"/360p_%03d.ts "${outputPath}"/360p_${fileName}.m3u8 -vf scale=w=842:h=480:force_original_aspect_ratio=decrease -c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -hls_time 4 -hls_playlist_type vod -b:v 1400k -maxrate 1498k -bufsize 2100k -b:a 128k -hls_segment_filename "${outputPath}"/480p_%03d.ts "${outputPath}"/480p_${fileName}.m3u8 -vf scale=w=1280:h=720:force_original_aspect_ratio=decrease -c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -hls_time 4 -hls_playlist_type vod -b:v 2800k -maxrate 2996k -bufsize 4200k -b:a 128k -hls_segment_filename "${outputPath}"/720p_%03d.ts "${outputPath}"/720p_${fileName}.m3u8 -vf scale=w=1920:h=1080:force_original_aspect_ratio=decrease -c:a aac -ar 48000 -c:v h264 -profile:v main -crf 20 -sc_threshold 0 -g 48 -keyint_min 48 -hls_time 4 -hls_playlist_type vod -b:v 5000k -maxrate 5350k -bufsize 7500k -b:a 192k -hls_segment_filename "${outputPath}"/1080p_%03d.ts "${outputPath}"/1080p_${fileName}.m3u8`
    
    return new Promise((resolve, reject) => {
        exec(ffmpegCommand, (error, stdout, stderr) => {
            if (error) {
                console.error('Error converting video to HLS:', error);
                console.log('FFmpeg output:', stderr);
                reject(error);
            }
            console.log('Video converted to HLS:', stdout);
            resolve(stdout);
        });
    })

};

const generateMasterPlaylist = async (outputPath, fileName) => {
    const renditions = [
        { resolution: '360p', bandwidth: 800000, file: `360p_${fileName}.m3u8` },
        { resolution: '480p', bandwidth: 1400000, file: `480p_${fileName}.m3u8` },
        { resolution: '720p', bandwidth: 2800000, file: `720p_${fileName}.m3u8` },
        { resolution: '1080p', bandwidth: 5000000, file: `1080p_${fileName}.m3u8` },
    ];

    // Path to save the master.m3u8
    const masterFilePath = path.join(outputPath, `master_${fileName}.m3u8`);

    // Ensure the output directory exists
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }

    // Create the content for the master.m3u8 file
    let masterContent = '#EXTM3U\n#EXT-X-VERSION:3\n';

    renditions.forEach((rendition) => {
        masterContent += `#EXT-X-STREAM-INF:BANDWIDTH=${rendition.bandwidth},RESOLUTION=${rendition.resolution}\n`;
        masterContent += `${rendition.file}\n`;
    });

    // Write the content to master.m3u8
    fs.writeFileSync(masterFilePath, masterContent);
}


videoProcess().finally(() => process.exit(0));
