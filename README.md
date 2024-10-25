# Rule Engine with AST

# Usage
Run git clone in terminal

 git clone https://github.com/jatinxkirito/RuleEngine_ATS.git
In zeotap_backend folder

Create config.env file with following content
 DATABASE_LINK="Your MongoDB database link"
Run following in terminal
  npm install
  npm start
In zeotap__frontend folder

Run following in terminal
  npm install
  npm run dev
Open http://localhost:5173 in you browser

To run tests, go to zeotap_backend folder and run following command in terminal

 npx mocha --file test/testSetup.js test/**/*.test.js
