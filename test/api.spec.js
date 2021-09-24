const request = require('supertest');
const express = require('express');
const server = require('../server/server');


describe('API server', () => {
    let api;
    let testActivity ={
        activity: "breath", priority: "high", 
        dueDate: 270921, status: "pending"
    }

    beforeAll(() => {
        api = server.listen(5000, () =>
            console.log('Test server running on port 5000')
        );
    });


    afterAll((done) => {
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
        .get('/list/3')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(  { id: 3, activity: "jump", priority: "low", 
        dueDate: 270921, status: "pending" });
    });

    it('POST specific activity confirmation', function(done) {
        request(api)
        .get('/list/1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .expect({ id: 4, ...testActivity }, done);
    });

    it('GET unknown acticity results in 404', (done) => {
        request(api).get('/list/200').expect(404).expect({}, done);
    });


    it('DELETE list/:id with has status 204', async () => {
        await request(api).delete('/list/4').expect(204);

        const updatedList = await request(api).get('/list');

        expect(updatedList.body.length).toBe(3);
    });



});