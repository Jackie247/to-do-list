import Project from "./project";
import Task from "./task";
import ProjectList from "./projectList";

export default class LocalStorage{
    static updateStorage(data){
        // updates the object array with current project list objects
        // stringify maintains the data's formatting, instead of just turning data into strings.
        localStorage.setItem('ProjectData',JSON.stringify(data));
        return;
    }
    static getSavedProjectList(){
        // parse the array from local memory into a variable
        // use standardized function object.assign to copy all enumerable properties to a target object.
        // in this case, a new project list. 
        const projectList = Object.assign(
            new ProjectList(),
            JSON.parse(localStorage.getItem('ProjectData'))
        )
        // since the parsed objects are just in string form. we need to turn them back into objects.
        // repeat this for the projects in the project list and for each task within each project
        projectList.setProjects(
            projectList
              .getProjects()
              .map((project) => Object.assign(new Project(), project))
          )
        projectList
            .getProjects()
            .forEach(project => {
                project.setTaskList(
                    project.getTaskList().map(task => Object.assign(new Task(), task))
                )
            })         
        return projectList;
    }
    static addProject(project){
        const savedProjectList = LocalStorage.getSavedProjectList();
        savedProjectList.addProject(project);
        LocalStorage.updateStorage(savedProjectList);
        return;
    }
    static deleteProject(projectName){
        const savedProjectList = LocalStorage.getSavedProjectList();
        savedProjectList.deleteProject(projectName)
        LocalStorage.updateStorage(savedProjectList);
        return;
    }
    static addTask(projectName, task){
        const savedProjectList = LocalStorage.getSavedProjectList();
        savedProjectList.getProject(projectName).addTask(task);
        LocalStorage.updateStorage(savedProjectList);
        return;
    }
    static deleteTask(projectName,taskName){
        const savedProjectList = LocalStorage.getSavedProjectList();
        savedProjectList.getProject(projectName).deleteTask(taskName);
        LocalStorage.updateStorage(savedProjectList);
        return;
    }
    static renameTask(projectName, taskName, newName){
        const savedProjectList = LocalStorage.getSavedProjectList();
        savedProjectList.getProject(projectName).getTask(taskName).setTaskName(newName);
        LocalStorage.updateStorage(savedProjectList);
        return;
    }
    static setTaskDate(projectName,taskName,date){
        const savedProjectList = LocalStorage.getSavedProjectList();
        savedProjectList.getProject(projectName).getTask(taskName).setDate(date);
        LocalStorage.updateStorage(savedProjectList);
        return;
    }
    static setTaskDetails(projectName,taskName,details){
        const savedProjectList = LocalStorage.getSavedProjectList();
        savedProjectList.getProject(projectName).getTask(taskName).setDetails(details);
        LocalStorage.updateStorage(savedProjectList);
        return;
    }
    static updateToday(){
        const savedProjectList = LocalStorage.getSavedProjectList();
        savedProjectList.updateToday();
        LocalStorage.updateStorage(savedProjectList);
        return;
    }
    static updateUpcoming(){
        const savedProjectList = LocalStorage.getSavedProjectList();
        savedProjectList.updateUpcoming();
        LocalStorage.updateStorage(savedProjectList);
        return;
    }
}