import request from 'supertest';
import app from "../../server.js";
import models from "../../models/index.js";
const { User } = models;
  
// describe('POST /auth/login', () => {
//   test('logs in user with valid EMAIL and password', async () => {
//     await User.create({
//       email: 'cashMe@outside.com',
//       password: 'Password123!',
//       username: 'jabroni'
//     });

//     const response = await request(app)
//     .post('/auth/login')
//     .send({
//       email: 'cashMe@outside.com',
//       password: 'Password123!',
//       username: undefined
//     });
    
//     expect(response.status).toBe(201);
    
//     const user = await User.findOne({ email: 'cashMe@outside.com' });
//     expect(user).toBeTruthy();
//     expect(user.username).toBe('jabroni');
//     expect(user).toHaveProperty("_id");
//     await User.deleteOne({username:'jabroni'});
//   });

//   test('logs in user with valid USERNAME and password', async () => {
//     await User.create({
//       email: 'cashMe@outside.com',
//       password: 'Password123!',
//       username: 'jabroni'
//     });

//     const response = await request(app)
//     .post('/auth/login')
//     .send({
//       email: undefined,
//       password: 'Password123!',
//       username: 'jabroni'
//     });
    
//     expect(response.status).toBe(201);
    
//     const user = await User.findOne({ usename: 'jabroni' });
//     expect(user).toBeTruthy();
//     expect(user.email).toBe('cashMe@outside.com');
//     expect(user).toHaveProperty("_id");
//     await User.deleteOne({username:'jabroni'});
//   });

//   test('if both a username and email are provided, EMAIL must match password', async () => {
//     await User.create({
//       email: 'uniqueAndValid@email.com',
//       password: 'Password123!',
//       username: 'iamunique'
//     });
    
//     const response = await request(app)
//       .post('/auth/login')
//       .send({
//         email: 'valid@email.com',
//         password: 'Password123!',
//         username: 'iamunique'
//       });
      
//       expect(response.status).toBe(400);
//       expect(response.body.message).toBe('your email does not match, you may try entering only the username');
//       await User.deleteOne({username:'iamunique'});
//   });

//   test('if both a username and email are provided, USERNAME must match password', async () => {
//     await User.create({
//       email: 'uniqueAndValid@email.com',
//       password: 'Password123!',
//       username: 'iamunique'
//     });
    
//     const response = await request(app)
//       .post('/auth/login')
//       .send({
//         email: 'uniqueAndValid@email.com',
//         password: 'Password123!',
//         username: 'iamuniqu2'
//       });
      
//       expect(response.status).toBe(400);
//       expect(response.body.message).toBe('your username does not match, you may try entering only the email');
//       await User.deleteOne({username:'iamunique'});
//   });

//   test('passwords always need to match', async () => {
//     await User.create({
//       email: 'uniqueAndValid@email.com',
//       password: 'thisissuchagoodpassword',
//       username: 'iamunique'
//     });
    
//     const response = await request(app)
//       .post('/auth/login')
//       .send({
//         email: 'uniqueAndValid@email.com',
//         password: 'iforgotmypassword',
//         username: 'iamunique'
//       });
      
//       expect(response.status).toBe(400);
//       expect(response.body.message).toBe('passwords dont match');
//       await User.deleteOne({username:'iamunique'});
//   });
// });