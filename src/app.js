import Project from "./project.js";

export default class App{
    constructor(){
        this.projectList = [];
        this.projectList.push(new Project('Inbox'));
        this.projectList.push(new Project('Today'));
        this.projectList.push(new Project('Upcoming'));
    }
    // GETTERS AND SETTERS //
    getProjectList(){
        return this.projectList;
    }
    setProjectList(newList){
        this.projectList = newList;
    }
    getProject(projectName){
        // returns the first element that satisfies the condition
        return this.projectList.find((project) => project.name === projectName.name);
    }
    // METHODS //
    addProject(newProject){
        // only add to project list if project doesnt exist.
        if(this.projectList.find((project) => project.name === newProject.name)){
            return;
        }
        this.projectList.push(newProject);
    }
    deleteProject(projectName){
        // check if projectlist contains project
        // if it does, remove the project from list.
        if(this.projectListContains(projectName)){
            this.projectList.splice(
                this.projectList.indexOf(
                    getProject(projectName)),1);
        }
        return;
    }
    // HELPERS // 
    projectListContains(projectName){
        // returns true if found, false if not.
        return this.projectList.some(project => project.name === projectName);
    }
}