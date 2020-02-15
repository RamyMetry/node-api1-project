const express =require('express')
const server=express();
server.use(express.json());
const db=require("./data/db.js")

const port=5000;
const hostname="localhost"



server.get('/api/users',(req,res)=>{
    db.find()
    .then(users=>res.json(users))
    .catch(err=>res.status(500).json({errMessage:"The users information could not be retrieved."}))
})


server.get('/api/users/:id',(req,res)=>{
    const id =req.params.id
    db.findById(id)
        .then(user=>{if(user){
            res.json(user)
        }else{
            res.status(404).json({message:"The user with the specified ID does not exist."})
        }})     
})



server.post('/api/users',(req,res)=>{
    const {name,bio}=req.body
    db.insert(req.body)
    .then(user=>{
        if(!name||!bio){
            res.status(400).json({errorMessage: "Please provide name and bio for the user." }) 
        }else res.status(201).json(user)
    })
    .catch(err=>res.status(500).json({errorMessage: "There was an error while saving the user to the database"}))
})



server.delete("/api/users/:id",(req,res)=>{
    
    db.remove(req.params.id)
    .then(user=>{if(user>0){
        res.status(200).json({ message: "Deleted" })
    }else if(!user.id) {
        res.status(404).json({message:'The user with the specified ID does not exist.'})
    }
})
    .catch(err=>res.status(500).json({ errorMessage: "The user could not be removed" }))
})



server.put('/api/users/:id', (req,res)=>{
    const {name,bio}=req.body
    db.findById(req.params.id)
    .then(user=>{
        if(!user){
             return res.status(404).json({ message: "The user with the specified ID does not exist."})
        }else {
        db.update(req.params.id,req.body)
        .then(user=>{if(!name||!bio){
            res.status(400).json({errorMessage: "Please provide name and bio for the user."})
        }else{
            res.status(200).json(user)
        }
    }).catch(err=>res.status(500).json({ errorMessage: "The user information could not be modified." }))
    }
}) 
})



server.listen(port,()=>{
    console.log(`server runnig at http://${hostname}:${port}`)
})
