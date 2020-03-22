const express = require('express');
const router = express.router();

router.post('/', function(req, res, next) {
    console.log(req.body);
    console.log(req.body['type']);

    res.json({"challenge": req.body['challenge']});
});

module.exports = router;
