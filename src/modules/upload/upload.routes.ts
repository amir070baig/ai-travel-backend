import { Router } from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../../shared/cloudinary";
import { authMiddleware } from "../../middleware/auth.middleware";
import { adminMiddleware } from "../../middleware/admin.middleware";

const router = Router();

const storage = new CloudinaryStorage({
  cloudinary,

  params: async () => ({
    folder: "ai-travel-tours",
  }),
});

const upload = multer({
  storage,

  limits: {
    fileSize:
      5 * 1024 * 1024,
  },

  fileFilter: (
    req,
    file,
    cb
  ) => {

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      allowedTypes.includes(
        file.mimetype
      )
    ) {

      cb(null, true);

    } else {

      cb(
        new Error(
          "Only images are allowed"
        )
      );

    }

  },
});

router.post(
  "/",

  authMiddleware,

  adminMiddleware,

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