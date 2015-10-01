var express = require('express');
var path = require('path');
var session = require('client-sessions');
var serveStatic = require('serve-static');
var mongoose = require('mongoose');
var textSearch = require('mongoose-text-search');
var bodyParser = require('body-parser');
var logger = require('morgan');
var formidable = require('formidable');
var fs = require('fs');
var nodemailer = require('nodemailer');
var compression = require('compression');
var _ = require('underscore');
_.str = require('underscore.string');
_.mixin(_.str.exports());

var jsdom = require("jsdom");

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'nishanksingla@gmail.com',
        pass: '!1998nishank'
    }
});


var crypto = require('crypto'),
algorithm = 'aes-256-ctr',
password = 'd6F3Efeq';


var app = express();
var port = process.env.PORT || 80;
var router = express.Router();
// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(__dirname + '/LogFile.log', { flags: 'a' });

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    cookieName: 'session',
    secret: 'nhbshbadkjenfiaeideacbeyaekcaejhaidj',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    httpOnly: true,
    ephemeral: true
}));

app.use(function (req, res, next) {
    res.header({ 'X-Powered-By': 'FoodCoPac' });
    next();
});


app.use(function (req, res, next) {
    console.log(req.url);
    var array = req.url.split('/');

    if (array[1].indexOf('.html') > 0 && array.length === 2) {
        res.redirect([req.url.slice(0, 1), '#', req.url.slice(1)].join(''));
    } else {
        next();
    }


})

app.use(serveStatic(__dirname + '/assets', { 'maxAge': '1y' }));
app.use(serveStatic(__dirname + '/app', { 'maxAge': 0 }));



app.use(logger('combined', { stream: accessLogStream }));
mongoose.connect('mongodb://54.200.211.174:27017/newNishank');
console.log("Connected to MongoDB");

var productSchema = mongoose.Schema({
    category: String,
    name: String,
    feature: Array,
    size: String,
    packagingType: String,
    imgsrc: String,
    comID: Array
});

productSchema.plugin(textSearch);

var productModel = mongoose.model('product', productSchema, 'ProductDB');

//------------------------------------------------------------------------------------------------------
var companySchema = mongoose.Schema({
    ComName: String,
    ComAddress: String,
    ComCity: String,
    ComZip: Number,
    ComState: String,
    ComCountry: String,
    AboutCompany: String,
    ComCap: String,
    Certificates: Array,
    CertiBody: String,
    otherdocs: Array,
    ContactName: String,
    ContactAddress: String,
    ContactCity: String,
    ContactZip: Number,
    ContactState: String,
    ContactCountry: String,
    PrimaryNumber:String,
    MobileNumber: Number,
    OfficeNumber: Number,
    FaxNumber: Number,
    ContactEmail: { type: String, required: true, index: { unique: true } },
    Password: { type: String, required: true },
    Products: Array,
    URL: String,
    Industry: String,
    Logo: String,
    Status: String
});

companySchema.plugin(textSearch);

var companyModel = mongoose.model('company', companySchema, 'CompanyDB');


var filterSchema = mongoose.Schema({
    productlist: {},
    packagingType: Array
});

var filterModel = mongoose.model('filter', filterSchema, 'Filters');


//----------------------------------------------------------------------------------------

router.get('/', function (req, res) {
    res.json({ message: 'yeah ! it is working...' });
});

router.get('/getLoginStatus', function (req, res) {
    if (!res.getHeader('Cache-Control'))
        res.setHeader('Cache-Control', 'public, max-age=86400');

    res.statusCode=200
    var data = {};
    if (req.session && req.session.user) {
        data.status = 'login';
        data.userData = req.session.user;
        delete data.userData.Password;
    } else {
        data.status = 'logout';
    }
    filterModel.find(function (err, filters) {
        if (err)
            res.send(err);
        data.filters = filters[0];
        res.json(data);
    });
    
});

router.get('/logout', function (req, res) {
    req.session.reset();
    res.json({ status: 'logout' });
});

router.get('/filters', function (req, res) {
    //if (!res.getHeader('Cache-Control'))
    //    res.setHeader('Cache-Control', 'public, max-age=86400');

    //res.statusCode=200

    filterModel.find(function (err, filters) {
        if (err)
            res.send(err);

        res.send(filters[0]);
    });
});

router.get('/product', function (req, res) {
    //if (!res.getHeader('Cache-Control')) 
    //    res.setHeader('Cache-Control', 'public, max-age=86400');
    var data = {};
    productModel.find(function (err, products) {
        if (err)
            res.send(err);
        data.products = products;
        filterModel.find(function (err, filters) {
            if (err)
                res.send(err);
            data.filters = filters;
            res.json(data);
        });
    });
});

