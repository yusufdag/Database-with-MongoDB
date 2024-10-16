
const express=require('express');
const {connectToDb,getDb}=require('./db.js');
const { ObjectId } = require('mongodb');


const app=express();

app.use(express.json())

let db;

connectToDb((err)=>{

    if (!err) {
        app.listen(3000, ()=>{
            console.log('Uygulama 3000. portta calısıyor');
        })
        db=getDb()
    }
})


// Data Extraction - // Pagination Structure
app.get('/api',(req,res)=>{
    let kitaplar=[];

    const sayfa=req.query.s || 0
    const sayfaVeriAdet=3;

    db.collection('kitaplar')
        .find()
        .skip(sayfa*sayfaVeriAdet)
        .limit(sayfaVeriAdet)
        .forEach(kitap=>kitaplar.push(kitap))
        .then(()=>{
            res.status(200).json(kitaplar)
        })
        .catch(()=>{
            res.status(500).json({hata:'Verilere erisilemedi.'})
        })
})


// Data Insert
app.post('/api',(req,res)=>{
    const kitap=req.body;

    db.collection('kitaplar')
        .insertOne(kitap)
        .then(sonuc=>{
            res.status(201).json(sonuc)
        })
        .catch(err=>{
            res.status(500).json({hata:'Veri eklenemedi.'})
        })
})


// Data Deletion
app.delete('/api/:id',(req,res)=>{


    if(ObjectId.isValid(req.params.id)) {
        db.collection('kitaplar')
            .deleteOne({_id: new ObjectId(req.params.id)})
            .then(sonuc=>{
                res.status(200).json(sonuc)
            })
            .catch(err=>{
                res.status(500).json({hata:'Veri silinemedi.'})
            })
    }else{
        res.status(500).json({hata:'ID gecerli degil'})
    }

})


// Fetching Data by ID
app.get('/api/:id',(req,res)=>{
    
    if(ObjectId.isValid(req.params.id)) {
        db.collection('kitaplar')
            .findOne({_id: new ObjectId(req.params.id)})
            .then(sonuc=>{
                res.status(200).json(sonuc)
            })
            .catch(err=>{
                res.status(500).json({hata:'Veri erisilemedi.'})
            })
    }else{
        res.status(500).json({hata:'ID gecerli degil'})
    }
})


// Data Update
app.patch('/api/:id',(req,res)=>{
    const guncellenecekveri=req.body;

    if(ObjectId.isValid(req.params.id)) {
        db.collection('kitaplar')
            .updateOne({_id: new ObjectId(req.params.id)},{$set:guncellenecekveri})
            .then(sonuc=>{
                res.status(200).json(sonuc)
            })
            .catch(err=>{
                res.status(500).json({hata:'Veri guncellenemedi.'})
            })
    }else{
        res.status(500).json({hata:'ID gecerli degil'})
    }
    
})


/* app.get('/api',(req,res)=>{
    res.json({mesaj:'Kitap API 2'})
}) */