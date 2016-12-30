var express = require('express');
var router = express.Router();
var gcm = require('node-gcm');

var fuelAlertMessage = new gcm.Message({
    data: { key1: 'Fuel running low' }
});

// Set up the sender with you API key, prepare your recipients' registration tokens.
var sender = new gcm.Sender('AIzaSyA4GZqYXHjIKe5HuhJ8ssoaGOs2R0HpaEE');
var regTokens = ['fvcyFjhhaPs:APA91bET92P3tuQhtlLpooGb5MdHmvxfpLg1aZzkZdHUw5mdRI95GtZf0QM6JciBV9HAjymSFe_YPJUUbPX29WwzHkxlpWTZiTuyRePx1D50N1RKKTYKzEtOwmXmNL_q2H2UXsprXO_k'];

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
    sender.send(fuelAlertMessage, { registrationTokens: regTokens }, function (err, response) {
        if(err) console.error(err);
        else 	console.log(response);
    });
});

router.post('/', function (req, res) {
    console.log(req);
    var alertMessage = new gcm.Message({
        data: { key1: req.body.message }
    });

    res.render('index', { title: 'Express' });
    sender.send(alertMessage, { registrationTokens: regTokens }, function (err, response) {
        if(err) console.error(err);
        else 	console.log(response);
        res.end;
    });

});

module.exports = router;