router.get('/search/:text', function (req, res) {
    var searchQuery = req.params.text.trim();
    console.log(searchQuery);
    if (searchQuery.toLowerCase().indexOf("oz") > 0 || searchQuery.toLowerCase().indexOf("ounce") > 0) {
        var strArray = searchQuery.match(/(\d+)/g);
        searchQuery = searchQuery.replace(/\d+/g, '');
        searchQuery = searchQuery.toLowerCase().replace('oz', '').trim();
        searchQuery = searchQuery.toLowerCase().replace('ounce', '').trim();
        var num = strArray[0];

        if (num >= 1 && num <= 8) {
            sizeParam = "1 to 8 Oz";
        } else if (num >= 9 && num <= 16) {
            sizeParam = "9 to 16 Oz";
        }
        else if (num >= 17 && num <= 32) {
            sizeParam = "17 to 32 Oz";
        }
        else if (num >= 33 && num <= 127) {
            sizeParam = "33 to 127 Oz";
        }
    }

    if (searchQuery.toLowerCase().indexOf("gal") > 0) {
        var strArray = searchQuery.match(/(\d+)/g);
        searchQuery = searchQuery.replace(/\d+/g, '');
        searchQuery = searchQuery.toLowerCase().replace('gallon', '').trim();
        searchQuery = searchQuery.toLowerCase().replace('gal', '').trim();
        var sizeParam = "";
        var num = strArray[0];
        var sizeParam = "";
        if (num >= 1 && num <= 5) {
            sizeParam = "1 to 5 gal";
        } else if (num > 5) {
            sizeParam = "More than 5 gal";
        }
    }
    console.log(searchQuery);
    var text = searchQuery.split(' ');
    if (sizeParam) {
        text.push(sizeParam);
    }
    var searchtext = "";
    for (i in text) {
        if (text[i]) {
            searchtext = searchtext + "\"" + text[i] + "\" ";
        } else {
            text.splice(i, 1);
        }
    }
    console.log(searchtext);
    var result = {};
    productModel.textSearch(searchtext, function (err, output) {
        if (err) {
            res.send(err);
            return;
        }
        result.product = output.results;
        result.query = text;
        companyModel.textSearch(searchtext, function (err, output) {
            if (err) {
                res.send(err);
                return;
            }
            result.company = output.results;

            res.json(result);
            return;
        });
        //res.json(output);
        //return;
    });
});

router.get('/companies', function (req, res) {
    //if (!res.getHeader('Cache-Control'))
    //    res.setHeader('Cache-Control', 'public, max-age=86400');

    var data = {};
    companyModel.find(function (err, companies) {
        if (err)
            res.send(err);
        data.companies = companies;
        res.json(data);
    });
});

router.get('/product/:query', function (req, res) {
    var query = JSON.parse(req.params.query);

    console.log(query);
    var finalquery = {
        "$or": []
    };
    for (var item in query['category']) {
        var newquery = { "category": "" };
        newquery["category"] = item;
        if (query['category'][item].length !== 0) {
            newquery["name"] = { "$in": [] };
            newquery["name"]["$in"] = query['category'][item];
        }
        finalquery["$or"].push(newquery);
    }
    if (query["size"].length !== 0) {
        finalquery["size"] = { "$in": [] };
        finalquery["size"]["$in"] = query["size"];
    }
    if (query["packagingType"].length !== 0) {
        finalquery["packagingType"] = { "$in": [] };
        finalquery["packagingType"]["$in"] = query["packagingType"];
    }
    if (finalquery["$or"].length === 0) {
        delete finalquery["$or"];
    }
    console.log(finalquery);
    productModel.find(finalquery, function (err, products) {
        if (err) {
            res.send(err);
            return;
        }
        res.json(products);
        return;
    });

});

router.get('/getproduct/:ComId', function (req, res) {
    var id = req.params.ComId;
    productModel.find({ comID: { $elemMatch: { ID: id } } }, { comID: { $elemMatch: { ID: id } }, category: 1, name: 1, feature: 1, size: 1, packagingType: 1, _id: 1 }, function (err, product) {
        if (err) {
            console.log(err);
        }
        res.json(product);
        return;
    });
});

router.get('/Companies/:ComId', function (req, res) {
    var id = req.params.ComId;
    companyModel.findById(id, function (err, company) {
        if (err)
            res.json(err);
        var data = {};

        data.company = company;
        console.log('checkpoint 1');
        if (company.Products.length > 0) {
            productModel.find({ _id: { $in: company.Products } }, function (err, products) {
                console.log('checkpoint 2');
                data.products = products;
                res.send(data);
            });
        } else {
            res.send(data);
        }
    });
});

