const fs = require('fs-extra');
const path = require('path');

const PDF_FOLDER = path.join(__dirname, '..', 'public', 'pdfs');




const HomeController = {
  index: (req, res) => {
    const userid = req.params.id;
    res.render('index',{errors:null, userid });
    
  },
  upload: (req, res) => {  
     if (req.uploadError) {
      const _id = req.params.id
      console.log(req.params)
        return res.status(401).render("index", { errors: req.uploadError, _id });
    }else {
     const userid = req.params.id;
     console.log(req.params)
     res.cookie('username', {userid});
     res.redir(`/user/${ userid }/uploads`);
}
},
  list: async (req, res) => {
    try {
      const files = await fs.readdir(PDF_FOLDER);
      const userid = req.params.id;
      res.render('uploads', { files , userid});
    } catch (err) {
      res.status(500).render("indix",{errors:err.message, userid});
    }
  },
  delete: async (req, res) => {
    try {
      const userid = req.params.id;
      const { filename } = req.params;
      await fs.unlink(path.join(PDF_FOLDER, filename));
      res.redirect(`/user/${ userid }/uploads`);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
  download: (req, res) => {
    const { filename } = req.params;
    res.download(path.join(PDF_FOLDER, filename));
  },
  renameForm: async (req, res) => {
    const userid = req.params.id;
    const { filename } = req.params;
    res.render('rename', { filename,  userid });
  },


  rename: async (req, res) => {
    const userid = req.params.id;
    const { oldFilename } = req.params;
    const newFilename = req.body.newFilename;
    const oldPath = path.join(PDF_FOLDER, oldFilename);
    const newPath = path.join(PDF_FOLDER, newFilename);

    try {
      await fs.rename(oldPath, newPath);
      res.redirect(`/user/${ userid }/uploads`);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
};


module.exports = HomeController;