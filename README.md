###
I used Bootstrap to design the user interface.

I followed documentation to create a proper UI and backend.

There are two types of logins: Admin and User.

The Admin can:

Add new events

Register for events

Update events

Delete events

The User can:

View events

Book events

Cancel event bookings


### Backend Setup

1. Navigate to the server directory:
   ---> cd server

2. Install dependencies:
   ---> npm install

3. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

   ### Server
   `cd server` - Go inside the folder server
   `npm run dev` - Start the development server

### Server
- `npm run dev` - Start the development server with nodemon
- `npm start` - Start the production server


### Backend Setup
1. Navigate to the server directory:
   ---> cd client

2. Install dependencies:
   ---> npm install

 ### client
   `cd client` - Go inside the folder client
   `npm run dev` - Start the development server
