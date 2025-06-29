const express = require('express');
const router = express.Router();
const {
  uploadPodcast,
  getAllPodcasts,
  deletePodcast,
  searchPodcasts,
} = require('../controllers/podcastController');
const multer = require('multer');
const verifyUser = require('../utils/verifyUser');

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 600 * 1024 * 1024 // 100MB limit
  }
});
router.post(
  '/upload/:_id',
  verifyUser,
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'videoFile', maxCount: 1 }
  ]),
  uploadPodcast
);

router.get('/getAll', getAllPodcasts);
router.delete('/delete/:uploadId', verifyUser, deletePodcast);
// ✅ ADD THIS LINE FOR SEARCH
router.get('/search', searchPodcasts);
// router.get('/progress/:uploadId', getProcessingProgress);

module.exports = router;
