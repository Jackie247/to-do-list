import Project from './project.js';
import ProjectList from './projectList.js';
import LocalStorage from './localStorage.js';

export default class Interface{
    /** -------------Loading content to screen------------------- */
    static displayHome(){
        Interface.loadSavedProjects();
        Interface.initProjectButtons();
        Interface.openProject('Inbox',document.getElementById('inbox'));
    }
    static loadSavedProjects(){
        LocalStorage.getSavedProjectList()
         .getProjects().forEach((project) => {
            if(project.name !== 'Inbox' && project.name !== 'Today' && project.name !== 'Upcoming'){
                Interface.createProject(project.name);
            }
        })
        Interface.initAddProjectBtn();
    }
    static loadTasks(projectName){
        LocalStorage.getSavedProjectList()
         .getProject(projectName).getTaskList()
         .forEach(task => {
            Interface.createTask(task.name,task.date);
         })
        if(projectName !== 'Today' && projectName !== 'Upcoming'){
            Interface.initTaskButtons();
        }
    }
    static loadProjectTasks(projectName){
        const projectTasks = document.getElementById('project-tasks');
        projectTasks.innerHTML = `
            <h2 class="project-title">${projectName}</h2>
            <div id='task-list' class="task-list"></div>`;
        if(projectName !== 'Today' && projectName !== 'Upcoming'){
            projectTasks.innerHTML += `
            <button type="button" id='add-task' class="add-task-btn">
                <i id='add-task-icon' class="bi bi-plus-square"></i>
                <p id='add-task-text'>Add Task</p>
            </button>
            `;
        }
        Interface.loadTasks(projectName);
    }
    /** -----------------Content manipulation------------------- */
    static clearDisplay(){
        Interface.clearProjectList();
        Interface.clearProjectSection();        
        Interface.clearTaskList();
    }
    static clearProjectList(){
        const projectList = document.getElementById('project-list');
        projectList.textContent = '';
    }
    static clearProjectSection(){
        const projectSection = document.getElementById('project-tasks');
        projectSection.textContent = '';
    }
    static clearTaskList(){
        const taskList = document.getElementById('task-list');
        taskList.textContent = '';
    }
    static closeTaskPopupModal(){
        const container = document.getElementById('task-popup')
        if(container.style.display == 'block'){
            container.style.display == 'none';
        }
        return;
    }
    static closeAllForms(){
        Interface.closeAddProjectForm();
        if(document.getElementById('add-task')){
            Interface.closeTaskPopupModal();
        }
        if(document.getElementById('task-list') && document.getElementById('task-list').innerHTML !== ''){
            Interface.closeInputs();
        }
    }
    static closeInputs(){

    }
    /** -------------Adding project content--------------- */
    static createProject(projectName){
        const projectList = document.getElementById('project-list');
        projectList.innerHTML += `
            <button class='new-project'>
                <div class='left-div'>
                    <i class='bi bi-list-task'></i>
                    <p class='project-name'>${projectName}</p>
                </div>
                <div class='right-div'>
                    <i class='bi bi-x-circle'></i>
                </div>
            </button>
        `;
        Interface.initProjectButtons();
    }
    static addProjectToList(){
        const addProjectTitleInput = document.getElementById('add-project-title'); 
        const projectName = addProjectTitleInput.value;
        if(projectName === ''){
            alert('Enter project name');
            return;
        }
        if(LocalStorage.getSavedProjectList().projectListContains(projectName)){
            addProjectTitleInput.value == '';
            alert('Project already exists');
            return;
        }
        LocalStorage.addProject(new Project(projectName));
        Interface.createProject(projectName);
        Interface.closeAddProjectForm();
    }
    /** -------------Event listeners for projects---------------*/
    static openProject(projectName, projectButton){
        const defaultProjects = document.querySelectorAll('.default-project');
        const userProjects = document.querySelectorAll('.new-project');
        const projects = [...defaultProjects, ...userProjects];

        projects.forEach((button) => button.classList.remove('active'));
        projectButton.classList.add('active');
        Interface.closeAddProjectForm();
        Interface.loadProjectTasks(projectName);
    }
    static deleteProject(projectName,button){
        if(button.classList.contains('active')){
            Interface.clearTaskList();
        };
        LocalStorage.deleteProject(projectName);
        Interface.clearProjectList();
        Interface.loadSavedProjects();
    }
    static initProjectButtons(){
        const inboxBtn = document.getElementById('inbox')
        const todayBtn = document.getElementById('today');
        const upcomingBtn = document.getElementById('upcoming');
        const dropDownBtn = document.getElementById('nav-dropdown');
        const projectButtons = document.querySelectorAll('.new-project');

        inboxBtn.addEventListener('click',Interface.openInbox);
        todayBtn.addEventListener('click',Interface.openToday);
        upcomingBtn.addEventListener('click',Interface.openUpcoming);
        dropDownBtn.addEventListener('click',Interface.toggleNavbarDisplay);
        projectButtons.forEach((project) => project.addEventListener('click', Interface.handleUserProjects))
    }
    static openInbox(){
        Interface.openProject('Inbox',this);
    }
    static openToday(){
        LocalStorage.updateToday();
        Interface.openProject('Today',this);
    }
    static openUpcoming(){
        LocalStorage.updateUpcoming();
        Interface.openProject('Upcoming',this);
    }
    static toggleNavbarDisplay(){
        const projectList = document.getElementById('navbar');
        projectList.classList.toggle('active');
    }
    static handleUserProjects(e){
        const projectName = this.children[0].children[1].textContent;
        if(e.target.classList.contains('bi-x-circle')){
            Interface.deleteProject(projectName,this);
            return;
        }
        Interface.openProject(projectName,this);
    }
    static initAddProjectBtn(){
        const addProjectBtn = document.getElementById('add-project-btn');
        const cancelBtn = document.getElementById('project-form-cancel')
        const acceptBtn = document.getElementById('project-form-accept');
        addProjectBtn.addEventListener('click', Interface.openAddProjectForm);
        cancelBtn.addEventListener('click', Interface.closeAddProjectForm);
        acceptBtn.addEventListener('click',Interface.addProjectToList);
    }
    static openAddProjectForm(){
        const addProjectForm = document.getElementById('add-project-form');
        const addProjectBtn = document.getElementById('add-project-btn');
        Interface.closeAllForms();
        addProjectForm.style.display = 'block';
        addProjectBtn.style.display = 'none';
    }
    static closeAddProjectForm(){
        const addProjectForm = document.getElementById('add-project-form');
        const addProjectBtn = document.getElementById('add-project-btn');
        const addProjectTitleInput = document.getElementById('add-project-title');

        addProjectForm.style.display = 'none';
        addProjectBtn.style.display = 'flex';
        addProjectTitleInput.value = '';
    }
    /** -------------Adding task content-------------*/
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
        dateText.textContent = date;

