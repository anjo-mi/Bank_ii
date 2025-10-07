import request from 'supertest';
import app from "../../server.js";
import models from "../../models/index.js";
const { User } = models;
  
  describe('POST /auth/register', () => {
    test('registers user with valid data', async () => {
      const response = await request(app)
      .post('/auth/register')
      .send({
        email: 'cashMe@outside.com',
        password: 'Password123!',
        username: 'jabroni'
      });
      
      expect(response.status).toBe(201);
      
      const user = await User.findOne({ email: 'cashMe@outside.com' });
      expect(user).toBeTruthy();
      expect(user.username).toBe('jabroni');
      expect(user).toHaveProperty("_id");
      await User.deleteOne({username:'jabroni'});
  });

  test('prevents duplicate email registration', async () => {
    await User.create({
      email: 'uniqueAndValid@email.com',
      password: 'Password123!',
      username: 'iamunique'
    });
    
    const response = await request(app)
      .post('/auth/register')
      .send({
        email: 'uniqueAndValid@email.com',
        password: 'DifferentPass123!',
        username: 'iamunique2'
      });
      
      expect(response.status).toBe(400);
      expect(response.message).toBe('the provided email is already attached to a different username');
      await User.deleteOne({username:'iamunique'});
  });

  test('prevents suspected invalid email', async () => {
    
    const response = await request(app)
      .post('/auth/register')
      .send({
        email: 'duplicateexample.com',
        password: 'DifferentPass123!',
        username: 'user2'
      });
    
    expect(response.status).toBe(400);
    expect(response.message).toBe('your email does not match the standard format');
  });

  test('prevents duplicate username registration', async () => {
    await User.create({
      email: 'uniqueAndValid@email.com',
      password: 'Password123!',
      username: 'iamunique'
    });
    
    const response = await request(app)
      .post('/auth/register')
      .send({
        email: 'uniqueAndAlsoValid@email.com',
        password: 'DifferentPass123!',
        username: 'iamunique'
      });
      
      expect(response.status).toBe(400);
      expect(response.message).toBe('the username already exists');
      await User.deleteOne({username:'iamunique'});
  });

  test('username must use valid characters', async () => {
    
    const response = await request(app)
      .post('/auth/register')
      .send({
        email: 'pleasedont@email.me',
        password: 'uncrackable',
        username: 'user%&name'
      });
    
    expect(response.status).toBe(400);
    expect(response.message).toBe('your username uses invalid characters');
  });

  test('username must be 3 characters or longer', async () => {
    
    const response = await request(app)
      .post('/auth/register')
      .send({
        email: 'pleasedont@email.me',
        password: 'uncrackable',
        username: 'me'
      });
    
    expect(response.status).toBe(400);
    expect(response.message).toBe('usernames must be at least 3 characters long');
  });

  test('username must be no longer than 40 characters', async () => {
    
    const response = await request(app)
      .post('/auth/register')
      .send({
        email: 'pleasedont@email.me',
        password: 'uncrackable',
        username: 'loremipsumloremipsumloremipsumloremipsum1'
      });
    
    expect(response.status).toBe(400);
    expect(response.message).toBe('usernames must be at least 3 characters long');
  });

  test('password needs to be at least 8 characters', async () => {
    
    const response = await request(app)
      .post('/auth/register')
      .send({
        email: 'pleasedont@email.me',
        password: 'cracked',
        username: 'regularnormallengthname'
      });
    
    expect(response.status).toBe(400);
    expect(response.message).toBe('your password must be at least 8 characters long');
  });

  test('password needs to be at most 20 characters', async () => {
    
    const response = await request(app)
      .post('/auth/register')
      .send({
        email: 'pleasedont@email.me',
        password: 'toocomplextoocomplex1',
        username: 'regularnormallengthname'
      });
    
    expect(response.status).toBe(400);
    expect(response.message).toBe('your password must be at most 20 characters long');
  });
});