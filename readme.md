1. Go to directory
   cd spam-detector-api

2. Install all necessary packages
   npm install

3. Running the Project
   npm run dev

To test your API endpoints, you can use tools like Postman to send HTTP requests to your server and verify responses.
testing of each functionality:

1. Testing User Registration

Endpoint: POST http://localhost:8001/api/register

Headers: Content-Type: application/json

Body (JSON):

{
"name": "John Doe",
"phoneNumber": "1234567890",
"email": "john@example.com",
"password": "password123"
}

Expected Response: A success message or the new user’s ID if the registration was successful.

2. Testing User Login
   Endpoint: POST http://localhost:8001/api/login

Headers: Content-Type: application/json

Body:

{
"phoneNumber": "1234567890",
"password": "password123"
}

Expected Response: A success message with an authentication token if login is successful.

3. Managing Contacts

a. Create a Contact:

Endpoint: POST http://localhost:8001/api/contacts
Headers: Content-Type: application/json, Authorization: Bearer <token>
Body:
{
"name": "Jane Smith",
"phoneNumber": "0987654321"
}

b. List Contacts:

Endpoint: GET http://localhost:8001/api/contacts
Headers: Authorization: Bearer <token>

6. Reporting Spam
   Endpoint: POST http://localhost:8001/api/report-spam
   Headers: Content-Type: application/json, Authorization: Bearer <token>
   Body:
   {
   "phoneNumber": "0987654321"
   }

7. Searching

a. Search by Name:

Endpoint: GET http://localhost:8001/api/search?name=Jane
Headers: Authorization: Bearer <token>

b. Search by Phone Number:

Endpoint: GET http://localhost:8001/api/search?phoneNumber=0987654321
Headers: Authorization: Bearer <token>
