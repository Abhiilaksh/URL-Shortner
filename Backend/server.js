const express = require('express');
const cors = require('cors');
const urlDB =require('./db')
const {nanoid} =require('nanoid')
const app = express();
const QRCode = require("qrcode");

app.use(cors());
app.use(express.json());

app.post('/shorten',async(req,res)=>{
    try{
        const {url}=req.body;
    const shortCode = nanoid(5);
    const newUrl = await urlDB.create({ originalUrl: url, shortUrl:shortCode });
   
    res.json({msg:"Url Shortened",
        shortUrl:`https://babyurl.xyz/${shortCode}`
    })
    }
    catch{
        res.json({msg:"Url Not Given"})
    }

})

app.get("/:shortCode",async(req,res)=>{
const {shortCode}=req.params;
    const urlPresent=await urlDB.findOne({shortUrl:shortCode});

    if(!urlPresent){
        res.json("Not Present");
    }
    res.redirect(urlPresent.originalUrl)
})


app.post("/generate-qr",async(req,res)=>{
    const{shortUrl}=req.body;

    if(!shortUrl){
        return res.status(400).json({
            error:"Short url is required"
        })
    }

    try{
        const qrCodeDataurl=await QRCode.toDataURL(shortUrl);
        res.json({
            qrCode:qeCodeDataurl
        });
    }
    catch(error){
        res.status(500).json({error:"Error generating QR Code"})
    }
})
app.listen(3000,()=>{
    console.log("Running on http://localhost:3000")
})
