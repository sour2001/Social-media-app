const nodemailer=require('../config/nodemailer');


// this is another way of exporting a method
exports.newComment=(comment)=>{
    console.log('inside new comment mailer');
    let htmlString=nodemailer.renderTemplate({comment:comment},'/comments/new_comment.ejs');
    nodemailer.transporter.sendMail({
        from:'saurabhdahiya2@outlook.com',
        to:comment.user.email,
        subject:"New comment published!",
        html:htmlString
    },(err,info)=>{
        if(err){
            console.log('error in sending mail',err);
            return;
        }
        console.log('Message sent',info);
        return;
    }
    );
}

module.exports=exports;
