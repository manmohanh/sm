
import { Request, Response } from "express";
import { catchError, TryError } from "../utils/error";
import { downloadObject, isFileExist, uploadObject } from "../utils/s3";

export const downloadFile = async (req: Request, res: Response) => {
  try {
    const { path } = req.body;
    if (!path) throw TryError("Invalid path", 400);

    const isExist = await isFileExist(path);

    if (!isExist) throw TryError("File doesn't exist", 404);

    const url = await downloadObject(path);

    res.json({ url });
  } catch (error: unknown) {
    catchError(error, res, "Failed to generate download url.");
  }
};

export const uploadFile = async (req: Request, res: Response) => {
  try {
    const path = req.body?.path;
    const type = req.body?.type;
    const status = req.body?.status
    if (!path || !type || !status)
      throw TryError("Invalid request path or type is requird", 400);

    const url = await uploadObject(path, type,status);

    res.json({ url });
  } catch (error) {
    catchError(error, res, "Failed to generate upload url.");
  }
};
