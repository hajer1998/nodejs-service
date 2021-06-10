var client = require('../modules/client');
exports.posts_list = async function (req, res) {
    let response = await client.send_sync('hellolaravel', {
        route: "/api/post",
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
            error_message: error.message,
            error_status: error.status
        });
        return;
    }

    res.render('view_posts', {
        posts_list: response.result.data,
        logged_in_user_id: req.logged_in_user_id
    });
}

exports.like_post = async function (req, res) {
    let response = await client.send_sync('hellolaravel', {
        route: "/api/post/like/"+req.params.id,
        method: "POST",
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
    res.send(204);
 }

exports.unlike_post = async function (req, res) {
    let response = await client.send_sync('hellolaravel', {
        route: "/api/post/unlike/"+req.params.id,
        method: "POST",
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
    res.send(204);
}
exports.create_post = async function (req, res) {
    let response = await client.send_sync('hellolaravel', {
        route: "/api/post",
        method: "POST",
        headers: {
            Accept:"application/json",
            Authorization: "Bearer "+req.cookies.accessToken
        },
        query: null,
        body: {
            body:req.body.body,
        }
    });

    if (response.error) {
        res.render('error', {
            error_message: response.error.message,
            error_status: response.error.status
        });
        return;
    }

    res.redirect('/postlist');
}

exports.delete_post = async function (req, res) {
    let response = await client.send_sync('hellolaravel', {
        route: "/api/post/"+req.params.id,
        method: "DELETE",
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
    res.redirect('/postlist');
}

exports.update_post = async function (req, res) {
    let response = await client.send_sync('hellolaravel', {
        route: "/api/post/"+req.body.post_id,
        method: "PUT",
        headers: {
            Accept:"application/json",
            Authorization: "Bearer "+req.cookies.accessToken
        },
        query: null,
        body: {
            body: req.body.body,
        }
    });

    if (response.error) {
        res.render('error', {
            error_message: response.error.message,
            error_status: response.error.status
        });
        return;
    }

    res.redirect('/postlist');
}

exports.render_create_form = function (req, res) {
    res.render('create_post');
}

exports.render_edit_form = async function (req, res) {
    let response = await client.send_sync('hellolaravel', {
        route: "/api/post/" + req.params.id,
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: "Bearer " + req.cookies.accessToken
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

    res.render('update_post', {
        post_id: response.result._id,
        post_text: response.result.body
    });
}
