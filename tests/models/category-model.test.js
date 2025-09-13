import mongoose from "mongoose";
import models from "../../models/index.js";
const { Category } = models;
import { jest } from "@jest/globals";
import dotenv from "dotenv";
dotenv.config();
beforeAll(async () => {
  await mongoose.connect(process.env.DB_TEST_STR);
});

// jest.useFakeTimers();

const category1 = {
  desc: "Behavioral",
  def: true,
  res: `description "behavioral" and default "true" should pass`,
};
const category2 = {
  desc: "HTML",
  def: true,
  res: `description "HTML" and default "true" should pass`,
};
const category3 = {
  desc: "JavaScript",
  def: true,
  res: `description "JS" and default "true" should pass`,
};
const category4 = {
  desc: "React",
  def: false,
  res: `description "react" and default "false" should pass`,
};
const category5 = {
  desc: 0,
  def: false,
  res: `description "Number" and default "false" should pass (number coerced to string)`,
};
const category6 = {
  desc: "MongoDB",
  def: null,
  res: `description "mongo" and default "null" should fail`,
};
[category1, category2, category3, category4, category5].forEach((cat) => {
  test(cat.res, async () => {
    const gory = await Category.create({
      description: cat.desc,
      isDefault: cat.def,
    });
    expect(gory.description).toEqual(cat.desc.toString());
    expect(gory.isDefault).toEqual(cat.def);
  });
});

[category6].forEach((cat) => {
  test(cat.res, async () => {
    expect.assertions(1);
    try {
      const gory = await Category.create({
        description: cat.desc,
        isDefault: cat.def,
      });
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });
});