router.get('/MyCompanyData', function (req, res) {
    var data = {};
    if (req.session && req.session.user) {
        companyModel.findOne({ ContactEmail: req.session.user.ContactEmail }, function (err, company) {
            data.company = company;
            if (company.Products.length > 0) {

                productModel.find({ _id: { $in: company.Products } }, function (err, products) {
                    console.log('checkpoint 2');
                    data.products = products;
                    res.send(data);
                });

            } else {
                res.send(data);
            }
        })
    } else {
        data.status = 'logout';
        res.json(data);
    }
});

router.get('/companyFilters/:comQuery', function (req, res) {
    var data = {};

    var query = JSON.parse(req.params.comQuery);
    var cert = query.certificate;
    console.log(cert);
    var certificate = {};
    var comQuery = [];
    for (i in cert) {
        certificate['Certificates.name'] = cert[i];
        comQuery.push(certificate);
        certificate = {};
    }
    if (query.state.length !== 0) {
        var state = { ComState: { $in: query.state } };
        console.log(state);
        comQuery.push(state)
    }
    console.log('query');
    console.log(comQuery);
    companyModel.find({ $and: comQuery }, function (err, comList) {
        if (err) {
            res.json(err);
            return;
        }
        console.log(comList);
        data.companies = comList;
        res.json(data);
        return;
    });
});

router.get('/getCompanies/:productId', function (req, res) {
    //if (!res.getHeader('Cache-Control'))
    //    res.setHeader('Cache-Control', 'public, max-age=86400');

    var data = {};
    var id = req.params.productId;
    console.log(typeof id);
    console.log('ProductID: ' + id);

    companyModel.find({ 'Products': id }, function (err, companies) {
        if (err) {
            res.json(err);
            return;
        }
        data.companies = companies;
        res.json(data);
        return;
    });
});

router.get('/deleteproduct/:companyID/:productID', function (req, res) {
    console.log('companyID: ' + req.params.companyID);
    console.log('productID: ' + req.params.productID);
    productModel.findByIdAndUpdate(req.params.productID, { $pull: { comID: { ID: req.params.companyID } } }, function (err, product) {
        if (err) {
            res.json(err);
            return;
        }
        companyModel.findByIdAndUpdate(req.params.companyID, { $pull: { Products: req.params.productID } }, function (err, product) {
            if (err) {
                res.json(err);
                return;
            }
            res.json({ message: 'success' });
            return;
        });
    });
});

router.get('/VerifyAccount/:email', function (req, res) {
    console.log();

    var decipher = crypto.createDecipher(algorithm, password)
    var decryptedEmail = decipher.update(req.params.email, 'hex', 'utf8')
    decryptedEmail += decipher.final('utf8');

    companyModel.findOneAndUpdate({ ContactEmail: decryptedEmail }, { Status: 'Verified' }, function (err, company) {
        if (err) {
            res.json(err);
            return;
        }
        res.json({ message: 'success' });
        return;
    });
});

//-------Login------------------------------------------------------------------------
router.post('/login', function (req, res) {
    console.log('login');
    console.log("username: " + req.body.username);
    console.log("password: " + req.body.password);
    var query = {};
    query.ContactEmail = req.body.username;
    console.log(query);
    companyModel.findOne(query, 'ContactEmail Password ComName Status _id', function (err, user) {
        if (err) {
            console.log("error");
            res.send(err);
            return;
        }
        if (!user) {
            console.log('No user exists');
            res.json({ message: 'NotExists' });
        } 
        else if (user.Status || user.Status !== undefined) {
            if (user.Status === 'NotVerified') {
                console.log('User Not Verified');
                res.json({ message: 'NotVerified' });
                res.end()
            }
        }
        else if (req.body.password === user.Password) {
            req.session.user = user;
            console.log(req.session);
            console.log('password correct');
            res.json({ message: 'Exists' });
            res.end()
        } else {
            console.log('Wrong Password');
            res.json({ message: 'Wrong password' });
        }        
    });
});

