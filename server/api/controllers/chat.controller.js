const express = require('express');
const router = express.Router();
const chatService = require('../../services/chat.service');
const log = require('../../utils/logging');
// routes
router.post('/create', create);

module.exports = router;

function create(req, res, next) {
    chatService.create(req)
        .then((chat) => {
            if (!(chat == null)) {
                res.status(201).json(chat);
                log.log(" 201 Chat created successfully!")
            } else {
                res.status(400);
                log.log(chat)
            }
        }).catch((err) => {
        log.log(err);
        next(err)
    });
}

