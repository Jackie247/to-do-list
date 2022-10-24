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
        taskList.append(task);
    }
    deleteTask(task){
        var index = this.getTaskIndex(task);
        this.taskList.splice(index, 1);
    }
    getTask(task){
        return taskList[this.getTaskIndex(task)];
    } 
    // HELPER //
    getTaskIndex(task){
        // either returns the index or -1 if not in list
        return this.taskList.indexOf(task);
    }
}