router.post('/forgotPassword', function (req, res) {
    console.log("username: " + req.body.email);
    companyModel.find({ ContactEmail: req.body.email }, function (err, company) {
        console.log(company);
        if (company.length !== 0) {
            jsdom.env("ForgotPassEmailTemplate.html", ["js/jquery-1.11.1.min.js"], function (errors, window) {
                var $ = window.$;
                $('.forgot').attr('href', 'http://www.foodcopac.com/ResetPassword.html?email=' + req.body.email);
                $('.link').attr('href', 'http://www.foodcopac.com/ResetPassword.html?email=' + req.body.email);
                $('.link').text('http://www.foodcopac.com/ResetPassword.html?email=' + req.body.email);
                console.log($('.link').text());
                var mailOptions = {
                    from: 'support@foodcopac.com', // sender address
                    to: req.body.email,
                    subject: 'Forget Password',
                    html: window.document.documentElement.outerHTML
                };

                console.log('checkpoint 2');
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log('error');
                        console.log(error);
                    } else {
                        console.log(info);
                        console.log('success');
                        res.json({ message: 'success' });
                        return;
                    }
                });
            });
} else {
    console.log('email not found');
    res.json({ message: 'NotFound' });
    return;
}
});
});

router.post('/ResetPassword', function (req, res) {
    console.log(req.body.useremail);
    console.log(req.body.newPassword);
    try {
        companyModel.findOneAndUpdate({ ContactEmail: req.body.useremail }, { Password: req.body.newPassword }, function (err, company) {
            if (err) {
                res.json(err);
                return;
            }
            res.json({ message: 'success' });
            return;
        });
    } catch (ex) {
        console.log(ex.code);
        res.json(ex);
        return;
    };
});

//-------------post company------------------------------------------------------------


router.post('/RegisterCompany', function (req, res) {
    console.log("In register company");
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        console.log('fields: ');
        console.log(fields);

        console.log('files: ');
        console.log(files);

        var register = new companyModel();
        register.ComName = fields.CompanyName;
        register.ComAddress = fields.CompanyAdrress;
        register.ComCity = fields.CompanyCity;
        register.ComZip = fields.CompanyZip;
        register.ComState = fields.CompanyState;
        register.ComCountry = fields.CompanyCountry;
        register.AboutCompany = fields.AboutCompany;
        register.URL = fields.CompanyURL;
        register.Industry = fields.industry;
        register.ComCap = fields.ComCap;
        register.ContactName = fields.ContactName;
        register.ContactAddress = fields.ContactAddress;
        register.ContactCity = fields.ContactCity;
        register.ContactZip = fields.ContactZip;
        register.ContactState = fields.ContactState;
        register.ContactCountry = fields.ContactCountry;

        register.PrimaryNumber=fields.PrimaryNumber;
        register.OfficeNumber = fields.OfficeNumber;
        register.MobileNumber = fields.MobileNumber;
        
        // if (fields.PhoneNumber !== 'null') {
        //     register.PhoneNumber = fields.PhoneNumber;
        // }
        if (fields.FaxNumber !== 'null') {
            register.FaxNumber = fields.FaxNumber;
        }

        register.ContactEmail = fields.ContactEmail;
        register.Password = fields.Password;
        register.Status = 'NotVerified';

        try {
            fs.mkdirSync("assets/Companies/" + fields.CompanyName);
            fs.mkdirSync("assets/Companies/" + fields.CompanyName + "/Documents/");
        } catch (ex) {
            console.log(ex.code);
            res.json(ex);              //CHECK ERROR
            return;
        };
        var CompaniesLogo = files.file;

        if (CompaniesLogo.name) {
            var logoImagePath = "assets/Companies/" + fields.CompanyName + "/" + CompaniesLogo.name;
            fs.renameSync(CompaniesLogo.path, logoImagePath);
            register.Logo = logoImagePath;
        }

        register.Certificates = fields.certificates;

        register.save(function (err) {
            if (err) {
                console.log(err);
                res.json(err);
                return;
            }
            console.log('checkpoint 1 before sending email');

            jsdom.env("assets/VerifyEmailTemplate.html", ["js/jquery-1.11.1.min.js"], function (errors, window) {
                console.log('errors');
                console.log(errors);
                if (errors) {
                    res.json(errors);    //CHECK ERROR
                    return;
                }

                var $ = window.$;

                var cipher = crypto.createCipher(algorithm, password);
                var cryptedEmail = cipher.update(fields.ContactEmail, 'utf8', 'hex');
                cryptedEmail += cipher.final('hex');

                $('.verify').attr('href', 'http://www.foodcopac.com/Thankyou.html?email=' + cryptedEmail);
                $('.link').attr('href', 'http://www.foodcopac.com/Thankyou.html?email=' + cryptedEmail);
                $('.link').text('http://www.foodcopac.com/Thankyou.html?email=' + cryptedEmail);
                $('#ContactName').text(fields.ContactName);
                console.log($('.link').text());

                var mailOptions = {
                    from: 'support@foodcopac.com', // sender address
                    to: fields.ContactEmail,
                    subject: 'Thank You for Registration',
                    html: window.document.documentElement.outerHTML
                };

                console.log('checkpoint 2');
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log('error sending email');
                        console.log(error);
                        res.json(error);               //CHECK ERROR
                        return;
                    }

                    console.log('checkpoint 3-- after sending email');
                    res.json({ status: 'Success' });
                    return;

                });
            });

});
});
});

