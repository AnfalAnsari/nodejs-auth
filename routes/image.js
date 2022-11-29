const router = require("express").Router();
router.post( "/", (req, res)=>{
  
    // GETTING THE FILE

    if(!req.files)
    return res.status(400).send({message: "Bad request", status: 400})

    const image = req.files.image;

    // IF IMAGE IS NOT SUBMITTED
    if (!image) return res.status(400).send({message: "Please Upload a file", status: 400});

    // CHECK IF FILE IS IMAGE 
    let pattern = /^image/;
    if (!pattern.test(image.mimetype)) return res.status(400).send({message: "Improper file format", status: 400});

    // MOVING THE FILE IN UPLOAD FOLDER
    image.mv(__dirname + '/../images/' + image.name, (err) => {
     if(err) return res.status(500).send({message: "Internal Server Error", status: 500})

     // SUCCESSFUL RESPONSE
     return res.status(200).send({
        message: "Success",
        image_id: image.name,
        status: 200
     });

    });
})
module.exports = router;