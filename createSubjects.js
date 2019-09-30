import mongoose from 'mongoose';
import Subject from './model/subject';

const createDefaultSubjects = async () => {
    let sj = new Subject(
        {
            subjectName: 'MASTER THESIS',
            cardId: '4A:4C:EF:0B',
            description: 'To design and realize an algorithm that can robustly land a helicopter on a visually detected helipad'
        }
    );
    await sj.save();
    console.log('Subject 1 created');
    sj = new Subject(
        {
            subjectName: 'UNIVERSITY ADMINISTRATION',
            cardId: '09:01:C0:8E',
            description: 'To perform administrative tasks at the university'
        }
    );
    await sj.save();
    console.log('Subject 2 created');
    sj = new Subject(
        {
            subjectName: 'COMPANY WORK',
            cardId: '29:BE:FB:8E',
            description: 'To design and perform maintenance tasks for software at companies'
        }
    );
    await sj.save();
    console.log('Subject 4 created');
    sj = new Subject(
        {
            subjectName: 'HOBBY',
            cardId: '19:6C:04:8E',
            description: 'To perform enjoyable things such as hobbies, playing sports, meditation etc'
        }
    );
    await sj.save();
    console.log('Subject 5 created');
}

mongoose.connect('mongodb://root:Thinh24051995@103.7.41.173:27017/workregistry?authSource=admin', { useNewUrlParser: true });
createDefaultSubjects();