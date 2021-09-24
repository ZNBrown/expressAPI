const request = require('supertest');
const server = require('../server');


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


});