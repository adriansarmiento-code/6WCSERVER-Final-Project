Fixify Setup Guide
Prerequisites
1. Install Node.js
Download and install Node.js (includes npm) from: https://nodejs.org/

3. Verify Installation
Open Command Prompt or Terminal and run:
node --version  # Should show v18+ or v20+
npm --version   # Should show v8+ or v10+

5. Install Vue CLI Globally
npm install -g @vue/cli

7. Verify Vue CLI Installation
vue --version  # Should show @vue/cli 5.x.x

Part 1: Clone the Project
Navigate to Your Desired Directory
cd Desktop  # or cd Documents

Clone Repository
git clone https://github.com/adriansarmiento-code/6WCSERVER-Final-Project.git

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
Step 1: Create MongoDB Account (Preferably new mongodb account)

Go to https://www.mongodb.com/cloud/atlas
Click "Try Free"
Sign up with email or Google

Step 2: Create Cluster

Choose "M0 FREE" tier

If "Free" isn't available, login with another email or Google

Select a cloud provider (AWS, Google Cloud, or Azure)
Choose region closest to you (e.g., Singapore for Philippines)
Cluster name: fixify-cluster
Click "Create Cluster"

Step 3: Get Connection String
Create Database User:

This should automatically pop up. If it doesn't, click "Cluster" on the left sidebar and click "Connect" button
Username: fixify_admin
Password: Auto-generate → Copy the password
Click "Create Database User"
Click "Drivers"

Driver: Node.js
Version: 6.7 or later


Copy the connection string (looks like):

   mongodb+srv://fixify_admin:<password>@fixify-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority

Replace <password> with the password you copied earlier

Step 4: Configure Database Access

Left sidebar: Click "Database Access"
Click "Add New Database User"
Username: fixify-user
Password: Click "Autogenerate Secure Password" → COPY THIS PASSWORD
Database User Privileges: "Read and write to any database"
Click "Add User"

Note: Save this password for the JWT_SECRET later
Step 5: Configure Network Access

Left sidebar: Click "Network Access"
Click "Add IP Address"
Click "Allow Access from Anywhere" (for development)
Click "Confirm"

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
<your-password> with the fixify_admin password
<your-JWT-password> with the fixify-user password

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

That's it! The app is running. 🎉
Troubleshooting

Make sure both frontend and backend servers are running simultaneously
Check that MongoDB connection string is correct in .env file
Verify all passwords are correctly copied without extra spaces
Ensure your IP address is whitelisted in MongoDB Network Access
