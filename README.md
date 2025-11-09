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
- Store Questions with Associated Categories
- Guest features enabled
  - Generic Question Pool
    - Category Selection
    - Question and Answer Mode
- User-focused Searches for Questions by Category or ID
- User access and Session persistence
- Protected Routes ensuring authorization
- Rate Limiting for added Security

### Tech Stack
- Node.js, Express, MongoDB, EJS, Tailwind
- Testing:
   * Jest, Supertest, Playwright
- Performance:
   * Platformatic: Flame
- Authentication:
   * Passport.js

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
   * Via npm-run-all, Live CSS via Tailwind and Nodemon will run concurrently

## Seeding
- You may populate the database with functional generic data via the command `npm run seed`
   * It is recommended to load users via the endpoint rather than seeding, as seeding skips the user password encryption step.

## Performance
⚠️ Due to configuration issues this is a two step process! ⚠️
- ⚠️ If you wish to use the same performance measuring set up, it is recommended to look into newer versions from platformatic or to request the necessary updates to `/node_modules/@platformatic/flame/bin` and `flame.js`
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
- User Flow and Auth

User Features:
  - Unique Username and Email
  - Practice Session with answer storage
  - Update, edit, delete questions
  - Proper error handling and form validation
  - Guest Access with Limitations
  - Navigation and Menu animations
  - Session storage and lookup

## Ensuing Updates
- Voice-to-Text
- AI Feedback and Follow-Up Questions

## Possible Updates
- Communications / Answer Posting Pages

##### Expected
- 17 Dec 2025
