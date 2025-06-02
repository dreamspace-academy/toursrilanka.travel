import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Upload a file to S3
const uploadFileToS3 = async (file, folder = "videos") => {
  try {
    const fileStream = fs.createReadStream(file.path);
    const fileExtension = path.extname(file.originalname);
    const fileName = `${folder}/${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExtension}`;

    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileName,
      Body: fileStream,
      ContentType: file.mimetype,
    };

    const upload = new Upload({
      client: s3Client,
      params: uploadParams,
    });

    const result = await upload.done();

    // Clean up the temp file
    fs.unlinkSync(file.path);

    return {
      key: fileName,
      url: result.Location,
      etag: result.ETag,
    };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
};

// Generate a signed URL for getting a file (time-limited access)
const getSignedFileUrl = async (fileKey, expiresIn = 3600) => {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileKey,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw error;
  }
};

// Delete a file from S3
const deleteFileFromS3 = async (fileKey) => {
  try {
    const deleteParams = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileKey,
    };

    const command = new DeleteObjectCommand(deleteParams);
    await s3Client.send(command);

    return { success: true, message: "File deleted successfully" };
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    throw error;
  }
};

// Get public URL for a file
const getPublicFileUrl = (fileKey) => {
  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
};

export {
  uploadFileToS3,
  getSignedFileUrl,
  deleteFileFromS3,
  getPublicFileUrl,
};
