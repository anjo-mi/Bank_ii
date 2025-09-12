import mongoose from "mongoose";
import models from "../models/index.js";
const { User } = models;
import { jest } from "@jest/globals";
import dotenv from "dotenv";
dotenv.config();
beforeAll(async () => {
  await mongoose.connect(process.env.DB_TEST_STR);
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});
// jest.useFakeTimers();

const user1 = {
  email: "p1@aol",

  password: "String",

  username: "person1",

  exp: "first use of email and username should pass",
};
const user2 = {
  email: "p2@aol",

  password: "String",

  username: "person1",

  exp: "first use of email, second use of username should pass",
};
const user3 = {
  email: "p1@aol",

  password: "thisisactuallyapasswordfightme",

  username: "iamnooneelse",

  exp: "second use of email, first on all else should fail",
};

test(user1.exp, async () => {
  const u = user1;
  const user = await User.create({
    email: u.email,
    password: u.password,
    username: u.username,
  });
  expect(user.email).toBe(u.email);
  expect(user.username).toBe(u.username);
  expect(user).toHaveProperty("_id");
});
test(user2.exp, async () => {
  const u = user2;
  const user = await User.create({
    email: u.email,
    password: u.password,
    username: u.username,
  });
  expect(user.email).toBe(u.email);
  expect(user.username).toBe(u.username);
  expect(user).toHaveProperty("_id");
});

test(user3.exp, async () => {
  const u = user3;
  expect.assertions(1);
  try {
    const user = await User.create({
      email: u.email,
      password: u.password,
      username: u.username,
    });
  } catch (e) {
    expect(e).toBeInstanceOf(Error);
  }
});
