module.exports.create = function(req, res) {
    if (req.xhr) {
        Post.create({
            content: req.body.content,
            post: req.params.id,
            user: req.user._id
        }).then(function(comment) {
            return res.status(200).json({
                data: {
                    comment: comment
                },
                message: 'Post Created!'
            });
        }).catch(function(err) {
            console.log(err);
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        );
    }
}




