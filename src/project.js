export default class Project{
    constructor(name){
        this.name = name;
        this.taskList = [];
    }

    addTask(task){
        taskList.append(task);
    }

    deleteTask(task){
        var index = this.getTaskIndex(task);
        this.taskList.splice(index, 1);
    }

    getTaskIndex(task){
        // either returns the index of -1 if not in list
        return this.taskList.indexOf(task);
    }
}