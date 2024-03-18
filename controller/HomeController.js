const fs = require('fs-extra');
const path = require('path');

const PDF_FOLDER = path.join(__dirname, '..', 'public', 'pdfs');

const HomeController = {
  index: (req, res) => {
    res.render('index');
  },
  upload: (req, res) => {
    res.redirect('/uploads');
  },
  list: async (req, res) => {
    try {
      const files = await fs.readdir(PDF_FOLDER);
      res.render('uploads', { files });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
  delete: async (req, res) => {
    try {
      const { filename } = req.params;
      await fs.unlink(path.join(PDF_FOLDER, filename));
      res.redirect('/uploads');
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
  download: (req, res) => {
    const { filename } = req.params;
    res.download(path.join(PDF_FOLDER, filename));
  },
  renameForm: async (req, res) => {
    const { filename } = req.params;
    res.render('rename', { filename });
  },

  // Method to handle the renaming action
  rename: async (req, res) => {
    const { oldFilename } = req.params;
    const newFilename = req.body.newFilename;
    const oldPath = path.join(PDF_FOLDER, oldFilename);
    const newPath = path.join(PDF_FOLDER, newFilename);

    try {
      await fs.rename(oldPath, newPath);
      res.redirect('/uploads');
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
};


module.exports = HomeController;