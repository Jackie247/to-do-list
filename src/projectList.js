import { compareAsc, toDate} from "date-fns";
import Project from "./project.js";
import Task from "./task.js";

export default class ProjectList{
    constructor(){
        this.projectList = [];
        this.projectList.push(new Project('Inbox'));
        this.projectList.push(new Project('Today'));
        this.projectList.push(new Project('Upcoming'));
    }
    // GETTERS AND SETTERS //
    getProjects(){
        return this.projectList;
    }
    setProjects(projectList){
        this.projectList = projectList;
    }
    getProject(projectName){
        // returns the first element that satisfies the condition
        return this.projectList.find((project) => project.getName() === projectName);
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
                    this.getProject(projectName)),1);
        }
        return;
    }
    updateToday(){
        this.getProject('Today').taskList = [];
        // update the today list with only tasks that have todays date
        // check every project for tasks that have due date today
        this.projectList.forEach((project) => {
            // skip project today since its empty, and skip upcoming so we dont get duplicates
            if(project.getName() === 'Today' || project.getName() === 'Upcoming'){
                return;
            }
            const todayTasks = project.getTodaysTasks();
            todayTasks.forEach((task)=>{
                const newTask = `(${project.getProjectName()}) ${task.getTaskName()}`;
                this.getProject('Today').addTask(new Task(newTask, task.getDate(),task.getDetails()));
            })
        })
        
    }
    updateUpcoming(){
        this.getProject('Upcoming').taskList = [];
        // update incoming with only tasks that are within a week range.
        this.projectList.forEach((project)=>{
            // skip today since they will be in today inbox and skip upcoming since empty list.
            if(project.getName() === 'Today' || project.getName() === 'Upcoming'){
                return;
            }
            // create new tasks for upcoming. 
            const upcomingTasks = project.getUpcomingTasks()
            upcomingTasks.forEach((task) => {
                const taskName = `(${project.getProjectName()}) ${task.getTaskName()}`;
                this.getProject('Upcoming').addTask(new Task(taskName, task.getDate(),task.getDetails()));
            })
        })
        this.getProject('Upcoming').setTaskList(
            this.getProject('Upcoming').getTaskList().sort((taskOne,taskTwo) => 
                compareAsc(
                    toDate(new Date(taskOne.returnDateFormatted())),
                    toDate(new Date(taskTwo.returnDateFormatted()))
                )))
    }
    // HELPERS // 
    projectListContains(projectName){
        // returns true if found, false if not.
        return this.projectList.some(project => project.getName() === projectName);
    }
}