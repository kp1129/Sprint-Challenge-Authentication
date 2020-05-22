const request = require('supertest');
const server = require('../api/server');
const db = require('../database/dbConfig');

describe('auth endpoints', () => {
    
    describe('POST /register', () => {
        beforeEach(async () => {
            await db('users').truncate();
        });
        it('should return status 201', () => {
            return request(server)
                    .post("/api/auth/register")
                    .send({ username: 'user123', password: "password" })
                    .then(res => {
                        expect(res.status).toBe(201);
                    })
        });
        it('should return the message "Registration successful', () => {
            return request(server)
                    .post("/api/auth/register")
                    .send({ username: "user321", password: "password" })
                    .then(res => {
                        expect(res.body.message).toBe("Registration successful");
                    })
        });
    });

    describe('POST /login', () => {
        it('should return status 200', async () => {
            // first register a user
            await request(server)
                    .post("/api/auth/register")
                    .send({ username: 'user123', password: "password" })
                    .then(res => {
                         expect(res.status).toBe(201);
                     })
            await request(server)
                    .post('/api/auth/login')
                    .send({ username: 'user123', password: "password" })
                    .then(res => {
                        expect(res.status).toBe(200);
                    })
        });
        it('should return the message "You are logged in!"', () => {
            return request(server)
                    .post('/api/auth/login')
                    .send({ username: 'user123', password: "password" })
                    .then(res => {
                      expect(res.body.message).toBe("You are logged in!");
                     })
        });
    })
})