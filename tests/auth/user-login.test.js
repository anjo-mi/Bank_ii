import request from 'supertest';
import app from "../../server.js";
import { store } from "../../middleware/limiter.js";

beforeEach(async () => {
  store.resetAll();
})
 
describe('POST /auth/login', () => {
  test('logs in user with valid EMAIL and password', async () => {
    await request(app)
      .post('/auth/register')
      .send({
        email: 'un@seen.com',
        username: 'opensource',
        password: 'solidpassword',
      })
    const response = await request(app)
    .post('/auth/login')
    .send({
      provided: 'un@seen.com',
      // username: 'opensource',
      password: 'solidpassword',
    });
    
    expect(response.status).toBe(200);
  });

  test('logs in user with valid USERNAME and password', async () => {
    
    const response = await request(app)
    .post('/auth/login')
    .send({
      // provided: 'un@seen.com',
      provided: 'opensource',
      password: 'solidpassword',
    });
    
    expect(response.status).toBe(200);
  });

  
  test('invalid USERNAME, valid password should fail', async () => {    
    const response = await request(app)
      .post('/auth/login')
      .send({
        // provided: 'un@seen.com',
        provided: 'opensauce',
        password: 'solidpassword',
      });
      
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('invalid credentials');
  });

  test('invalid EMAIL, valid password should fail', async () => {    
    const response = await request(app)
      .post('/auth/login')
      .send({
        provided: 'actually@seen.com',
      // provided: 'opensauce',
        password: 'solidpassword',
      });
      
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('invalid credentials');
  });

  test('valid email, invalid PASSWORD should fail', async () => {    
    const response = await request(app)
      .post('/auth/login')
      .send({
        provided: 'un@seen.com',
        // provided: 'opensauce',
        password: 'liquidpassword',
      });
      
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('invalid password');
  });

  test('valid username, invalid PASSWORD should fail', async () => {    
    const response = await request(app)
      .post('/auth/login')
      .send({
        // provided: 'un@seen.com',
        provided: 'opensource',
        password: 'liquidpassword',
      });
      
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('invalid password');
  });

  
});