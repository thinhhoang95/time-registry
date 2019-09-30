import mongoose from 'mongoose';

let RegistrySchema = new mongoose.Schema({
    date: Date,
    cardId: String
});

export default mongoose.model('registry', RegistrySchema);