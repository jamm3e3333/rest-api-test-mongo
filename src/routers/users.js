const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

const User = require('../models/users.js');
const auth = require('../middleware/auth.js');
const emailSend = require('../email/email.js');

const router = new express.Router();

router.post('/users/create', async(req, res) => {
    try{
        const user = new User(req.body);
        const temp = process.env.URL;
        if(!user){
            return res.status(404)
                .send();
                
        }
        await emailSend(user.email.toString(), "Welcome", "Welcome to the task server made by Jakub Vala.\nEnjoy your stay here. \nHere you can click to verify your account: " + temp + user._id, async (err, status) => {
            if(err){
                return res.status(400)
                            .send("Email is not reachable.");
            }
            console.log(status);
            await user.save();
            const token = await user.generateAuthToken();
            res.status(201)
                .send({user, token, status});
        });
    }
    catch(e){
        res.status(400)
            .send({Error: e.message});
    }
})

router.post('/users/verification', async (req, res) => {
    try{
        const user = await User.findOne({_id: req.body._id});
        if(!user){
            return res.status(400)
                .send("Verification failed!");
        }
        user.verification = true;
        await user.save();
        res.status(200)
            .send(user);
    }
    catch(e){
        res.status(400)
            .send({Error: e.message});
    }
})

router.post('/users/login', async(req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.status(200)
            .send({user, token});
    }
    catch(e){
        res.status(400)
            .send({Error: e.message});
    }
})


router.post('/users/logout', auth, async(req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })
        await req.user.save();
        res.status(200)
            .send(req.user);
    }
    catch(e){
        res.status(500)
            .send({Error: "You weren\'t logout."});
    }
});

router.post('/users/logoutAll', auth, async(req, res) => {
    try{
        req.user.tokens = [];
        await req.user.save();
        res.status(200)
            .send(req.user);
    }
    catch(e){
        res.status(500)
            .send({Error: "Your werent\'t logout from all accounts."});
    }
});

const upload = multer({
    limits: {
        fileSize: 5000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            cb(new Error("The file must be in the format jpg, jpeg or png."));
        }
        cb(undefined, true);
    }
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async(req, res) => {
    try{
        if(!req.file.buffer){
            throw new Error("You sent an empty file.");
        }
        const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
        req.user.avatar = buffer;
        await req.user.save();
        res.status(200)
            .send(req.user);
    }
    catch(e){
        res.status(400)
            .send({Error: e.message});
    }
}, (error, req, res, next) => {
    res.status(400)
    .send({Error: error.message});
})

router.patch('/users/update/me', auth, async (req, res) => {
    const updateAllowed = ['email','nick','password','age'];
    const update = Object.keys(req.body);
    const isUpdate = update.every((update) => {
        return updateAllowed.includes(update);
    })
    try{
        if(!isUpdate){
            return res.status(400)
                .send("You cannot update these properties.");
        }

        update.forEach((update) => {
            req.user[update] = req.body[update];
        })

        await req.user.save();

        res.status(200)
            .send(req.user);
    }
    catch(e){
        res.status(400)
            .send({Error: e.message});
    }
})

router.get('/users/me', auth, async(req, res) => {
    try{
        res.status(200)
            .send(req.user);
    }
    catch(e){
        res.status(400)
            .send({Error: e.message});
    }
});

router.get('/users/me/avatar', auth, async(req, res) => {
    try{
       res.status(200)
            .send(req.user.avatar);
    }
    catch(e){
        res.status(400)
            .send({Error: e.message});
    }
})

router.delete('/users/delete', auth, async(req, res) => {
    await emailSend(req.user.email.toString(), "GoodBye", "Thanks for using our service.", (err, status) => {
        if(err){
            console.log("Email was not sent.");
        }
        else{
            console.log("Email was sent",status);
        }
    });
    try{
        await req.user.remove();
        res.status(200)
            .send("User deleted");
    }
    catch(e){
        res.status(400)
            .send(({Error: e.message}));
    }
})

router.delete('/users/me/avatar/delete', auth, async(req, res) => {
    try{
        req.user.avatar = undefined;
        await req.user.save();
        res.status(200)
            .send(res.user);
    }
    catch(e){
        res.status(400)
            .send({Error: e.message});
    }
})

module.exports = router;