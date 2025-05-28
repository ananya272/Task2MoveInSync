 Project Overview
The UI is built using Bootstrap for a clean and responsive interface.

Proper use of documentation ensured a well-structured frontend and backend.

There are two types of logins: Admin and User.

👤 Admin Features:
Can add new events.

Can register for any event.

Can update existing events.

Can delete any event.

🙋‍♂️ User Features:
Can book/register for events.

Can cancel their registrations.

Can view available events.

⚙️ Backend Setup
Navigate to the server directory:

bash
Copy
Edit
cd server
Install server-side dependencies:

bash
Copy
Edit
npm install
Configure environment variables:
Create a .env file inside the server folder and add the following:

env
Copy
Edit
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
Run the backend server:

Development mode (with auto-reload):

bash
Copy
Edit
npm run dev
Production mode:

bash
Copy
Edit
npm start
💻 Frontend (Client) Setup
Navigate to the client directory:

bash
Copy
Edit
cd client
Install client-side dependencies:

bash
Copy
Edit
npm install
Start the frontend development server:

bash
Copy
Edit
npm run dev
Agar tu chahe to main ek README.md file bhi ready kar deta hoon is content ke saath. Bata de agar chahiye.
