export default class Project{
    constructor(name){
        this.name = name;
        this.taskList = [];
    }
    // GETTERS AND SETTERS //
    setProjectName(projectName){
        this.name = projectName;
    }
    getProjectName(){
        return this.name;
    }
    getTaskList(){
        return this.taskList;
    }
    setTaskList(newTaskList){
        // sets this.taskList as a reference to new list;
        this.taskList = newTaskList;
    }
    // METHODS //
    addTask(task){
        taskList.push(task);
    }
    deleteTask(task){
        if(this.taskListContains(task)){
            var index = this.getTaskIndex(task);
            this.taskList.splice(index, 1);
        }
        return;
    }
    getTask(task){
        if(this.taskListContains(task)){
            return taskList[this.getTaskIndex(task)];
        }
        return;
    } 
    // HELPER //
    taskListContains(task){
        // returns true if found, false if not.
        return this.projectList.some(project => project.name === projectName);
    }
}