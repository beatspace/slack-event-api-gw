const express = require('express');
const router = express.Router();

router.post('/event', function(req, res, next) {
    console.log('1-------------->');
    console.log(req.body);

    if (req.body['type'] === 'challenge') {
        console.log(`${req.body['type']} response!!`);
        res.json({"challenge": req.body['challenge']});
        return;
    }

    console.log('2-------------->');
    console.log(req.body['type']);
    return;
});

router.post('/command', function(req, res, next) {
    console.log('command------------------->');
    console.log(req.body);
    console.log(`command: ${req.body['command']}`);

    res.json({"foo": "bar"});
});

module.exports = router;
