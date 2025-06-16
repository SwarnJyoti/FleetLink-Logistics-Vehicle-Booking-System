git clone Repository

For Frontend:

cd fleetlink-logistics
cd Client 
npm install

create .env in /client 
REACT_APP_API_URL=http://localhost:5000


npm start


For Backend:

cd Server
npm install

create .env in /server
PORT=5000
MONGO_URI=mongodb://localhost:27017/fleetlink

npm start


For Testing:

create .env.test in /server
MONGO_URI=mongodb://localhost:27017/fleetlink_test

npm test