router.post('/addproduct', function (req, res) {
    console.log('uploading file...');

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var query = {};
        console.log('fields: ');
        console.log(fields);

        var file = files.file;

        var imgPath = "Companies/" + req.session.user.ComName + "/" + file.name;

        console.log('image path: ' + imgPath);

        if (fs.existsSync(imgPath)) {
            console.log('image exists');
            res.json({ message: 'image exists' });
            return;
        }

        filterModel.find(function (err, filters) {
            if (err) {
                res.send(err);
                return;
            }
            //console.log(filters.productlist['Bakery']);
            if (fields.Category === 'Other') {
                if (filters[0].productlist[fields.otherCategory]) {        //if category exists in filters[0] then check the product name exists in the array or not
                    console.log('inside category if');
                    console.log(_.indexOf(filters[0].productlist[fields.otherCategory], fields.otherName));

                    if (_.indexOf(filters[0].productlist[fields.otherCategory], fields.otherName) === -1) {
                        filters[0].productlist[fields.otherCategory].push(_.capitalize(fields.otherName));
                    }
                } else {         // if category does not exists in filters[0]
                    filters[0].productlist[_.capitalize(fields.otherCategory)] = [];
                    console.log('inside category else');

                    filters[0].productlist[_.capitalize(fields.otherCategory)].push(_.capitalize(fields.otherName));

                    console.log(filters[0].productlist[fields.otherCategory]);
                }
            } else if (fields.otherName) {
                console.log('inside name else if');
                console.log(filters[0].productlist[fields.Category]);

                if (_.indexOf(filters[0].productlist[fields.Category], fields.otherName) === -1) {
                    console.log('underscore inside name if');

                    filters[0].productlist[fields.Category].push(_.capitalize(fields.otherName));
                }
            }
            if (fields.otherPackaging) {
                console.log('inside packaging if');
                if (_.indexOf(filters[0].packagingType, fields.otherPackaging) === -1) {
                    console.log('underscore inside packaging if');
                    filters[0].packagingType.push(_.capitalize(fields.otherPackaging));
                }
            }

            filterModel.findByIdAndUpdate(filters[0]._id, { $set: { productlist: filters[0].productlist, packagingType: filters[0].packagingType } }, function (err) {
                if (err) {
                    console.log("error updating filters");
                    res.json(err);
                    return;
                }
                console.log('filters updated!');

            });
        });

console.log("company name: " + req.session.user.ComName);

if (fields.Category === 'Other') {
    var str = fields.otherCategory;
    query.category = str[0].toUpperCase() + str.substring(1);
    str = fields.otherName;
    query.name = str[0].toUpperCase() + str.substring(1);

} else {
    query.category = fields.Category;
    if (fields.otherName && fields.otherName !== '') {
        var str = fields.otherName;
        query.name = str[0].toUpperCase() + str.substring(1);
    }
    else {
        query.name = fields.Name;
    }
}

if (fields.PackagingType === 'Other') {
    var str = fields.otherPackaging;
    query.packagingType = str[0].toUpperCase() + str.substring(1);
} else {
    query.packagingType = fields.PackagingType;
}

console.log('fields.SelectedFeatures');
console.log(typeof (JSON.parse(fields.SelectedFeatures)));

query.size = fields.Size;
query.feature = JSON.parse(fields.SelectedFeatures);
for (i in query.feature) {
    console.log(query.feature[i]);
}
query.comID = { $elemMatch: { ID: req.session.user._id } };

console.log("query: ");
console.log(query);

var info = {};

info.ID = req.session.user._id;
info.imgpath = imgPath;
info.productdesc = fields.ProductDesc;

productModel.findOne(query, function (err, product) {
    if (product) {
        console.log('same product found');
        res.json({ message: 'Exists' });
        return;
    }
    delete query.comID;
    productModel.findOneAndUpdate(query, { $push: { comID: info } }, function (err, updatedproduct) {
        if (err) {
            console.log("error saving new product");
            res.json(err);
            return;
        }
        if (updatedproduct) {
            console.log('updateproduct: ');
            console.log(updatedproduct);
            console.log('product updated');
            try {
                fs.renameSync(file.path, "assets/"+imgPath);
            } catch (ex) {
                console.log(ex.code);
                res.json(ex);
                return;
            };
            companyModel.findByIdAndUpdate(req.session.user._id, { $push: { Products: String(updatedproduct._id) } }, function (err) {
                if (err) {
                    console.log("error updating product array in newcomModel");
                    res.json(err);
                    return;
                }
                console.log('newproduct id pushed in Products Array');
                res.json({ message: 'success' });
                return;
            });
                    //res.json({ message: 'updated' });
                    //return;
                }
                else {
                    var newproduct = new productModel();
                    newproduct.category = query.category
                    newproduct.name = query.name;
                    newproduct.feature = query.feature;                    
                    newproduct.packagingType = query.packagingType;
                    newproduct.size = query.size;
                    newproduct.imgsrc = imgPath;
                    newproduct.comID.push(info);
                    console.log('newproduct:');
                    console.log(newproduct);
                    newproduct.save(function (err) {
                        if (err) {
                            console.log("error saving new product");
                            res.json(err);
                            return;
                        }
                        try {
                            fs.renameSync(file.path, "assets/" + imgPath);
                        } catch (ex) {
                            console.log(ex.code);
                            res.json(ex);
                            return;
                        };
                        companyModel.findByIdAndUpdate(req.session.user._id, { $push: { Products: String(newproduct._id) } }, function (err) {
                            if (err) {
                                console.log("error updating product array in newcomModel");
                                res.json(err);
                                return;
                            }
                            console.log('newproduct id pushed in Products Array');
                            res.json({ message: 'success' });
                            return;
                        });

                        //res.json({ message: 'success' });
                        //return;
                    });
}
});

});
});
});

