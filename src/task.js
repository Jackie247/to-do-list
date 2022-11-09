export default class Task{
    constructor(name, dueDate = 'No date'){
        this.name = name;
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
        if(date !== null){
            return this.date;
        }
        return;
    }
    // METHODS //
    getFormattedDate(){
        if(date !== null){
            const day = this.dueDate.split('-')[0];
            const month = this.dueDate.split('-')[1];
            const year = this.dueDate.split('-')[2];
            return `${day}/${month}/${year}`;
        }        
        return;
    }

}