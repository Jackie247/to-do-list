import Project from "./project";
import Task from "./task";
import ProjectList from "./projectList";

export default class LocalStorage{
    updateStorage(projectsData){
        // updates the object array with current project list objects
        // stringify maintains the data's formatting, instead of just turning data into strings.
        localStorage.setItem('Projects',JSON.stringify(projectsData));
    }
    getProjectList(){
        // parse the array from local memory into a variable
        const objectData = JSON.parse(localStorage.getItem('Projects'));
        // use standardized function object.assign to copy all enumerable properties to a target object.
        // in this case, a new project list. 
        var updatedProjectList = Object.assign(new ProjectList(),objectData);
        
    }
}