router.post('/updateproduct', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        console.log('fields: ');
        console.log(fields);
        filterModel.find(function (err, filters) {
            if (err) {
                res.send(err);
                return;
            }
            //console.log(filters.productlist['Bakery']);
            if (fields.productCategory === 'Other') {
                if (filters[0].productlist[fields.otherCategory]) {        //if category exists in filters[0] then check the product name exists in the array or not
                    console.log('inside category if');
                    console.log(_.indexOf(filters[0].productlist[fields.otherCategory], fields.otherName));

                    if (_.indexOf(filters[0].productlist[fields.otherCategory], fields.otherName) === -1) {
                        filters[0].productlist[fields.otherCategory].push(_.capitalize(fields.otherName));
                    }
                } else {         // if category does not exists in filters[0]
                    filters[0].productlist[_.capitalize(fields.otherCategory)] = [];
                    console.log('inside category else');

                    filters[0].productlist[_.capitalize(fields.otherCategory)].push(_.capitalize(fields.otherName));

                    console.log(filters[0].productlist[fields.otherCategory]);
                }
            } else if (fields.otherName) {
                console.log('inside name else if');
                console.log(filters[0].productlist[fields.productCategory]);

                if (_.indexOf(filters[0].productlist[fields.productCategory], fields.otherName) === -1) {
                    console.log('underscore inside name if');

                    filters[0].productlist[fields.productCategory].push(_.capitalize(fields.otherName));
                }
            }
            if (fields.otherPackaging) {
                console.log('inside packaging if');
                if (_.indexOf(filters[0].packagingType, fields.otherPackaging) === -1) {
                    console.log('underscore inside packaging if');
                    filters[0].packagingType.push(_.capitalize(fields.otherPackaging));
                }
            }

            filterModel.findByIdAndUpdate(filters[0]._id, { $set: { productlist: filters[0].productlist, packagingType: filters[0].packagingType } }, function (err) {
                if (err) {
                    console.log("error updating filters");
                    res.json(err);
                    return;
                }
                console.log('filters updated!');

            });
        });
var query = {};
if (fields.productCategory === 'Other') {
    var str = fields.otherCategory;
    query.category = str[0].toUpperCase() + str.substring(1);
    str = fields.otherName;
    query.name = str[0].toUpperCase() + str.substring(1);
} else {
    query.category = fields.productCategory;
    if (fields.otherName !== '') {
        var str = fields.otherName;
        query.name = str[0].toUpperCase() + str.substring(1);
    }
    else {
        query.name = fields.productName;
    }
}
if (fields.packagingType === 'Other') {
    var str = fields.otherPackaging;
    query.packagingType = str[0].toUpperCase() + str.substring(1);
} else {
    query.packagingType = fields.packagingType;
}

query.size = fields.size;
query.feature = [];
for (i in fields) {
    if (fields[i] === 'checked') {
        (query.feature).push(i);
    }
}
query["comID.$.productdesc"] = fields.productdesc;
console.log("query: ");
console.log(query);
if (files.changeimage.name.length === 0) {
    console.log('inside if');
    productModel.update({ _id: fields.productID, "comID.ID": fields.ComID }, { $set: query }, function (err) {
        if (err) {
            res.json(err);
            return;
        }
        res.json({ message: 'success' });
        return;
    });
}
else {
    var imgPath = "Companies/" + fields.ComName + "/" + files.changeimage.name;
    query["comID.$.imgpath"] = imgPath;
    console.log('inside else');
    console.log('image: ' + imgPath);
    productModel.update({ _id: fields.productID, "comID.ID": fields.ComID }, { $set: query }, function (err) {
        if (err) {
            res.json(err);
            return;
        }
                //try{
                    fs.renameSync(files.changeimage.path, imgPath);
                //} catch (ex) {
                //    console.log('inside catch');                                       
                //}
                console.log('image saved');
                res.json({ message: 'success' });
                return;
            });
}
});
});

