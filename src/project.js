export default class Project{
    constructor(name){
        this.name = name;
        this.taskList = [];
    }
    // GETTERS AND SETTERS //
    setName(name){
        this.name = name;
    }
    getName(){
        return this.name;
    }
    setTaskList(tasks){
        // sets this.taskList as a reference to new list;
        this.taskList = tasks;
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