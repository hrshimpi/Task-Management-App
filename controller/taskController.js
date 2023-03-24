const Task = require('../models/Task');


module.exports.addTaskRen = async (req, res) => {
    res.render('addTask');
}

module.exports.addTask = async (req, res) => {
    //post route
    const user = req.userId;
    const { title, desc } = req.body;
    try {
        await Task.create({ owner:user,title:title, desc:desc });
        res.status(201).redirect('/tasks')
    } catch (err) {
        res.status(400).json({error:err.message});
    }
}

module.exports.getAllTask =  async(req, res) => {

    const userID = req.userId;
    try {
        const data = await Task.find({"owner":userID});

        let t=0;
        res.render('tasks.ejs', { data:data }, t);

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

module.exports.getEditTask = async (req, res ) => {
    const tId = req.params.id;
    try {
    
        const taskData = await Task.findById(tId);

        res.render('editTask', {taskData});

    } catch (err) {
        res.status(500).json({message:err.message})   
    }
}

module.exports.editTask = async (req, res) => {

    try {
        let id = req.params.id;
        
        const utask = await Task.findById(id);

        if( utask === null ){
            return res.status(400).json({message:"task does not exists"});
        }

        if( req.body.title !== null ){
            utask.title = req.body.title;
        }
        if( req.body.desc !== null ){
            utask.desc = req.body.desc;
        }
        if( req.body.status !== null ){
            utask.status = req.body.status;
        }

        await utask.save();

        res.status(200).redirect('/tasks');
    } catch (err) {
        res.status(400).json({message:err.message})
    }
}

module.exports.deleteTask = async (req, res) => {
    try {

        const data = await Task.findById(req.params.id);
        if( data === null ){
            return res.status(400).json({message:"cannot find user"});
        }
        await data.remove();
        
        res.status(200).redirect("/tasks");
    } catch (err) {
        res.status(500).json({message:err.message})   
    }
}