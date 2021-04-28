const request = require('supertest');
const app = require('../src/app.js');

test('Should signup a new user', async() => {
    await (await request(app).post('/users/create')).send({
        email: 'jakub.valaa@seznam.cz',
        nick: 'jakoub009',
        password: 'jakoub323',
        age: 32
    }).expect(201)
})