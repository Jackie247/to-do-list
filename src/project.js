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
        try{
            var index = this.getTaskIndex(task);
            this.taskList.splice(index, 1);
        }catch(error){
            console.error(error);
        }
    }
    getTask(task){
        try{
            return taskList[this.getTaskIndex(task)];
        }catch(error){
            console.error(error);
        }
    } 
    // HELPER //
    getTaskIndex(task){
        // either returns the index or -1 if not in list
        return this.taskList.indexOf(task);
    }
}