var client = require('../modules/client');// l fake queue RPC
const imgur = require('imgur');// service online 3d party to save images online
const config = require('../config/config')

exports.sign_in = async function (req, res) {
    let response = await client.send_sync('hellolaravel', {
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
    });

    if (response.error) {
        res.render('error', {
            error_message: response.error.message,
            error_status: response.error.status
        });
        return;
    }
    res.cookie('accessToken', response.result.data.token);
    res.redirect('/postlist');
}

exports.sign_out = function (req,res){
    res.clearCookie('accessToken');
    res.redirect('/');
}

exports.sign_up = async function (req,res) {
    let response = await client.send_sync('hellolaravel', {
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
    });

    if (response.error) {
        res.render('error', {
            error_message: response.error.message,
            error_status: response.error.status
        });
        return;
    }
    res.cookie('accessToken', response.result.data.token);
    res.redirect('/postlist');
}

exports.profile = async function (req, res){
    let response = await client.send_sync('hellolaravel', {
        route: "/api/user/profile/"+req.logged_in_user_id,
        method: "GET",
        headers:{
            Accept: "application/json",
            Authorization: 'Bearer '+req.cookies.accessToken
        },
        query: null,
        body: null
    });

    if (response.error) {
        res.render('error', {
            error_message: response.error.message,
            error_status: response.error.status
        });
    }

    res.render('profile', {
        user: response.result.response,
        logged_in_user_id: req.logged_in_user_id
    });
}

exports.updateProf = async function (req, res){
    let response = await client.send_sync('hellolaravel', {
        route: "/api/user/updateProfile/"+req.logged_in_user_id,
        method: "PUT",
        headers:{
            Accept: "application/json",
            Authorization: 'Bearer '+req.cookies.accessToken
        },
        query: null,
        body: {
            name: req.body.name,
            email: req.body.email
        }
    });

    if (response.error) {
        res.render('error', {
            error_message: response.error.message,
            error_status: response.error.status
        });
    }

    res.redirect('/profile/'+req.logged_in_user_id);
}
exports.render_edit_profile = async function (req, res) {
    let response = await client.send_sync('hellolaravel', {
        route: "/api/user/profile/"+req.params.logged_in_user_id,
        method: "GET",
        headers: {
            Accept:"application/json",
            Authorization: "Bearer "+req.cookies.accessToken
        },
        query: null,
        body: null
    });

    if (response.error) {
        res.render('error', {
            error_message: response.error.message,
            error_status: response.error.status
        });
        return;
    }
    res.render('updateProf', {
        user_id: response.result.response._id,
        user_name: response.result.response.name,
        user_email: response.result.response.email,
        logged_in_user_id: req.logged_in_user_id
    });
}

exports.upload = function (req, res) {
    var imageLink;
//yjib l image m request as base64 encoded l upload tsir f l 150
    let image = req.body.image;

    if (typeof image == 'undefined' || !image) {
        res.status(400).send('Image is invalid');
        return;
    }
    image = image
        .replace(/^data:image\/(png|gif|jpeg);base64,/,'');
    imgur.setClientId(config.imgUrClientId);
    imgur
        .uploadBase64(image)
        //en cas d succés
        .then(async function(json) {
            //en cas de succés on prend le lien w json howa l object eli rja3mel imgur f wostou link nekhdhouh
            imageLink = json.link;
            // w baad teb3thha l &st micro-serv bch nsayvouha fel db
            let response = await client.send_sync('hellolaravel', {
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
            });
            if (response.error) {
                res.render('error', {
                    error_message: response.error.message,
                    error_status: response.error.status
                });

            }
            res.status(204).send(imageLink);
        })
        .catch((error) => {
            console.log(error.message);
            res.status(400).send(error.message);
        });
}