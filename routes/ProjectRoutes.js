const express = require('express');
const router = express.Router()

const Project = require('../models/Project.js')

const projectController = require('../controller/ProjectController.js');
const { isLoggedin } = require('../middleware.js');

router.get('/', projectController.ProjectShow);

router.get('/add', isLoggedin, projectController.newProjectGet);
router.post('/add',isLoggedin, projectController.newProjectPost); 

router.get('/:id/edit',isLoggedin, projectController.editGet);
router.patch('/:id/edit',isLoggedin, projectController.editPatch);

router.delete('/:id/delete',isLoggedin, projectController.DeleteProject);

module.exports = router;