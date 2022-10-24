import Project from "./project.js";
export default class Storage{
    constructor(){
        this.projectList = [];
        this.projectList.push(new Project('Inbox'));
        this.projectList.push(new Project('Today'));
        this.projectList.push(new Project('Upcoming'));
    }
    // GETTERS AND SETTERS //
    static getProjectList(){
        return this.projectList;
    }
    static setProjectList(newList){
        this.projectList = newList;
    }
    // METHODS //
    static addProject(project){
        this.projectList.push(project);
    }
    static containsProject(project){
        return this.projectList.find(project);
    }
}