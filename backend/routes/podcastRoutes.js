// routes/podcastRoutes.js
const express = require('express');
const router = express.Router();
const { uploadPodcast, getAllPodcasts } = require('../controllers/podcastController');
const multer = require('multer');
const verifyUser = require('../utils/verifyUser');

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

router.post('/upload/:_id',verifyUser, upload.fields([{ name: 'thumbnail' }, { name: 'videoFile' }]), uploadPodcast);
router.get('/getAll' ,  getAllPodcasts)
module.exports = router;
