const Project = require('../models/Project.js');

module.exports.ProjectShow = async (req, res) =>{
    try{
        const projects = await Project.find({});
        res.render('pages/project', {projects});
    }catch(err){
        res.status(500).send('Internal Server Error');
    }
}

module.exports.newProjectGet = (req, res) =>{
    res.render('pages/newProject.ejs');
}

module.exports.newProjectPost = async (req, res) =>{
    let { title, description, image, gitLink } = req.body;
    try{
        let project = new Project({
        title : title,
        description : description,
        image : {
            url : image
        },
        gitLink : gitLink
    });
    await project.save();
    res.redirect('/main/project');
    }catch(err){
        res.status(500).send("Backend error");
    }
}

module.exports.editGet = async (req, res) => {
    let {id} = req.params;
    let projectDetail = await Project.findById(id);
    res.render('pages/editProject.ejs', {projectDetail});
}
module.exports.editPatch = async (req, res) =>{
    let {id} = req.params;
    let {title, description, image, gitLink} = req.body;
    await Project.findByIdAndUpdate(id, {title : title, description : description, image : {url : image}, gitLink : gitLink});
    res.redirect('/main/project');
}

module.exports.DeleteProject = async (req, res) =>{
    let {id} = req.params;
    await Project.findByIdAndDelete(id);
    res.redirect('/main/project');
}