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

    it('status 200 from getting index', (done) => {
        request(api)
            .get('/')
            .expect(200, done);
    });

    it('responds with json', function(done) {
        request(api)
        .get('/')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });


});