const request = require('supertest');
const express = require('express');
const server = require('../server/server');


describe('API server', () => {
    let api;

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


});