const express=require('express');
const mongoose=require('mongoose');
const path=require('path');
const campgroundschema=require('./schema');
const methodoverride=require('method-override');
const campground=require('./models/campground');
const catchasync=require('./utils/catchasync');
const ExpressError=require('./utils/expresserror')
const ejsmate=require('ejs-mate');
const joi=require('joi');
mongoose.connect('mongodb://localhost:27017/yelpcamp');


const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("DATABASE CONNECTION");
})


const app=express();

app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(methodoverride('_method'));
app.engine('ejs',ejsmate)


const validatecampground=(req,res,next)=>{
    const {error}=campgroundschema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join('.');
        throw new ExpressError(msg,400);
    }
    else{
        next();
    }
}


app.get('/',(req,res)=>{
    res.render('home');
})
app.get('/campground',catchasync(async (req,res)=>{
    const campgrounds=await campground.find({});
    res.render('campgrounds/index',{campgrounds});
}))

app.post('/campground',validatecampground, catchasync(async(req,res,next)=>{
    const ground=new campground(req.body.campground);
    await ground.save();
    res.redirect(`/campground/${ground._id}`);
}))


app.get('/campground/new',(req,res)=>{
    res.render('campgrounds/new');
})
app.get('/campground/:id',catchasync(async (req,res)=>{
    const ground=await campground.findById(req.params.id);
    res.render('campgrounds/show',{ground});
}))
app.delete('/campground/:id',catchasync(async (req,res)=>{
    const {id}=req.params;
    await campground.findByIdAndDelete(id);
    res.redirect('/campground');
}))
app.get('/campground/:id/edit',catchasync(async (req,res)=>{
    const {id}=req.params;
    const ground=await campground.findById(id);
    res.render('campgrounds/edit',{ground});
}))

app.put('/campground/:id',validatecampground,catchasync(async (req,res)=>{

    const {id}=req.params;
    const hello=await campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campground/${hello._id}`);
}))


// this is basically called when nothing above routes are called
// app.all('*',(req,res,next)=>{
//     res.send('404!!!');
// })

app.all('*',(req,res,next)=>{
    next(new ExpressError('page not found',404));
})
app.use((err,req,res,next)=>{
    const {statuscode=500}=err;
    if(!err.message){
        err.message="oh no , something went wrong";
    }
    res.status(statuscode).render('error',{err});
})
app.listen(3000,()=>{
    console.log('Serving on port 3000')
})