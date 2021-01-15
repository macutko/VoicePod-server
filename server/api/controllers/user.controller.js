const express = require('express');
const router = express.Router();
const userService = require('../../services/user.service');
const log = require('../../utils/logging');
// routes
router.post('/authenticate', authenticate);
router.post('/create', create);
router.get('/exists', getByEmailOrUsername);
router.get('/getCurrent', getCurrent);
router.get('/deleteAccount', removeUser);
router.post('/updateAccount', updateUser);

module.exports = router;

function removeUser(req, res, next) {
    userService.removeUser(req.user.sub).then((r) => {
        if (r) {
            res.sendStatus(200)
        } else {
            res.sendStatus(500)
        }
    }).catch((err) => {
        log.error(err)
        next(err)
    })
}

function updateUser(req, res, next) {
    userService.updateUser(req).then((doc) => {
        if (doc) {
            res.sendStatus(200)
        } else {
            res.sendStatus(500)
        }
    }).catch((err) => {
        log.error(err)
        next(err)
    })
}

function create(req, res, next) {
    userService.create(req.body)
        .then((user) => {
            if (!(user.user.username == null) || !(user.token == null)) {
                res.status(201).json(user);
                log.log(" 201 User created successfully!")
            } else {
                res.sendStatus(400)
                log.log(user)
            }
        }).catch((err) => {
        log.error(err)
        next(err)
    });
}

function getCurrent(req, res, next) {
    if (!req.user) {
        res.status(401).json({message: "Not logged in"})
    } else {
        userService.getById(req.user.sub)
            .then(user => {
                if (user) {
                    res.json({user: user}).status(200)
                } else {
                    res.sendStatus(404)
                }
            })
            .catch(err => next(err));

    }
}

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then((user) => {
            // todo: refactor this cuz if undefined it throw error on .user
            if (!(user.user.username) || !(user.token)) {
                res.json(user);
                log.log(" 200 User logged in!")
            } else {
                log.log("401 User attempted login. Bad pass or Username");
                res.status(401).json({message: "Username or password is incorrect"})
            }
        })
        .catch(err => next(err));
}

function getByEmailOrUsername(req, res, next) {
    if (req.query.email) {
        userService.getByEmail(req.query.email)
            .then(user => user ? res.json({"emailError": "Email already exists"}) : res.json())
            .catch(err => next(err));
    } else if (req.query.username) {
        userService.getByUsername(req.query.username)
            .then(user => user ? res.json({"usernameError": "Username already exists"}) : res.json())
            .catch(err => next(err));
    }

}
