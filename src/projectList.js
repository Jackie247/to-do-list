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
        // Clear current today projeck task list.
        this.getProject('Today').taskList = [];
        // Check through every single project for tasks that have dates corresponding to today.
        this.projectList.forEach((project) => {
            // We have emptied out today project already and Upcoming tasks will have duplicates for today.
            if(project.getName() === 'Today' || project.getName() === 'Upcoming'){
                return;
            }
            // For every project, get all tasks that have dates today.
            const todayTasks = project.getTodaysTasks();
            // For the tasks found, add them to Today project tasklist.
            todayTasks.forEach((task)=>{
                const newTaskObj = new Task(task.getTaskName(), task.getDate(), task.getDetails());
                newTaskObj.setParentProject(project.getName());
                this.getProject('Today').addTask(newTaskObj);
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
                const newTaskObj = new Task(task.getTaskName(), task.getDate(), task.getDetails());
                newTaskObj.setParentProject(project.getName());
                this.getProject('Upcoming').addTask(newTaskObj);
            })
        })
        this.getProject('Upcoming').setTaskList(
            this.getProject('Upcoming')
                .getTaskList()
                .sort((taskOne,taskTwo) => 
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