const mongoose=require('mongoose')
const db_liveurl = 'mongodb+srv://uk1735008:umesh123@cluster0.j2kdqas.mongodb.net/grievanceportal?retryWrites=true&w=majority'
const local_url = 'mongodb://127.0.0.1:27017/grievanceportal'

const connectdb = ()=>{
    return mongoose.connect(db_liveurl)
    .then(()=>{
        console.log('connection succesfully')

    }).catch((error)=>{
        console.log(error)     
    })
}

module.exports= connectdb