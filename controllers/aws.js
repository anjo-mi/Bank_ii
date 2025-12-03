import { readFile } from "node:fs/promises";

import {
  PutObjectCommand,
  GetObjectCommand,
  S3Client,
  S3ServiceException,
} from "@aws-sdk/client-s3";

import dotenv from "dotenv";

dotenv.config();

export default {
  storeAudio: async ({ key, audio }) => {
    const client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_KEY,
        secretAccessKey: process.env.AWS_SECRET,
      }
    });
    const command = new PutObjectCommand({
      Bucket: 'bankii.0',
      Key: key,
      Body: audio,
      ContentType: "audio/webm",
    });

    try {
      const response = await client.send(command);
      console.log({response});

      return response;
      
    } catch (storeAudioError) {
      if (
        storeAudioError instanceof S3ServiceException &&
        storeAudioError.name === "EntityTooLarge"
      ) {
        console.error(
          `Error from S3 while uploading object to ${bucketName}. \
  The object was too large. To upload objects larger than 5GB, use the S3 console (160GB max) \
  or the multipart upload API (5TB max).`,
        );
      } else if (storeAudioError instanceof S3ServiceException) {
        console.error(
          `Error from S3 while uploading object to ${bucketName}.  ${storeAudioError.name}: ${storeAudioError.message}`,
        );
      } else {
        throw storeAudioError;
      }
    }
  },

  getAudio: async (key) => {
    const client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_KEY,
        secretAccessKey: process.env.AWS_SECRET,
      }
    });

    const command = new GetObjectCommand({
      Bucket: "bankii.0",
      Key: key,
      // ResponseContentType: "audio/webm",
    });

    try{
      const {Body} = await client.send(command);

    }catch(getAudioError){
      console.error(`error while retrieving your data: ${getAudioError.message}`)
    }
  }
}