        taskContainer.appendChild(checkBox);
        taskContainer.appendChild(name);
        taskContainer.appendChild(dateInput);
        taskContainer.appendChild(dateText);
        taskContainer.appendChild(details);
        taskContainer.appendChild(deleteBtn);

        taskList.appendChild(taskContainer);

        Interface.initTaskButtons();
    }
    /** -------------Event listeners for tasks---------------*/    
    static initTaskButtons(){
        Interface.addTaskBtn();
    }
    static addTaskBtn(){
        const addBtn = document.getElementById('add-task');
        addBtn.addEventListener('click', Interface.createTaskPopupModal);
    }
    static createTaskPopupModal(){
        const section = document.getElementById('task-popup');
        section.innerHTML = `
        <div class="modal" id="task-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Create task.</h2>
                    <button id='close-task-popup' class="close-btn">
                    <i class="bi bi-x-circle"></i>
                    </button>
                </div>
                <div class='modal-main'>
                    <div class='new-task-title-textarea'>
                        <textarea placeholder="Title: New task" maxlength="40" id="new-task-title" required></textarea>
                    </div>
                    <div class='new-task-details-textarea'>
                        <textarea placeholder='Details: e.g shopping, gym, deadlines'></textarea>
                    </div>
                    <div class='new-task-due-date'>
                        <h3>Due: </h3>
                        <input type='date' class='new-task-date' required>
                    </div>
                </div>
                <div class='modal-footer'>
                    <button class='add-task-container'>
                        <i class='bi bi-x'></i>
                        <p class='confirm-task'>Add Task</p>
                    </button>
                    <button class='task-complete-container'>
                        <i class='bi bi-check'></i>
                        <p class='task-completion'>Mark as done</p>
                    </button>
                </div>
            </div>
        </div>`;
        const closeBtn = document.getElementById('close-task-popup');
        const container = document.getElementById('task-modal')
        closeBtn.addEventListener('click', () => {
            container.style.display = 'none';
        })

    }
}