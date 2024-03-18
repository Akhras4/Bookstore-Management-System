const express = require('express');
const multer = require('multer');
const path = require('path');
const HomeController = require('../controller/HomeController');

const router = express.Router();

// Multer setup for PDF uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/pdfs');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype == 'application/pdf') {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .pdf format allowed!'));
    }
  }
});

// Define routes
router.get('/', HomeController.index);
router.post('/upload', upload.single('pdf'), HomeController.upload);
router.get('/uploads', HomeController.list);
router.get('/delete/:filename', HomeController.delete);
router.get('/download/:filename', HomeController.download);
router.get('/rename/:filename', HomeController.renameForm);
router.post('/rename/:oldFilename', HomeController.rename);

module.exports = router;
