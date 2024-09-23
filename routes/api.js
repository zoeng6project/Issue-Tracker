'use strict';

const IssueModel = require("../models").Issue;
const ProjectModel = require("../models").Project;

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(async (req, res) => {
      let projectName = req.params.project;

      try {
        // Find the project, project name should not duplicated , so it's findOne
        const project = await ProjectModel.findOne({ name: projectName });
        
        // Check if the project exists
        if (!project) {
          return res.json({ error: "Project not found" });
        }
    
        // Build filter object key : value
        const filters = { projectId: project._id };
    
        // Loop through query parameters and add them to filters
        for (const key in req.query) {
            filters[key] = req.query[key];
        }
    
        // Find all issues that match the filters
        const issues = await IssueModel.find(filters);
    
        // Return the issues as an array
        res.json(issues);
      } catch (err) {
        console.error(err);
        res.json({ error: "Error fetching issues" });
      }
      
    })
    
    .post(async (req, res) => {
      let projectName = req.params.project;
      try{
      const {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
      } = req.body;

      if(!issue_title || !issue_text || !created_by){
        res.json({error: "required field(s) missing"});
        return;
      }

        let project = await ProjectModel.findOne({ name: projectName });
        if (!project){
          project = new ProjectModel({ name: projectName });
          await project.save();
        } 

        const newIssue = new IssueModel({
          projectId: project._id,
          issue_title: issue_title || "",
          issue_text: issue_text || "",
          created_on: new Date(),
          updated_on: new Date(),
          created_by: created_by || "",
          assigned_to: assigned_to || "",
          open: true,
          status_text: status_text||""
        })

        await newIssue.save(); 
        res.json({
          _id: newIssue._id,
          issue_title: newIssue.issue_title,
          issue_text: newIssue.issue_text,
          created_on: newIssue.created_on,
          updated_on: newIssue.updated_on,
          created_by: newIssue.created_by,
          assigned_to: newIssue.assigned_to || "",
          open: newIssue.open,
          status_text: newIssue.status_text || ""
        });

      }catch(err){
        console.error(err); 
        res.json({ error: "error saving the post" });
      }

      })

      
    
    
    .put(async (req, res) => {

      try{
      let projectName = req.params.project;

      const {
        _id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open,
      } = req.body;


      if(!_id){
        res.json({error: 'missing _id' });
        return
      }

      if(
        !issue_title && 
        !issue_text &&
        !created_by &&
        !assigned_to &&
        !status_text &&
        !open ){
          res.json({error: 'no update field(s) sent', '_id': _id});
        return
      }

        let issue = await IssueModel.findOne({ _id: _id});

        if(!issue){
          res.json({error: 'could not update', '_id': req.body._id || 'unknown'});
          return
        } else {
            await IssueModel.updateOne({ _id: _id },{issue_title : issue_title , issue_text : issue_text , created_by : created_by,assigned_to : assigned_to,status_text : status_text});
            const isOpen = Boolean(open)
            if(issue.open != isOpen){
              await IssueModel.updateOne({ _id: _id },{open : isOpen});
            }

          await IssueModel.updateOne({ _id: _id }, {updated_on : new Date()});
          res.json({result: 'successfully updated', '_id': _id});
          return
        }


      }catch(err){
        res.json({error: 'could not update', '_id':req.body._id || 'unknown'});
      }

      
    })
    
    .delete(async (req, res) => {
      let projectName = req.params.project;

      const {
        _id
      } = req.body;

      if(!_id ){
        res.json({error: 'missing _id'});
        return;
      }else{
        try {
          const result = await IssueModel.deleteOne({ _id : _id });
          if(result.deletedCount > 0){
          res.json({result: 'successfully deleted', '_id': _id });
          } else {
            res.json({error: 'could not delete', '_id': _id });
          }
        } catch(err){
          console.error(err);
          res.json({error: 'could not delete', '_id': _id });
        }
      }

      
    });
    
};
