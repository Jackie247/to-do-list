import Project from './project.js';
import ProjectList from './projectList.js';
import LocalStorage from './localStorage.js';

export default class Interface{
    // DISPLAYING CONTENT TO SCREEN //
    static displayHome(){
        Interface.loadSavedProjects();
    }
    static loadSavedProjects(){
        LocalStorage.getSavedProjectList().getProjectList().forEach((project) => {
            if(project.name !== 'Inbox' && project.name !== 'Today' && project.name !== 'Upcoming'){
                Interface.createProject(project.name);
            }
        })
    }
    static loadSavedTasks(project){
        LocalStorage.getSavedProjectList().getProject(project).getTaskList();
    }
    static initProjectButtons(){
        Interface.addProjectBtn();
    }

    static addProjectBtn(){
        const addBtn = document.getElementById('add-project-btn');
        const icon = document.getElementById('plus')
        const container = document.querySelector('.add-project-container');
        const projectName = document.createElement('input');
        const buttons = document.createElement('div');
        const acceptBtn = Interface.createAcceptButton();
        const cancelBtn = Interface.createCancelButton();
        acceptBtn.addEventListener('click',()=>{
            let project = new Project(projectName.value);
            App.addProject(project);
            console.log(App.getProjectList());
        })
        buttons.appendChild(acceptBtn);
        buttons.appendChild(cancelBtn);

        addBtn.addEventListener('click',()=>{
            addBtn.classList.add('hidden');
            icon.classList.add('hidden');
            container.appendChild(projectName);
            container.appendChild(buttons);
        });
    }
    // CREATING HTML ELEMENTS TO DISPLAY ON SCREEN //
    static createProject(projectName){
        const projectList = document.getElementById('project-list');
        const newProjectContainer = document.createElement('button');
        const left = document.createElement('div');
        const icon = document.createElement('i');
        const name = document.createElement('p');
        const right = document.createElement('div');
        const cancel = document.createElement('i');

        icon.classList.add('bi','bi-list-task');
        newProjectContainer.classList.add('project');
        left.classList.add('left-div');
        right.classList.add('right-div');
        name.classList.add('project-name');
        cancel.classList.add('bi','bi-x-circle','project-cancel-btn');
        name.textContent = `${projectName}`;

        left.appendChild(icon);
        left.appendChild(name);
        right.appendChild(cancel);
        newProjectContainer.appendChild(left);
        newProjectContainer.appendChild(right)
        projectList.appendChild(newProjectContainer);
    }
    static createTask(taskName, date){
        const taskList = document.getElementById('task-list');
        const taskContainer = document.createElement('div');
        const checkBox = document.createElement('input');
        const details = document.createElement('button');
        const deleteBtn = document.createElement('button');
        const name = document.createElement('p');
        name.textContent = taskName;
        const dateText = document.createElement('p');
        const dateInput = document.createElement('input');
        dateInput.setAttribute('type','date');
        dateText.textContent = 'No date';

        taskContainer.appendChild(checkbox);
        taskContainer.appendChild(name);
        taskContainer.appendChild(dateInput);
        taskContainer.appendChild(dateText);
        taskContainer.appendChild(details);
        taskContainer.appendChild(deleteBtn);

        taskList.appendChild(taskContainer);
    }
    static initProjectButton(){
        const projectList = document.querySelectorAll('.project');
        projectList.forEach((project) => {
            project.addEventListener('click',() => {

            })
        })
    }
    static createAcceptButton(){
        const acceptBtn = document.createElement('button');
        acceptBtn.textContent = 'Accept';
        return acceptBtn;
    }
    static createCancelButton(){
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        return cancelBtn;
    }
}