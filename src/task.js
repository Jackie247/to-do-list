export default class Task{
    constructor(name){
        this.name = name;    
    }

    static setTaskName(name){
        this.name = name;
    }

    static getTaskName(){
        return this.name;
    }

    static updateTaskName(updatedName){
        this.name = updatedName;
    }
}