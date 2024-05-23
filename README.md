                                      |_|                     
                                        
Project: Job Interviews Tracker

Description:
------------
This project is a web application designed to help users track job interviews. It allows users to add, edit, and delete companies, as well as manage interview details and track the status of their interviews.

Files Included:
---------------
1. index.html       - Main HTML file containing the structure of the web application.
2. styles.css       - CSS file containing styles for the web application.
3. script.js        - JavaScript file containing the functionality of the web application.
4. companies.json   - JSON file containing initial data for companies and their interview details.

Setup Instructions:
-------------------
1. Ensure you have a web server to host the application. You can use a simple HTTP server for testing purposes.
2. Place all the included files in the same directory on your server.
3. Run the server. For example, you can use Python's built-in HTTP server:
   - Open a terminal/command prompt.
   - Navigate to the project directory.
   - Run the command: python -m http.server
   - Open your web browser and go to: http://localhost:8000/index.html

Usage:
------
1. Open the application in your web browser.
2. To add a new company, click the "הוספת חברה" button. Fill out the form and click "שמור".
3. To save changes to the companies list, click the "שמירת שינויים" button. This will download the updated companies.json file.
4. To load a new companies.json file, click the "טעינת קובץ" button and select the desired file.
5. To edit a company, click the "ערוך" button next to the company you wish to edit.
6. To delete a company, click the "מחק" button next to the company you wish to delete.
7. To mark a company as "עבר" or "לא עבר", click the corresponding button.

Additional Information:
-----------------------
- The project uses the 'Rubik' font from Google Fonts.
- The application is designed with right-to-left (RTL) text direction for Hebrew language support.
- The modal forms allow for adding/editing companies and their next steps in the interview process.
- Ensure the companies.json file is correctly formatted to avoid errors during file loading.

Troubleshooting:
----------------
- If the companies data does not load, check the browser console for error messages.
- Ensure that the companies.json file is properly formatted and accessible by the web server.
- If buttons are not functioning as expected, ensure that the script.js file is correctly linked and loaded.
