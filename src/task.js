export default class Task{
    constructor(name, dueDate, details){
        this.name = name;
        this.dueDate = dueDate;
        this.details = details;
    }
    // GETTERS AND SETTERS //
    setTaskName(name){
        this.name = name;
        return
    }
    getTaskName(){
        return this.name;
    }
    setDate(newDate){
        this.dueDate = newDate;
        return
    }
    getDate(){
        if(this.dueDate !== null){
            return this.dueDate;
        }
        return;
    }
    setDetails(details){
        this.details = details;
        return
    }
    getDetails(){
        return this.details;
    }
}