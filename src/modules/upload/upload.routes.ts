import { Router } from "express";

import multer from "multer";

import { CloudinaryStorage } from "multer-storage-cloudinary";

import cloudinary from "../../shared/cloudinary";

const router = Router();

const storage = new CloudinaryStorage({
  cloudinary,

  params: async () => ({
    folder: "ai-travel-tours",
  }),
});

const upload = multer({
  storage,
});

router.post(
  "/",
  upload.single("image"),

  async (req: any, res) => {

    try {

      res.json({
        imageUrl: req.file.path,
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        message: "Upload failed",
      });

    }

  }
);

export default router;