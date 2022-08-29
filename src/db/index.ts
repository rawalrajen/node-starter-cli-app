import mongoose from 'mongoose';
import * as config from '../configs/index.config';

//Set up default mongoose connection
const mongoDB = `${config.default.mongodb.host}/${config.default.mongodb.db}`;
mongoose.connect(mongoDB);

//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


const transactionSchema = new mongoose.Schema({
    token: String,
    transaction_type: String,
    amount: Number,
    timestamp: Number,
    transaction_date: String,
});

transactionSchema.index({ token: 1 })

export const Transaction = mongoose.model('transactions', transactionSchema);

export default db;