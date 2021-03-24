const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const PORT = process.env.PORT || 3030


//Assets
app.use(express.static('public'));

//home route
app.get('/',(req,res)=>{
    res.render('home.ejs');
});


// set template engine
app.use(expressLayout);
app.set('views',path.join(__dirname,'/resources/views'));
app.set('view engine' , ejs);


app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`);
});