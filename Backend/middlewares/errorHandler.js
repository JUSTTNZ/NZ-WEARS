const errorHandler = (err, req, res, next) => {
    if (res.headersSent) return next(err);
    res.status(400).json({
        success: false,
        msg: err.message
    })
}

module.exports = errorHandler;