var nodemailer = require('nodemailer');

var jsdom = require("jsdom");

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'nishanksingla@gmail.com',
        pass: '!1998nishank'
    }
});


jsdom.env("assets/VerifyEmailTemplate.html", ["js/jquery-1.11.1.min.js"], function (errors, window) {


    console.log('errors');
    console.log(errors);
    
    var $ = window.$;

    $('.verify').attr('href', 'http://www.foodcopac.com/Thankyou.html?email=' + 'nishank.singla@sjsu.edu');
    $('.link').attr('href', 'http://www.foodcopac.com/Thankyou.html?email=' + 'nishank.singla@sjsu.edu');
    $('.link').text('http://www.foodcopac.com/Thankyou.html?email=' + 'nishank.singla@sjsu.edu');

    console.log($('.link').text());

    var mailOptions = {
        from: 'support@foodcopac.com', // sender address
        to: 'nishank.singla@sjsu.edu',
        subject: 'Thank You for Registration to FoodCoPac',
        html: window.document.documentElement.outerHTML
    };

    console.log('checkpoint 2');
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('error sending email');
            console.log(error);
            //res.json(error);
            //return;
        }

        console.log('checkpoint 3 after sending email');
        console.log('after error if ');
        //res.json({ status: 'Success' });
        //return;

    });
});