export default class Project{
    constructor(name){
        this.name = name;
        this.taskList = [];
    }
    // GETTERS AND SETTERS //
    setProjectName(name){
        this.name = name;
    }
    getProjectName(){
        return this.name;
    }
    setTaskList(taskList){
        // sets this.taskList as a reference to new list;
        this.taskList = taskList;
    }
    getTaskList(){
        return this.taskList;
    }
    // METHODS //
    addTask(task){
        if(this.taskListContains(task)){
            return;
        }
        this.taskList.push(task);
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
            return this.taskList[this.getTaskIndex(task)];
        }
        return;
    } 
    // HELPER //
    taskListContains(taskName){
        // returns true if found, false if not.
        return this.projectList.some(task => task.getName() === taskName);
    }
}