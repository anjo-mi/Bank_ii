import mongoose from "mongoose";
import models from "../../models/index.js";
const { Category, User } = models;
import { jest } from "@jest/globals";
import dotenv from "dotenv";
dotenv.config();
beforeAll(async () => {
  await mongoose.connect(process.env.DB_TEST_STR);
  await User.deleteMany({});
  await Category.collection.dropIndexes();
  await Category.syncIndexes();
  await Category.deleteMany({});
});
afterAll(async () => {
  await User.deleteMany({});
  await Category.collection.dropIndexes();
  await Category.syncIndexes();
  await Category.deleteMany({});
  await mongoose.connection.close();
});


test('a users id will be attached to a category when they create it,\n   isDefault defaults to false', async () => {
  const user = await User.create({
    email: 'completely@valid.com',
    username: 'andnotsuspicious',
    password: 'usernameAndPassword'
  })
  const gory = await Category.create({
    description: 'dubious topics',
    userId: user._id,
  });
  expect(gory.userId).toEqual(user._id);
  expect(gory.description).toEqual('dubious topics');
  expect(gory.isDefault).toEqual(false);
});

test('a different user can make the same category,\n   and then make a second category', async () => {
  const user = await User.create({
    email: 'anothercompletely@valid.com',
    username: 'andonlysortasuspicious',
    password: 'usernameAndPassword'
  })
  const gory = await Category.create({
    description: 'dubious topics',
    userId: user._id,
  });
  expect(gory.userId).toEqual(user._id);
  expect(gory.description).toEqual('dubious topics');
  expect(gory.isDefault).toEqual(false);
  
  const gory2 = await Category.create({
    description: 'duplicate topics',
    userId: user._id,
  });
  expect(gory.userId).toEqual(user._id);
  expect(gory2.description).toEqual('duplicate topics');
  expect(gory2.isDefault).toEqual(false);
});

test('a user cannot make an identical category,\n   but they can duplicate a default category', async () => {
  const user = await User.create({
    email: 'last@valid.com',
    username: 'itsbeenmethewholetime',
    password: 'usernameAndPassword'
  })
  const gory = await Category.create({
    description: 'duplicate topics',
    userId: user._id,
  });
  expect(gory.userId).toEqual(user._id);
  expect(gory.description).toEqual('duplicate topics');
  expect(gory.isDefault).toEqual(false);
  
  try{
    const gory2 = await Category.create({
      description: 'duplicate topics',
      userId: user._id,
    });
  }catch(e){
    expect(e).toBeInstanceOf(Error)
  }finally{
    const defCat = await Category.create({
      description: 'forrealforreal',
      isDefault: true,
    });
    const userCat = await Category.create({
      description: 'forrealforreal',
      userId: user._id,
    });
    expect(userCat.userId).toEqual(user._id);
    expect(userCat.description).toEqual('forrealforreal');
    expect(userCat.isDefault).toEqual(false);
  }
});