const mongoose=require('mongoose');
const cities=require('./cities');
const {places,descriptors}=require('./seedhelper');
const campground=require('../models/campground');
mongoose.connect('mongodb://localhost:27017/yelpcamp');


const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("DATABASE CONNECTION");
})


const sample=(array)=>{
    return array[Math.floor(Math.random()*array.length)];
}
const seeddb=async()=>{
    await campground.deleteMany({});
    for(let i=0;i<50;++i){
        const random1000=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*20)+10;
        const camp=new campground({
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title:`${sample(descriptors)} , ${sample(places)}`,
            image:'https://source.unsplash.com/collection/P3DxOe-OJGA',
            description:'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...',
            price:price
        })
        await camp.save();
    }
}
seeddb().then(()=>{
    mongoose.connection.close();
});


