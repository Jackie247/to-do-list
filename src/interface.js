import Project from './project.js';
import App from './projectList.js';

export default class Interface{
    constructor(){}
    static displayNav(){

    }
    static updateInterface(){

    }
    static initProjectButtons(){
        Interface.addProjectBtn();
    }
    static loadProjects(){
        const projectList = document.getElementById('project-list');
        const projects = Project.getTaskList();
        projects.array.forEach(element => {
            
        });
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