router.post('/addCertificate', function (req, res) {
    console.log('certArray: ');
    console.log(req.body);
    companyModel.findByIdAndUpdate(req.session.user._id, { $pushAll: { Certificates: req.body } }, function (err) {
        if (err) {
            console.log(err);
            res.json(err);
            return;
        }
        console.log('after error if ');
        res.json({ status: 'Success' });
        return;
    });
});

router.post('/uploadCertificate', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        console.log('fields: ');
        console.log(fields);
        console.log('files: ');
        console.log(files);
        console.log(files.uploadCert.name.split('.').pop());
        try {
            if (fields.certName === 'otherdocs') {
                fs.renameSync(files.uploadCert.path, "Companies/" + fields.ComName + "/Documents/" + files.uploadCert.name);
                companyModel.update({ ComName: fields.ComName }, { $push: { otherdocs: "Companies/" + fields.ComName + "/Documents/" + files.uploadCert.name } }, function (err, doc) {
                    console.log(doc);
                    res.json({ status: 'Success' });
                    return;
                });
            } else {
                var fileName = "Companies/" + fields.ComName + "/Documents/" + fields.certName + 'Certificate.' + files.uploadCert.name.split('.').pop();
                console.log(fileName);
                if (fs.existsSync(fileName)) {
                    fs.unlinkSync(fileName);
                }
                fs.renameSync(files.uploadCert.path, fileName);
                companyModel.update({ ComName: fields.ComName, "Certificates.name": fields.certName }, { $set: { "Certificates.$.path": fileName } }, function (err, doc) {
                    console.log(doc);
                    res.json({ status: 'Success' });
                    return;
                });

            }
        } catch (ex) {
            console.log(ex.code);
            res.json(ex);
            return;
        }
    });
});

router.post('/testUpload', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        console.log('files: ');
        console.log(files);
        console.log('fields: ');
        console.log(fields);
        console.log(files.file.name.split('.').pop());
        try {
            fs.rename(files.file.path, "assets/Companies/" + files.file.name, function (err) {
                if (err) {
                    console.log(err);
                    res.send(err);
                    return;
                }
                res.json({ status: 'Success' });
                return;
            });

        } catch (ex) {
            console.log(JSON.stringify(ex));
            res.json(ex);
            return;
        }
    });
});

router.post('/updateCompanyInfo', function (req, res) {
    var postdata = req.body;
    var id = req.body._id;
    delete postdata['_id'];
    delete postdata['Products'];
    delete postdata['otherdocs'];
    delete postdata['Certificates'];
    console.log(postdata);
    console.log(id);
    companyModel.findByIdAndUpdate(id, { $set: postdata }, function (err, doc) {
        if (err) {
            console.log(err);
            res.send(err);
            return;
        }
        console.log("success");
        res.json({ status: 'Success' });
        console.log("after success");
        return;
    });
});

router.post('/updateContactInfo', function (req, res) {
    var postdata = req.body;
    var id = req.body._id;
    delete postdata['_id'];
    delete postdata['Products'];
    delete postdata['otherdocs'];
    delete postdata['Certificates'];
    console.log(postdata);
    console.log(id);
    companyModel.findByIdAndUpdate(id, { $set: postdata }, function (err, doc) {
        if (err) {
            console.log(err);
            res.send(err);
            return;
        }
        console.log("success");
        res.json({ status: 'Success' });
        console.log("after success");
        return;
    });
});

