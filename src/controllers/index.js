import { v2 } from 'cloudinary';
import { generate } from 'shortid';
import dotenv from 'dotenv';
import jsonPatch from 'jsonpatch';

import createToken from '../utilities/createToken';

dotenv.config();

const cloudinary = v2;

const {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export const authenticate = ({ body: { username } }, res) => {
  const token = createToken({ username });

  return res.status(200).json({
    message: 'Authentication successfull',
    token,
  });
};

export const generateThumbnail = async (req, res) => {
  try {
    const imageId = generate();
    return cloudinary.uploader.upload(
      req.body.imageUrl,
      { public_id: imageId },
      (error) => {
        if (error) {
          const { message } = error;
          return res.status(error.http_code).json({ message });
        }
        const thumbnail = cloudinary.url(imageId, {
          secure: true,
          transformation: [{ width: 50, height: 50, crop: 'thumb' }],
        });
        return res.status(200).json({
          message: 'thumbnail generated',
          thumbnail,
        });
      },
    );
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const applyJsonPatch = async (req, res) => {
  try {
    const { document, operations } = req.body;
    const patchedDocument = jsonPatch.apply_patch(document, operations);
    return res.status(200).json({
      message: 'Patch applied',
      patchedDocument,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
