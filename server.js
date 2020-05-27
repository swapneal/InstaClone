const express = require('express');
const mongoose = require('mongoose');

const app = express();

const PORT = 5001;

const { MONGODB_URI } = require('./config/keys');

require('./models/user');
require('./models/post');

const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');
const userRoute = require('./routes/user');

const connectDB = async () => {
	try {
		const connection = await mongoose.connect(MONGODB_URI, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useUnifiedTopology: true,
		});
		console.log(`Mongo DB Connected: ${connection.connection.host}`);
	} catch (err) {
		console.log(`Error from MONGO DB: ${err.message}`);
		process.exit(1);
	}
};

connectDB();

app.use(express.json());
app.use(authRoute);
app.use(postRoute);
app.use(userRoute);

app.listen(PORT, () => {
	console.log(`Server is running in port ${PORT}`);
});
