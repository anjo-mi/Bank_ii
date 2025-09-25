### Table of Contents
- [Tech](#tech-stack)
- [Setup](#setup)
- [Running Tests](#running-tests)
- [Seeding](#seeding)
- [Performance](#performance)
- [Current Features](#current-features)
- [In the Works](#ensuing-updates)


## Current Status
- 🚫 In Production 🚫

## Overview
- Learning Platform for Studying Questions
- Store Questions with associate Categories
- User-focused Searches for Questions by Category or ID

### Tech Stack
- Node.js, Express, MongoDB, EJS, Tailwind
- Testing:
   * Jest, Supertest, Playwright
- Performance:
   * Platformatic: Flame

# Setup
- ```npm install```
- Create .env file in the root of project
   * ```
     PORT
     DB_PASSWORD (optional)
     DB_STR=mongodb+srv...mongodb.net/app?...
     DB_TEST_STR=mongodb+srv...mongodb.net/app-test?...
     ```
- ```npm run dev```
   * Via npm-run-all, Live CSS via Tailwind and Nodemon will runn concurrently

## Running Tests
⚠️ Some tests require data in the database. If you need to populate your database, see [Seeding](#Seeding) ⚠️

- Only Jest Tests ran individually: `npm run test:reqs`
Interchange these files in the package.json script to run accordingly:
   * /questionByCategory
   * /questionById
- All Jest Test Suites are ran via the same command: `npm run test`
- Playwright Tests are ran by Category
   * Displays: `npm run test:displays`
   * Errors: `npm run test:errors`
   * Filtering Logic: `npm run test:filters`
   * Models: `npm run test:models`
     * ⚠️ See [Seeding](#Seeding) about repopulating the database after running a model test ⚠️
   * Navigation: `npm run test:nav`
   * Setup: `npm run test:setup`
   * Routes: `npm run test:routes`
   * Playwright Requests: `npm run test:pwreqs`
 
## Seeding
- You may populate the database with functional generic data via the command `npm run seed`

## Performance
⚠️ Due to configuration issues, this is a two step process! ⚠️
- Run: `npm run fire`
   * Flame Graphs will be generated as a .pb file and stored in node_modules/@platformatic/bin
- Run: `npm run fire:convert`
   * .pb files will be processed into .html files and placed in the root of the project with its accompanying .js file
- Open HTML File in Default Browser

## Current Features
- Cross Device Styling and Functionality
- Database Connection and Model Logic
- Navigation
- Refined Search with keyword matching

## Ensuing Updates
- Users with personalized:
   * Questions, Categories
   * Answer Storage
   * Interview Mode
- Voice-to-Text
- AI Feedback and Follow-Up Questions


##### Expected Date MVP
- 9 Nov 2025
