# Team Booq
### Booq Dane's Beautiful Bed and Breakfast and Breakdancing Camp

**To Run:**

1. Run "npm install" to install node modules
2. Copy the ".env.sample" file as ".env" and update the file with your database credentials
3. Run the following command to start with node: "npm run start"
4. Optional - run using forever: "npm run forever-start" and stop forever process with "npm run forever-stop"

**Database**

app.js pulls the database connection pool in as the variable "db" - use that to run queries and pass as dependencies to modules, if needed. app.js line 17 has an example route to insert a cat - uncomment to test. "db" works exactly the same way as "pool" did in the CS290 examples, but it's abstracted away to make it easy to switch out or replace during automated testing (if we use that).