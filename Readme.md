git clone https://github.com/SwarnJyoti/FleetLink-Logistics-Vehicle-Booking-System.git

cd fleetlink-logistics

For Frontend:

cd  Client
npm install

create a .env file in /Client with:
REACT_APP_API_URL=http://localhost:5000/api

npm start


For Backend:

cd server
npm install

create a .env file in /Server with :
PORT=5000
MONGO_URI=mongodb://localhost:27017/fleetlink


npm start


For Testing:

create a file named .env.test inside /Server with:
MONGO_URI=mongodb://localhost:27017/fleetlink_test

npm test

