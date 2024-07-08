
# React Real-Esate Project
### Description

This project is a user authentication system built with React, Redux, and a Node.js backend. It includes features such as user sign-in, sign-up, and password update functionality.

## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://sudarsancse.github.io/Portfolio/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sudarsan-sarkar-a59b2825a)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/)


## Table of Contents

 - [Installation]()
 - [Usage]()
 - [Features]()
 - [Folder Structure]()
 - [Contributing]()

 
## Demo

https://real-estate-gvqm.onrender.com/



## Installation

Clone the repository:

```bash
  git clone https://github.com/sudarsancse/Real-Estate.git
```
Navigate to the project directory:

```bash
  cd your-repo-name or  cd Real-Estate
```
Now go to Client folder

```bash
  cd client
```
make  .env file
```bash
  touch .env
```

## Environment Variable

To run this project, you will need to add the following environment variables to your .env file

`REACT_APP_API_KEYL`

Run below commend

```bash
  npm i
```
And then Run the client

```bash
  npm  start
```
## For backend
Navigate to the backend directory:
```bash
  cd server
```
Install backend dependencies:

```bash
  npm  i
```
Set up environment variables (create a `.env` file in the backend directory):

```bash
  cd .. 
```
And then
```bash
  touch .env
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGO_URL`

`SECRETKEY_JWT`

`RAZORPAY_KEY_ID`

`RAZORPAY_SECRET`

`SMPT_USER`

`SMPT_PASS`


Start the backend server:

```bash
  cd server
  npm I 
  nodemon dev
```
## Usage/Examples

- Visit http://localhost:3000 in your browser.
- You can sign up for a new account, sign in with an existing account, manage property listings, update your profile, and interact with property landlords.


## Folder Structure
```bash
  your-repo-name/
    ├── client/
    |     ├── src/
    │     │    ├── components/
    │     │    |      └── pages/
    │     │    ├── Redux/
    │     │    ├── App.js 
    │     │    ├── App.test.js
    │     │    ├── fireBase.js
    │     │    ├── index.css
    │     │    ├── index.js
    │     │    ├── reportWebVitals.js
    │     │    └── setupTests.js
    │     ├── tailwind.config.js
    │     ├── package-lock.json
    │     ├── .env
    │     ├── .gitignore
    │     └──  package.json
    │     
    ├── .gitignore     
    ├── .env
    ├── package-lock.json
    ├── package.json
    └── README.md

```
## Contributing

Contributions are always welcome! Please follow these steps:

- Fork the repository.

- Create a new branch:

    ```bash
      git checkout -b feature-name
    ```
- Make your changes and commit them:

    ```bash
      git commit -m 'Add some feature' Push to the branch
    ```
- Push to the branch:

    ```bash
      git push origin feature-name' 
    ```

Please adhere to this project's `code of conduct`.


## Features

 - User sign-up and [sign-in](https://real-estate-gvqm.onrender.com/sign-in)
 - Create, update, and delete property listings
 - User profile [Update](https://real-estate-gvqm.onrender.com/sign-in)
 - Delete User account [Delete](https://real-estate-gvqm.onrender.com/sign-in)
 - Buy property and contact landlords[page](https://real-estate-gvqm.onrender.com/)