router.post('/addKosher', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        console.log('fields: ');
        console.log(fields);
        console.log('files: ');
        console.log(files);
        try {
            if (files.kosherCertificate.name) {
                fs.renameSync(files.kosherCertificate.path, "Companies/" + fields.ComName + "/Documents/" + files.kosherCertificate.name);
            }
            companyModel.findByIdAndUpdate(fields.ComID, {
                $push: {
                    Certificates: {
                        path: files.kosherCertificate.name ? "Companies/" + fields.ComName + "/Documents/" + files.kosherCertificate.name : "",
                        name: "kosher"
                    }
                }, CertiBody: fields.CertifyingBody
            }, function (err, doc) {
                console.log(doc);
                res.json({ status: 'Success' });
                return;
            });

        } catch (ex) {
            console.log(ex.code);
            res.json(ex);
            return;
        }
    });
});

router.post('/deleteCert', function (req, res) {

    var comID = req.session.user._id;
    var certName = req.body.name;
    var filePath = req.body.path;

    // var index = fileName.indexOf('/Companies') + 1;
    // if (index > 0) {
    //     fileName = fileName.substring(index);
    // } else {
    //     fileName = "";
    // }
    console.log(comID);
    console.log(certName);
    console.log(filePath);
    if (filePath || filePath!=="") {
      try {
                fs.unlinkSync('assets/'+filePath);
            } catch (ex) {
                console.log(ex);
                res.json(ex);
                return;
            };  
    }

    if (certName==="kosher"&& req.body.CertifyingBody!=="") {
        companyModel.findByIdAndUpdate(comID, { $pull: { Certificates: { name: certName } }, CertiBody:""}, function (err, doc) {
            if (err) {
                res.json(err);
                return;
            }
            res.json({ status: 'Success' });
            return;
        });

    }else if (req.body.DocType==="otherdocs") {
        companyModel.findByIdAndUpdate(comID, { $pull: { otherdocs: filePath } }, function (err, doc) {            
            if (err) {
                res.json(err);
                return;
            }
            res.json({ status: 'Success' });
            return;
        });
    }
    else{
        companyModel.findByIdAndUpdate(comID, { $pull: { Certificates: { name: certName } } }, function (err, doc) {
            if (err) {
                res.json(err);
                return;
            }
            res.json({ status: 'Success' });
            return;
        });
    }
    // companyModel.update({ _id: comID, "Certificates.name": certName }, { $set: { "Certificates.$.path": "" } }, function (err, doc) {
    //         console.log(doc);
    //         res.json({ status: 'Success' });
    //         return;
    // });
    // if (certName.indexOf('file') > 0) {
    //     if (fileName) {
    //         fileName = fileName.replace(/%20/g, " ");
    //         console.log(fileName);
    //         try {
    //             fs.unlinkSync('assets/'+filePath);
    //         } catch (ex) {
    //             console.log(ex);
    //             res.json(ex);
    //             return;
    //         };
    //     }
    //     certName = certName.substring(0, certName.indexOf('file'));
    //     companyModel.update({ _id: comID, "Certificates.name": certName }, { $set: { "Certificates.$.path": "" } }, function (err, doc) {
    //         console.log(doc);
    //         res.json({ status: 'Success' });
    //         return;
    //     });

    //} 
    // else {
    //     if (certName !== 'otherdocs') {
    //         if (fileName) {
    //             fileName = fileName.replace(/%20/g, " ");
    //             console.log(fileName);
    //             try {
    //                 fs.unlinkSync(fileName);
    //             } catch (ex) {
    //                 console.log(ex);
    //                 res.json(ex);
    //                 return;
    //             };
    //         }
    //         companyModel.findByIdAndUpdate(comID, { $pull: { Certificates: { name: certName } } }, function (err, doc) {
    //             if (err) {
    //                 res.json(err);
    //                 return;
    //             }
    //             res.json({ status: 'Success' });
    //             return;
    //         });
    //     } else {
    //         if (fileName) {
    //             fileName = fileName.replace(/%20/g, " ");
    //             console.log(fileName);
    //             try {
    //                 fs.unlinkSync(fileName);
    //             } catch (ex) {
    //                 console.log(ex);
    //                 res.json(ex);
    //                 return;
    //             };
    //         }
    //         companyModel.findByIdAndUpdate(comID, { $pull: { otherdocs: fileName } }, function (err, doc) {
    //             if (err) {
    //                 res.json(err);
    //                 return;
    //             }

    //             res.json({ status: 'Success' });
    //             return;
    //         });

    //     }
    // }
});

app.use('/', router);

//app.use(function (req, res) {
//    res.redirect('/404.html');
//});
app.listen(port);
console.log('Website is live on port ' + port);
