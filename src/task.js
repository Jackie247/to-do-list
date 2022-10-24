export default class Task{
    constructor(name,completed = false, dueDate = null){
        this.name = name;
        this.completed = completed;
        this.dueDate = dueDate;
    }
    // GETTERS AND SETTERS //
    setTaskName(name){
        this.name = name;
    }
    getTaskName(){
        return this.name;
    }
    setCompleted(boolean){
        this.completed = boolean;
    }
    getCompleted(){
        return this.completed;
    }
    setDate(newDate){
        this.date = newDate;
    }
    getDate(){
        return this.date;
    }
}