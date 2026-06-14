# Web Technologies Capstone Project: Healthy Bite
**Student Name:** Muhammad HASNAIN
**Roll Number:** F24BDOCS1M01059

## Project Description
Healthy Bite is a web application designed to help users calculate and track their meal plan goals. It features a User Panel for submitting profile metrics and an Admin Panel for tracking community statistics and managing profiles. 

## Features
- **User Panel:** 
  - Submits profiles (POST) via an inline-validated form.
  - Fetches and displays a list of profiles (GET).
  - Filters profiles by cuisine type.
- **Admin Panel:**
  - Displays all profiles in a data table (GET).
  - Calculates three dynamic statistics: Total Profiles, Average Age, and Total Weight to Lose.
  - Edits existing profiles (PATCH).
  - Deletes profiles with a confirmation prompt (DELETE).
- **Tech Stack:** HTML5, Custom CSS, Vanilla JavaScript (ES6+), JSON Server.

## How to Install and Run
1. Ensure Node.js is installed on your computer.
2. Open a terminal in the root folder of this project.
3. Install JSON Server globally (if not already installed): `npm install -g json-server`
4. Start the backend mock database: `npx json-server --watch db.json`
5. Open `index.html` in your preferred web browser to view the application.