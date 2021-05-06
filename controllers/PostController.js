var client = require('../modules/client');
exports.posts_list = function (req, res) {
    client.send_sync('hellolaravel', {
        route: "/api/post",
        method: "GET",
        headers: {
            Accept:"application/json",
            Authorization: "Bearer "+req.cookies.accessToken
        },
        query: null,
        body: null
    }, function (posts_list, error) {
        if (error) {
            res.render('error', {
                error_message: error.message,
                error_status: error.status
            });
            return;
        }
        res.render('view_posts', {
            posts_list: posts_list.data
        });
    });
}

exports.like_post = function (req, res) {
    client.send_sync('hellolaravel', {
        route: "/api/post/like/"+req.params.id,
        method: "POST",
        headers: {
            Accept:"application/json",
            Authorization: "Bearer "+req.cookies.accessToken
        },
        query: null,
        body: null
    }, function (post, error) {
        if (error) {
            res.render('error', {
                error_message: error.message,
                error_status: error.status
            });
            return;
        }
        res.send(204);
    });
 }

exports.unlike_post = function (req, res) {
    client.send_sync('hellolaravel', {
        route: "/api/post/unlike/"+req.params.id,
        method: "POST",
        headers: {
            Accept:"application/json",
            Authorization: "Bearer "+req.cookies.accessToken
        },
        query: null,
        body: null
    }, function (post, error) {
        if (error) {
            res.render('error', {
                error_message: error.message,
                error_status: error.status
            });
            return;
        }
        res.send(204);
    });
}
exports.create_post = function (req, res) {
    client.send_sync('hellolaravel', {
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
        }, function (post, error) {
            if (error) {
                res.render('error', {
                    error_message: error.message,
                    error_status: error.status
                });
                return;
            }
            res.redirect('/postlist');
        });
    }

exports.delete_post = function (req, res) {
    client.send_sync('hellolaravel', {
        route: "/api/post/"+req.params.id,
        method: "DELETE",
        headers: {
            Accept:"application/json",
            Authorization: "Bearer "+req.cookies.accessToken
        },
        query: null,
        body: null
    }, function (result, error) {
        if (error) {
            res.render('error', {
                error_message: error.message,
                error_status: error.status
            });
            return;
        }
        res.redirect('/postlist');
    });
}

exports.update_post = function (req, res) {
    client.send_sync('hellolaravel', {
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
    }, function (post, error) {
        if (error) {
            res.render('error', {
                error_message: error.message,
                error_status: error.status
            });
            return;
        }
        res.redirect('/postlist');

    });
}

exports.render_create_form = function (req, res) {
    res.render('create_post');
}

exports.render_edit_form = function (req, res) {
    client.send_sync('hellolaravel', {
        route: "/api/post/"+req.params.id,
        method: "GET",
        headers: {
            Accept:"application/json",
            Authorization: "Bearer "+req.cookies.accessToken
        },
        query: null,
        body: null
    }, function (post, error) {
        if (error) {
            res.render('error', {
                error_message: error.message,
                error_status: error.status
            });
            return;
        }
        res.render('update_post', {
            post_id: post._id,
            post_text: post.body
        });
    });
}
