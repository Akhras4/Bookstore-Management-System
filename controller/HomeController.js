const fs = require('fs-extra');
const path = require('path');
const users = require("../models/user");
const books = require("../models/book");

const PDF_FOLDER = path.join(__dirname, '..', 'public', 'pdfs');
const IMAGES_FOLDER = path.join(__dirname, '..', 'public', 'images');



const HomeController = {
  index: (req, res) => {
    const userid = req.params.id;
    users.findOne({_id:userid}) 
    .then(user=>{books.find({})
         .then(books=>{res.render(`index`,{userid,books,errors:null,username:user.UserName});})
         .catch(err=>{res.render('index',{ userid,books });})
    }).catch(err=>{res.render('index',{userid })})
    
  },
  
  upload: (req, res) => { 
    if (req.method==="POST"){ 
     if (req.uploadError) {
      const userid  = req.params.id
      console.log(req.params)
        return res.status(401).render("index", { errors: req.uploadError, userid  });
    }else {
     const userid = req.params.id;
     const { title, description } = req.body;
     const pdfPath = req.files['pdf'][0].path
     const imagePath= req.files['image'][0].path
     console.log(req.params)
     const newbook=new books({
      user_id:userid,
      title:title,
      description:description,
      pdfPath:pdfPath,
      imagePath:imagePath
     })
     newbook.save()
     .then(() => {
         return users.findById(userid);
     })
     .then(user => {
         if (!user) {
             throw new Error("User not found");
         }
         user.books.push(newbook);
         return user.save();
     })
     .then(() => {
         res.redirect(`/user/${userid}`);
     })
     .catch(error => {
         res.status(500).send('Internal server error');
     });
}
}},

openPdf: (req, res) => {
  try {
    const pdfPath = req.params.pdfPath;
    const fullPath = path.join(__dirname, '..', 'public', 'pdfs', pdfPath);
    res.sendFile(fullPath);
  } catch (error) {
    console.error(error);
    res.status(404).send('File not found');
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