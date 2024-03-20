const fs = require('fs-extra');
const path = require('path');





const HomeController = {
  index: (req, res) => {
    if (!req.params.username) {
      return res.redirect('/login');
    }
    const username = req.params.username; 
    const directoryPath = path.join(__dirname, '..', 'public', username, 'pdfs'); 
    if(!fs.existsSync(directoryPath)){
      fs.mkdirSync(directoryPath, { recursive: true });
    }
    console.log(req.params)
    res.render('index',{errors:null, username});
    
  },
  upload: (req, res) => {  
     if (req.uploadError) {
      const username = req.params;
      console.log(req.params)
        return res.status(401).render("index", { errors: req.uploadError, username });
    }else {
     const username = req.params.username;
     console.log(req.params)
     res.cookie('username', username);
     res.redirect(`/user/${username}/uploads`);
}
},
  list: async (req, res) => {
    const username = req.params.username; 
    const PDF_FOLDER = path.join(__dirname, '..', 'public', username, 'pdfs');
    if(!fs.existsSync(PDF_FOLDER)){
      fs.mkdirSync(PDF_FOLDER, { recursive: true });
    }
    try {
      
     
      const files = await fs.readdir(PDF_FOLDER);
      res.render('list', { files ,username });
    } catch (err) {
      res.status(500).render("list",{errors:err.message, username});
    }
  },
  delete: async (req, res) => {
    try {
      const username = req.params.username;
      const PDF_FOLDER = path.join(__dirname, '..', 'public', username, 'pdfs');
      const { filename } = req.params;
      await fs.unlink(path.join(PDF_FOLDER, filename));
      res.redirect(`/user/${username}/uploads`);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
  download: (req, res) => {
    const { filename } = req.params;
    const username = req.params.username; 
    const PDF_FOLDER = path.join(__dirname, '..', 'public', username, 'pdfs');
    res.download(path.join(PDF_FOLDER, filename));
  },
  view: (req, res) => {
    const { filename , username } = req.params;
    const PDF_FOLDER = path.join(__dirname, '..', 'public', username, 'pdfs');
    res.sendFile(path.join(PDF_FOLDER, filename));
  },
  renameForm: async (req, res) => {
    const username = req.params.username;
    const { filename } = req.params;
    res.render('rename', { filename,  username });
  },


  rename: async (req, res) => {
    const username = req.params.username;
    const { oldFilename } = req.params;
    const newFilename = req.body.newFilename;
    const PDF_FOLDER = path.join(__dirname, '..', 'public', username, 'pdfs');
    const oldPath = path.join(PDF_FOLDER, oldFilename);
    const newPath = path.join(PDF_FOLDER, newFilename);

    try {
      await fs.rename(oldPath, newPath);
      res.redirect(`/user/${username}/uploads`);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
};


module.exports = HomeController;