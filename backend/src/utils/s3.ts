import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const bucket = process.env.S3_BUCKET;
export const region = process.env.REGION;

const conn = new S3Client({
  region: region,
  endpoint: `https://s3-${region}.amazonaws.com`,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const isFileExist = async (path: string) => {
  try {
    const command = new HeadObjectCommand({
      Bucket: bucket,
      Key: path,
    });
    await conn.send(command);
    return true;
  } catch (error) {
    return false;
  }
};

export const downloadObject = async (path: string, expiry: number = 60) => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: path,
  });
  const url = await getSignedUrl(conn, command, { expiresIn: expiry });
  return url;
};

export const uploadObject = async (path: string, type: string) => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: path,
    ContentType: type,
  });
  const url = await getSignedUrl(conn, command, { expiresIn: 60 });
  return url;
};
