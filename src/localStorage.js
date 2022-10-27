import Project from "./project";
import Task from "./task";
import ProjectList from "./projectList";

export default class LocalStorage{
    static updateStorage(projectsData){
        // updates the object array with current project list objects
        // stringify maintains the data's formatting, instead of just turning data into strings.
        localStorage.setItem('Projects',JSON.stringify(projectsData));
    }
    static getSavedProjectList(){
        // parse the array from local memory into a variable
        const objectData = JSON.parse(localStorage.getItem('Projects'));
        // use standardized function object.assign to copy all enumerable properties to a target object.
        // in this case, a new project list. 
        var savedProjectList = Object.assign(new ProjectList(),objectData);
        // since the parsed objects are just in string form. we need to turn them back into objects.
        // repeat this for the projects in the project list and for each task within each project
        savedProjectList.setProjectList(
            savedProjectList.getProjectList().map(
                project=>{Object.assign(new Project(), project)
                }
            )
        );
        savedProjectList.getProjectList().forEach(
            project => project.setTaskList(
                project.getTaskList().map(
                    task => Object.assign(new Task(), task)
                )
            )
        );          
        return savedProjectList;
    }
    static addProject(project){
        const savedProjectList = LocalStorage.getSavedProjectList();
        savedProjectList.addProject(project);
        LocalStorage.updateStorage(savedProjectList);
    }
    static deleteProject(projectName){
        const savedProjectList = LocalStorage.getSavedProjectList();
        savedProjectList.deleteProject(projectName)
        LocalStorage.updateStorage(savedProjectList);
    }
    static addTask(projectName, taskName){
        const savedProjectList = LocalStorage.getSavedProjectList();
        savedProjectList.getProject(projectName).addTask(taskName);
        LocalStorage.updateStorage(savedProjectList);
    }
    static deleteTask(projectName,taskName){
        const savedProjectList = LocalStorage.getSavedProjectList();
        savedProjectList.getProject(projectName).deleteTask(taskName);
        LocalStorage.updateStorage(savedProjectList);
    }
    static renameTask(projectName, taskName, newName){
        const savedProjectList = LocalStorage.getSavedProjectList();
        savedProjectList.getProject(projectName).getTask(taskName).setTaskName(newName);
        LocalStorage.updateStorage(savedProjectList);
    }
    static setTaskCompletion(projectName,taskName,boolean){
        const savedProjectList = LocalStorage.getSavedProjectList();
        savedProjectList.getProject(projectName).getTask(taskName).setCompleted(boolean);
        LocalStorage.updateStorage(savedProjectList);
    }
    static updateToday(){
        const savedProjectList = LocalStorage.getSavedProjectList();
        savedProjectList.updateToday();
        LocalStorage.updateStorage(savedProjectList);
    }
    static updateUpcoming(){
        const savedProjectList = LocalStorage.getSavedProjectList();
        savedProjectList.updateUpcoming();
        LocalStorage.updateStorage(savedProjectList);
    }
}