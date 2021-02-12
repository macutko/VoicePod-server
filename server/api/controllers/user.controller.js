const express = require('express');
const router = express.Router();
const userService = require('../../services/user');
const log = require('../../utils/logging');
// routes
router.post('/authenticate', authenticate);
router.post('/create', create);
router.get('/exists', getByEmailOrUsername);
router.get('/getCurrent', getCurrent);
router.get('/deleteAccount', deleteUser);
router.post('/updateAccount', updateUser);

module.exports = router;

function deleteUser(req, res, next) {
    userService.deleteUser(req.user.sub).then((r) => {

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
        if (doc.url) {

            res.status(200).json(doc)
        } else if (doc) {
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
    userService.createUser(req.body)
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
        userService.getUserById(req.user.sub)
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
    userService.authenticateUser(req.body)
        .then(({user, token, errCode}) => {
            switch (errCode) {
                case 401:
                    log.log("401 User attempted login. Bad pass");
                    res.status(401).json({message: "Password is incorrect"})
                    break;
                case 404:
                    log.log("404 Username not found");
                    res.status(404).json({message: "Username not found"})
                    break;
                default:
                    res.json({user: user, token: token});
                    log.log("200 User logged in!")
                    break;
            }
        })
        .catch(err => next(err));
}

function getByEmailOrUsername(req, res, next) {
    if (req.query.email) {
        userService.getUserByEmail(req.query.email)
            .then(user => user ? res.json({"emailError": "Email already exists"}) : res.json())
            .catch(err => next(err));
    } else if (req.query.username) {
        userService.getUserByUsername(req.query.username)
            .then(user => user ? res.json({"usernameError": "Username already exists"}) : res.json())
            .catch(err => next(err));
    }

}
