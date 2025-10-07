import mongoose from "mongoose";
import models from "../../models/index.js";
const { User } = models;
import { jest } from "@jest/globals";
import dotenv from "dotenv";
dotenv.config();
beforeAll(async () => {
  await mongoose.connect(process.env.DB_TEST_STR);
  await User.deleteMany({});
});
afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});



 describe('POST /auth/register', () => {
    test('registers user with valid data', async () => {
      await User.create({
        email: 'cashMe@outside.com',
        password: 'Password123!',
        username: 'jabroni'
      });
      
      const user = await User.findOne({ email: 'cashMe@outside.com' });
      expect(user).toBeTruthy();
      expect(user.username).toBe('jabroni');
      expect(user).toHaveProperty("_id");
      await User.deleteOne({username:'jabroni'});
  });

  test('prevents duplicate email registration', async () => {
    const goodUser = await User.create({
      email: 'uniqueAndValid@email.com',
      password: 'Password123!',
      username: 'iamunique'
    });
    
    await expect(User.create({
      email: 'uniqueAndValid@email.com',
      password: 'DifferentPass123!',
      username: 'iamunique2'
    })).rejects.toThrow();
      
    await User.deleteOne({username:'iamunique'});
    await User.deleteOne({username:'iamunique2'});
  });

  test('prevents suspected invalid email', async () => {
    
    await expect(User.create({
      email: 'duplicateexample.com',
      password: 'DifferentPass123!',
      username: 'user2'
    })).rejects.toThrow();
      
    await User.deleteOne({username:'user2'});
  });

  test('prevents duplicate username registration', async () => {
    await User.create({
      email: 'uniqueAndValid@email.com',
      password: 'Password123!',
      username: 'iamunique'
    });
        
    await expect(User.create({
      email: 'yetAnotherUniqueAndValid@email.com',
      password: 'DifferentPass123!',
      username: 'iamunique'
    })).rejects.toThrow();
      
    await User.deleteOne({username:'iamunique'});
  });
});