const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth.js');
const Task = require('../models/tasks.js');

router.post('/tasks/create', auth, async(req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    if(!task){
        res.status(404)
            .send({Error: "Task is empty."});
    }
    try{
        await task.save();
        res.status(201)
            .send(task);
    }
    catch(e){
        res.status(400)
            .send({Error: e.message});
    }
});

router.get('/tasks', auth, async(req, res) => {
    const match = {};
    const sort = {};

    if(req.query.completed){
        match.completed = req.query.completed === 'true';
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    try{
        const user = await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        const tasks = user.tasks;
        res.status(200)
            .send(tasks);
    }
    catch(e){
        res.status(400)
            .send({Error: e.message});
    }
})

router.get('/task/:id', auth, async (req, res) => {
    const id = req.params.id;
    if(!id) {
        res.status(404)
            .send({msg: 'Task not found.'});
    }
    try {
        const task = await Task.findOne({_id: id, owner: req.user._id});
        if(!task) {
            return res.status(400)
                        .send({msg: `Task with id ${id} not found.`})
        }
        res.status(200)
            .send(task);
    }
    catch(e) {
        res.status(400)
            .send(e);
    }
})

router.patch('/tasks/:id', auth, async(req, res) => {
    const updatesAllowed = ['task','completed'];
    const updates = Object.keys(req.body);
    const isAllowed = updates.every((update) => {
        return updatesAllowed.includes(update);
    })
    if(!isAllowed){
        return res.status(400)
            .send();
    }
    try{
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id});
        if(!task){
            throw new Error("There is no task like that");
        }
        updates.forEach((update) => {
            task[update] = req.body[update];
        })
        await task.save();
        res.status(200)
            .send(task);
    }
    catch(e){
        res.status(400)
            .send(e);
    }
});

router.delete('/tasks/:id', auth, async(req, res) => {
    try{
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});
        if(!task){
            return res.status(400)
                        .send("Unable to delete the task.");
        }
        res.status(200)
            .send();
    }
    catch(e){
        res.status(400)
            .send({Error: e.message});
    }
})

module.exports = router;