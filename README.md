Navigate to Project Folder
cd 6WCSERVER-Final-Project
Part 2: Setup Frontend
Step 1: Navigate to Frontend Folder
cd front-end
Step 2: Install Frontend Dependencies
npm install
Expected output: added XXX packages in XXs
Step 3: Fix Any Vulnerabilities
npm run lint -- --fix
Part 3: Setup Backend
MongoDB Setup
Step 1: Create MongoDB Account
1.	Go to https://www.mongodb.com/cloud/atlas
2.	Click "Try Free"
3.	Sign up with email or Google
Step 2: Create Cluster
1.	Choose "M0 FREE" tier 
o	If "Free" isn't available, login with another email or Google
2.	Select a cloud provider (AWS, Google Cloud, or Azure)
3.	Choose region closest to you (e.g., Singapore for Philippines)
4.	Cluster name: fixify-cluster
5.	Click "Create Cluster"
Step 3: Get Connection String
Create Database User:
1.	This should automatically pop up. If it doesn't, click "Cluster" on the left sidebar and click "Connect" button
2.	Username: fixify_admin
3.	Password: Auto-generate → Copy the password
4.	Click "Create Database User"
5.	Click "Drivers" 
o	Driver: Node.js
o	Version: 6.7 or later
6.	Copy the connection string (looks like):
   mongodb+srv://fixify_admin:<password>@fixify-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
7.	Replace <password> with the password you copied earlier
Step 4: Configure Database Access
1.	Left sidebar: Click "Database Access"
2.	Click "Add New Database User"
3.	Username: fixify-user
4.	Password: Click "Autogenerate Secure Password" → COPY THIS PASSWORD
5.	Database User Privileges: "Read and write to any database"
6.	Click "Add User"
Note: Save this password for the JWT_SECRET later
Step 5: Configure Network Access
1.	Left sidebar: Click "Network Access"
2.	Click "Add IP Address"
3.	Click "Allow Access from Anywhere" (for development)
4.	Click "Confirm"
Part 4: Run the Backend
Step 1: Open Command Prompt
Open a new terminal/command prompt window
Step 2: Navigate to Backend Folder
cd Documents  # or wherever you saved/cloned the project
cd 6WCSERVER-Final-Project
cd fixify-backend
Step 3: Install Backend Dependencies
 
npm install
Step 4: Create .env File
Create an .env file in the fixify-backend folder and paste:
PORT=5000
MONGO_URI=mongodb+srv://fixify_admin:<your-password>@fixify-cluster.xxxxx.mongodb.net/fixifyDB?retryWrites=true&w=majority&appName=fixify-cluster
JWT_SECRET=<your-JWT-password>
NODE_ENV=development
Replace:
•	<your-password> with the fixify_admin password
•	<your-JWT-password> with the fixify-user password
Step 5: Create Admin User
node src/utils/createAdmin.js
Step 6: Start Backend Server
npm run serve
Part 5: Run the Frontend
Step 1: Open Frontend Terminal
Open another Command Prompt/Terminal window
Step 2: Navigate to Frontend Folder
cd Documents  # or wherever you saved/cloned the project
cd 6WCSERVER-Final-Project
cd front-end
Step 3: Start Frontend Server
npm run serve
Step 4: Open Browser
Go to: http://localhost:8080
________________________________________
That's it! The app is running. 🎉
Troubleshooting
•	Make sure both frontend and backend servers are running simultaneously
•	Check that MongoDB connection string is correct in .env file
•	Verify all passwords are correctly copied without extra spaces
•	Ensure your IP address is whitelisted in MongoDB Network Access

