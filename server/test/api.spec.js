const request = require('supertest');
const express = require('express');
const server = require('../server');


describe('API server', () => {
    let api;
    let items = [
        {id: 1, activity: "Call Bob for a catch up", priority: "medium", dueDate: "05/10/2021", status: "To do"},
        {id: 2, activity: "Make birthday cake", priority: "low", dueDate: "06/10/2021", status: "Done"},
        {id: 3, activity: "Meet with team to prepare presentation", priority: "high", dueDate: "06/10/2021", status: "In progress"}
    ];
    let testActivity = {activity: "debug code", priority: "high", dueDate: "09/10/2021", status: "In progress"};
    let updateActivity = {activity: "debug code", priority: "high", dueDate: "09/10/2021", status: "In progress"};


    beforeEach((done) => {
        api = server.listen(5000, done);
    });

    afterEach((done) => {
        console.log('Tearing down test');
        api.close(done);
    });

    it('GET /, status 200', (done) => {
        request(api)
            .get('/')
            .expect(200, done);
    });

    it('GET /, responds with json', function(done) {
        request(api)
            .get('/')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    it('GET nonexistent route ', function(done) {
        request(api)
        .get('/fake')
        .expect(404, done);
    });

    it('GET list of all activities returns json', function(done) {
        request(api)
        .get('/list')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);

    });

    it('GET specific retrieves correctly', function(done) {
        request(api)
        .get('/list/1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(  items[0], done);
    });

    it('POST specific activity confirmation', function(done) {
        request(api)
        .post('/list')
        .send(testActivity)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect({ message: `Of ${testActivity.priority} importance, ${testActivity.activity} due on ${testActivity.dueDate} has been added to your To Do List`})
        .expect(201, done);
    });

    it('GET unknown acticity results in 404', (done) => {
        request(api).get('/list/200').expect(404).expect({}, done);
    });


    it('DELETE list/:id with has status 201', (done) => {
        request(api).delete('/list/2').expect(201).expect({ message: "Item with ID: 2 deleted."}, done);
    });


    it('UPDATES item 2 correctly', function(done) {
        request(api)
        .put('/list/2')
        .send(updateActivity)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect({ message: `Item updated: now reads ${updateActivity.priority} importance, ${updateActivity.activity} due on ${updateActivity.dueDate}.` })
        .expect(200, done);
    });

    it('fails to UPDATE non existant item correctly', function(done) {
        request(api)
        .put('/list/200')
        .send(updateActivity)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        //.expect({})
        .expect(404, done);
    });

});