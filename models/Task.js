const mongoose = require('mongoose');


const taskSchema = new mongoose.Schema({
    owner:{
        type:String,
        required:[true,'owner is not set to task']
    },
    title:{
        type:String,
        required:[true,'title required']
    },
    desc:{
        type:String,
        required:[true,'description required']
    },
    status:{
        type:String,
        required:true,
        enum:['Backlog','Inprogress','Completed'],
        default:'Backlog'
    },
})


const Task = mongoose.model('task',taskSchema);

module.exports = Task;