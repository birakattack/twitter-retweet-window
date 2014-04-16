## Twitter Retweet Analyzer

* Run npm install to get all necessary dependencies for the project
* Add Twitter Streaming API credentials in index.js before running application
* Command to run application:
  - *node index.js {size of window in minutes}*
  - i.e. *node index.js 5* - this will start the application and give a window size of 5 minutes
* The application returns a list with the following format:
  - {TWEET DATE} {TWEET ID} {RETWEET_COUNT}
