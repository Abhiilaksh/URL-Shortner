const express = require('express');
const cors = require('cors');
const urlDB =require('./db')
const {nanoid} =require('nanoid')
const mongoose=require('mongoose')

const app = express();

app.use(cors());
app.use(express.json());

app.post('/shorten',async(req,res)=>{
    const {url}=req.body;
    const shortCode = nanoid(7);
    const newUrl = await urlDB.create({ originalUrl: url, shortUrl:shortCode });
   
    res.json({msg:"Url Shortened",
        shortUrl:`http://localhost:3000/${shortCode}`
    })

})

app.get("/:shortCode",async(req,res)=>{
const {shortCode}=req.params;
    const urlPresent=await urlDB.findOne({shortUrl:shortCode});

    if(!urlPresent){
        res.json("Not Present");
    }
    res.redirect(urlPresent.originalUrl)
})

app.listen(3000,()=>{
    console.log("Running on http://localhost:3000")
})