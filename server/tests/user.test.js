const request = require('supertest');
const app = require('../src/app.js');
const mongoose = require('mongoose');
const User = require('../src/models/users');
const jwt = require('jsonwebtoken');

const userId = new mongoose.Types.ObjectId();

const token = jwt.sign({_id: userId.toString()}, process.env.JWT_SECRET);

const newUser = {
    _id: userId,
    email: 'mod88@seznam.cz',
    password: process.env.TEST_PASS,
    nick: 'mod88',
    age: 150,
    tokens: {
        _id: userId.toString(),
        token
    }
}

beforeEach(async () => {
    await new User(newUser).save();
});


afterEach(async () => {
    await User.deleteOne({_id: userId});
})

test('Should signup a new user', async() => {
    const response = await request(app)
                            .get('http://localhost:3010/users/me')
                            .set('Authorization',`Bearer ${token}`)
                            .expect(200)

})