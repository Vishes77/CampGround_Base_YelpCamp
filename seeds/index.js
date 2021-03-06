const { request, response } = require('express');
const mongoose = require('mongoose');
const campground = require('../models/campgrounds');
const cities = require('./cities');
const {places , descriptors} = require('./seedHelpers');
// const req = require('request');
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser : true,
    useUnifiedTopology:true
});


const db = mongoose.connection;
db.on('error',console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("Database Connected.")
})

const sample = array => array[Math.floor(Math.random()*array.length)]


const seedDb = async () =>{
    await campground.deleteMany({});
    for(let i=0;i<50;i++){
        const Price = Math.floor(Math.random()*20) + 10 
        const random1000 = Math.floor(Math.random()*1000)
        const camp = new campground({
            author : '618a9c64b5374e27a799b12e',
            location: `${cities[random1000].city} , ${cities[random1000].state}`,
            tittle: `${sample(descriptors)} ${sample(places)}`,
            // image : 'https://source.unsplash.com/random',
            // https://source.unsplash.com/collections/483251
            // 'https://source.unsplash.com/random',
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatibus ullam ut sunt, neque iure repellat. Dolor sunt magnam aliquam repell.',
            price : Price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images : [
                {
                    url: 'https://res.cloudinary.com/dalt2i8bs/image/upload/v1636666230/YelpCamp/uare3jy3fs6a9tyyiz7l.jpg',
                    filename: 'YelpCamp/uare3jy3fs6a9tyyiz7l'
                },
                {
                    url: 'https://res.cloudinary.com/dalt2i8bs/image/upload/v1636666478/YelpCamp/mlyii0ab6y6jiv3dbexl.jpg',
                    filename: 'YelpCamp/mlyii0ab6y6jiv3dbexl'
                }
            ]
        })
        await camp.save();
    }
}
seedDb().then(() => {
    mongoose.connection.close();
})