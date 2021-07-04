# Objectives and Key Results

A simple Objectives and Key Results Project

## The Goal

Create a simplistic OKR tracker thats cloud based

## Requirements

- [ ] Node Express API
  - [x] Objective CRUD routes
  - [ ] Objective virtual Key Results
  - [x] Objective Search, Filter, Sort, etc
  - [x] Key Results CRUD routes
  - [x] Key Results virtual Objectives
  - [ ] Key Results Search, Filter, Sort, etc

- [x] Mongo Database
  - [x] Cloud based cluster
  - [x] Mongoose Models/ORM

- [ ] Protected Routes
  - [x] User Sign Up
    - [x] Bcrypt
    - [x] JSON Web Tokens
    - [x] Hashed Passwords Pre Save
    - [x] Respond with Signed JSON web token
  - [ ] User Login
  - [ ] Protected Non Public Routes For Individual OKRs/KPIs
  - [ ] User Avatar

- [ ] Front End?
- [ ] Mobile?

## How to Install

Clone/Fork the repro here -> <https://github.com/udemonia/okr-api/blob/master/seeder.js>

> npm install

create a .env file in config folder - **see exampleEnv for environment variables**

## How to run local dev

Once you've updated the .evn with your mongo db connection url, and ran 'npm install', run the below

> npm run dev
  