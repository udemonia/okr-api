# Objectives and Key Results

OKRs are comprised of **Objectives** (*some desireable outcome you'd like to produce*) and **Key Results** (*measurable indicators to track success*). OKRs are used to define how to track goals with measurable actions that gage success. A 70% success rate is typically desirable

## Good OKRs

Typically, you want 3-5 **Objectives** to strive for over a fiscal quarter

Each **Objective** should have 3-5 **Key Results** that measure success in achieving the **Objective**

## Why this app?

OKR tracking software is cumbersome, overly complicated and requires a high LOE to set and track OKRs. It's also difficult to access browser software via a mobile device and vice versa

## Our goal in creating the app

Define an **Objective** and the time frame - typically a fiscal quarter. e.g. Q3 2021 (2021-07-01 - 2021-09-30)

Define some **Key Results** you can measure that indicate the success in achieving the **Objective**

Once the time frame begins, keep your **Key Results** up to date by simply updating the 'current value'

## Objective and key result % complete tracking

Current value / target value = key result % completed

The avg. of all key results % completed becomes the objective % completed

## Tech Stack

### Backend

- Node.JS
- MongoDb
- Mongoose

### Frontend

- React Native (*mobile*)
- React (*browser*)

### Objective Data Structure

``` json
  "atRisk": false,
  "percentComplete": 0,
  "_id": "6117e320fd7d720fa058935f",
  "name": "Take A Family Vacation",
  "description": "We need a Family Vacation, Preferably somewhere in Europe",
  "objectiveStartDate": "2021-07-01T00:00:00.000Z",
  "objectiveEndDate": "2021-09-30T00:00:00.000Z",
  "user": "60e2f4d5a85e1c5ba5fc999e",
  "slug": "take-a-family-vacation",
  "__v": 0
```

### Key Result Structure

Each **Key Result** belongs to an **Objective**

```json
        "atRisk": true,
        "progress": 50,
        "currentValue": 4000,
        "targetValue": 8000,
        "_id": "6117b8a43dafef88ed45c367",
        "name": "Save 8 Grand within the next 8 months",
        "description": "8 grand should allow us the funds needed for a all inclusive vacation",
        "objective": {
            "atRisk": false,
            "percentComplete": 50,
            "_id": "6117a57dcfe348f9d7865846",
            "name": "Take A Family Vacation",
            "description": "We need a Family Vacation, Preferably somewhere in Europe",
            "user": "60e2f4d5a85e1c5ba5fc995e",
            "slug": "brandon-go-on-a-vacation",
            "__v": 0,
            "id": "6117a57dcfe348f9d7865846"
        },
        "user": "60e2f4d5a85e1c5ba5fc995e",
        "tasks": [],
        "slug": "save-8-grand-within-the-next-8-months",
        "__v": 0,
        "id": "6117b8a43dafef88ed45c367"
````

----

## Requirements

- [ ] Node Express API
  - [x] Objective CRUD routes
  - [ ] Objective virtual Key Results
  - [x] Objective Search, Filter, Sort, etc
  - [x] Key Results CRUD routes
  - [x] Key Results virtual Objectives
  - [x] Key Results Search, Filter, Sort, etc

- [x] Mongo Database
  - [x] Cloud based cluster
  - [x] Mongoose Models/ORM
  - [x] Database Seeder

- [ ] Protected Routes
  - [x] User Sign Up
    - [x] Bcrypt
    - [x] JSON Web Tokens
    - [x] Hashed Passwords Pre Save
    - [x] Respond with Signed JSON web token
  - [x] User Login
    - [x] Compare two hashed passwords for a match
    - [x] Invalidate requests with incorrect email or password or missing values with the same response
    - [x] Respond with JSON Web Auth Token
    - [x] Respond with response Cookie for front end use
  - [x] Protected Non Public Routes For Individual OKRs/KPIs
    - [x] JSON Web Token parsed and checked for validation
    - [x] User associated with the parsed token
    - [x] Protect Objectives
    - [x] Protect Key Results
    - [ ] Get current logged in user
  - [ ] User Avatar
    - [ ] File Upload
    - [ ] Default sets to select...

- [ ] Decide Front-End Stack
  - [ ] Possibly React + React Native
  - [ ] Vue + Flutter
  - [ ] Angular + Flutter?
- [ ] Mobile

## How to Install

Clone/Fork the repro here -> <https://github.com/udemonia/okr-api/blob/master/seeder.js>

> npm install

create a .env file in config folder - **see exampleEnv for environment variables**

## How to run local dev

Once you've updated the .evn with your mongo db connection url, and ran 'npm install', run the below

> npm run dev
