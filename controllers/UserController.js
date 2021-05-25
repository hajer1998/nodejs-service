var client = require('../modules/client');
const imgur = require('imgur');
exports.sign_in = function (req, res) {
    client.send_sync('hellolaravel', {
        route: "/api/user/login",
        method: "POST",
        headers: {
            Accept:"application/json"
        },
        query: null,
        body:{
            email: req.body.email,
            password: req.body.password
        }
    }, function (result, error) {
        if (error) {
            res.render('error', {
                error_message: error.message,
                error_status: error.status
            });
            return;
        }
        res.cookie('accessToken', result.data.token);
        res.redirect('/postlist');
    });
}

exports.sign_out = function (req,res){
        res.clearCookie('accessToken');
        res.redirect('/');
}

exports.sign_up = function (req,res) {
    client.send_sync('hellolaravel', {
        route: "/api/user/register",
        method: "POST",
        headers: {
            Accept: "application/json"
        },
        query: null,
        body: {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }
    }, function (result, error) {
        if (error) {
            res.render('error', {
                error_message: error.message,
                error_status: error.status
            });
            return;
        }
        res.cookie('accessToken', result.data.token);
        res.redirect('/postlist');
    });
}

exports.profile = function (req, res){
    client.send_sync('hellolaravel', {
        route: "/api/profile/"+req.logged_in_user_id,
        method: "GET",
        headers:{
            Accept: "application/json",
            Authorization: 'Bearer '+req.cookies.accessToken
        },
        query: null,
        body: null
    }, function (result,error) {
        if (error) {
            res.render('error', {
                error_message: error.message,
                error_status: error.status
            });
        }

        res.render('profile', {
            user: result.response
        });
    });
}

exports.upload = async function (req, res) {
    var imageLink;

    let image = req.body.image;

    if (typeof image == 'undefined' || !image) {
        res.status(400).send('Image is invalid');
        return;
    }

    image = image
        .replace(/^data:image\/(png|gif|jpeg);base64,/,'');

    imgur.setClientId('7b18dfee164f5f8');
    imgur
        .uploadBase64(image)
        .then(function(json) {
            imageLink = json.link;
            client.send_sync('hellolaravel', {
                route: "/api/updateProfilePicture/"+req.logged_in_user_id,
                method: "PUT",
                headers:{
                    Accept: "application/json",
                    Authorization: 'Bearer '+req.cookies.accessToken
                },
                query: null,
                body: {
                    imageLink: imageLink
                }
            }, function (result,error) {
                if (error) {
                    res.render('error', {
                        error_message: error.message,
                        error_status: error.status
                    });

                    res.status(204).send(imageLink);
                }
            });
        })
        .catch((error) => {
            console.log(error.message);
            res.status(400).send(error.message);
        });
}