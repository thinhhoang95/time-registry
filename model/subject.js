import mongoose from 'mongoose';

let SubjectSchema = new mongoose.Schema({
    subjectName: String,
    cardId: String,
    description: String
});

export default mongoose.model('subject', SubjectSchema);