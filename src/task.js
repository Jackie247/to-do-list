export default class Task{
    constructor(name, dueDate = 'No date',details = ''){
        this.name = name;
        this.dueDate = dueDate;
        this.details = details;
    }
    // GETTERS AND SETTERS //
    setTaskName(name){
        this.name = name;
    }
    getTaskName(){
        return this.name;
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
    setDetails(details){
        this.details = details;
    }
    getDetails(){
        return this.details;
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