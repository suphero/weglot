import mongoose from 'mongoose';

const OwnerSchema = new mongoose.Schema({});

export default mongoose.model('Owner', OwnerSchema);