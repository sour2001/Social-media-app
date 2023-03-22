const nodemailer=require('nodemailer');
const ejs=require('ejs');
const path=require('path');


let transporter=nodemailer.createTransport({
    service:'outlook',
    host:'smtp.outlook.com',
    port:587,
    secure:false,
    auth:{
        user:'saurabhdahiya2@outlook.com',
        pass:'Dahiya@1234'
    }
});

let renderTemplate=(data,relativePath)=>{
    let mainHTML;
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),
        data,
        function(err,template){
            if(err){
                console.log('error in rendering template',err);
                return;
            }
            mainHTML=template;
        }
    )
    return mainHTML;
}

module.exports={
    transporter:transporter,
    renderTemplate:renderTemplate
}





