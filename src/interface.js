import {format} from 'date-fns';
import Project from './project.js';
import Task from './task.js';
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
            Interface.createTask(projectName,task.name,task.dueDate);
         })
        if(projectName !== 'Today' && projectName !== 'Upcoming'){
            Interface.initAddTaskButton();
        }
    }
    static loadProjectTasks(projectName){
        const projectTasks = document.getElementById('project-tasks');
        projectTasks.innerHTML = `
            <h2 id='project-tasks-title' class="project-title">${projectName}</h2>
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
        // Looks at the current object, since projects contain two divs. 'left' and 'right' div
        // the project name is in the left div children[0] 
        // its the second element children[1]
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
    static createTask(project,taskName, date){
        const taskList = document.getElementById('task-list');
        
        const newTaskContainer = document.createElement('div');
        newTaskContainer.classList.add('task');
        
        const checkBox = document.createElement('input');
        checkBox.setAttribute('type','checkbox');
        checkBox.classList.add('task-checkbox');
        
        const details = document.createElement('button');
        details.textContent = 'Edit';
        details.classList.add('edit-task');
        details.setAttribute('type','button');

        const deleteBtn = document.createElement('button');
        deleteBtn.setAttribute('id','del-task-btn');
        deleteBtn.classList.add('del-task-btn','bi','bi-x-circle');
        deleteBtn.setAttribute('type','button');

        const name = document.createElement('p');
        name.classList.add('task-name');
        name.textContent = taskName;

        const dateText = document.createElement('p');
        dateText.classList.add('task-date');
        dateText.textContent = date;

        newTaskContainer.appendChild(checkBox);
        newTaskContainer.appendChild(name);
        newTaskContainer.appendChild(dateText);
        newTaskContainer.appendChild(details);
        newTaskContainer.appendChild(deleteBtn);

        taskList.appendChild(newTaskContainer);

        let tasks = taskList.querySelectorAll('.task');
        newTaskContainer.setAttribute('data-project',`${project}`);
        newTaskContainer.setAttribute('data-index',tasks.length);

        Interface.initTaskButtons();
    }
    /** -------------Event listeners for task creation---------------*/    
    static initAddTaskButton(){
        const addTaskBtn = document.getElementById('add-task');
        const closeBtn = document.getElementById('close-new-task-popup');
        const acceptBtn = document.getElementById('accept-task-btn')
        addTaskBtn.addEventListener('click', Interface.openAddTaskModal);
        closeBtn.addEventListener('click',Interface.closeAddTaskModal);
        acceptBtn.addEventListener('click',Interface.addTask);
    }
    static openAddTaskModal(){
        const addTaskForm = document.getElementById('task-modal');
        Interface.closeAllForms();

        addTaskForm.style.display = 'block';
    }
    static closeAddTaskModal(){
        const addTaskForm = document.getElementById('task-modal');
        const taskTitle = document.getElementById('new-task-title');
        const taskDetails = document.getElementById('new-task-details');
        const taskDate = document.getElementById('new-task-date');

        addTaskForm.style.display = 'none';
        taskTitle.value = '';
        taskDetails.value = '';
        taskDate.value = '';
    }
    static addTask(){
        const projectName = document.getElementById('project-tasks-title').textContent;
        const taskTitle = document.getElementById('new-task-title').value;
        const taskDate = document.getElementById('new-task-date').value;
        const taskDetails = document.getElementById('new-task-details').value;
        if(taskTitle === ''){
            alert('Enter task title');
            return;
        }
        if(LocalStorage.getSavedProjectList().getProject(projectName).taskListContains(taskTitle)){
            alert('Task names must be different');
            return;
        }
        if(taskDate === ''){
            Interface.createTask(projectName, taskTitle, 'No date');
        }
        else{
            // create task to display on interface
            Interface.createTask(projectName, taskTitle, taskDate);
        }
        LocalStorage.addTask(projectName, new Task(taskTitle));
        // update task date and details in local storage
        LocalStorage.setTaskDate(projectName,taskTitle,taskDate);
        LocalStorage.setTaskDetails(projectName,taskTitle,taskDetails);

        Interface.closeAddTaskModal();
    }
    /** -------------Event listeners for created tasks buttons---------------*/  
    static initTaskButtons(){
        // init task buttons for every single created task
        const tasks = document.querySelectorAll('.task');
        // Event handlers for task buttons, and the buttons on edit task form modal.
        tasks.forEach((task) => {
            task.addEventListener('click',Interface.handleTaskEvents);
        })
    }
    static deleteTask(task){
        const project = document.getElementById('project-tasks-title').textContent;
        const taskName = task.children[1].textContent;
        if(project === 'Today' || project === 'Upcoming'){
            const taskProjectParent = task.split('(')[1].split(')')[0];
            LocalStorage.deleteTask(taskProjectParent,taskName);
        }
        LocalStorage.deleteTask(project,taskName);
        Interface.clearTaskList();
        Interface.loadProjectTasks(project);
    }
    static handleTaskEvents(e){
        const project = document.getElementById('project-tasks-title').textContent;
        const listOfTaskObjects = LocalStorage.getSavedProjectList()
            .getProject(project)
            .getTaskList();
        if(e.target.classList.contains('bi-x-circle')){
            Interface.deleteTask(this);
        }
        if(e.target.classList.contains('edit-task')){
            Interface.renderTaskDetails(this,listOfTaskObjects);
        }
        if(e.target.classList.contains('task-checkbox')){
            Interface.updateTaskCompleted(this);
        }
    }
    static renderTaskDetails(task,listOfTaskObjects){
        let i = task.dataset.index;
        let taskObject = listOfTaskObjects[i-1];

        Interface.closeAllForms();
        const editForm = document.getElementById('edit-task-popup');
        editForm.innerHTML = '';
        // Body of popup form
        const modal = document.createElement('div');
        modal.classList.add('modal','popup-active');
        modal.setAttribute('id','edit-task-modal');
        
        const modalContent = document.createElement('form');
        modalContent.classList.add('modal-content');
        
        const modalHeader = document.createElement('div');
        modalHeader.classList.add('modal-header');

        const headerText = document.createElement('h2');
        headerText.textContent = 'Edit task.';

        const closeFormBtn = document.createElement('button');
        closeFormBtn.setAttribute('id','close-edit-task-popup');
        closeFormBtn.classList.add('close-btn');
        closeFormBtn.addEventListener('click',() => modal.classList.toggle('popup-active'));
        closeFormBtn.setAttribute('type','button');
        const closeFormBtnIcon = document.createElement('i');
        closeFormBtnIcon.classList.add('bi','bi-x-circle');

        const modalMain = document.createElement('div');
        modalMain.classList.add('modal-main');

        const taskTitleContainer = document.createElement('div');
        taskTitleContainer.classList.add('edit-task-title-textarea');
        const taskTitle = document.createElement('textarea');
        taskTitle.setAttribute('id','edit-task-title');
        taskTitle.setAttribute('placeholder','Title: New title');
        taskTitle.setAttribute('maxlength','40');
        taskTitle.classList.add('edit-task-title');
        taskTitle.required = true;
        taskTitle.value = taskObject.name;
        taskTitle.dataset.index = i;
        taskTitle.dataset.project = task.dataset.project;

        const taskDetailsContainer = document.createElement('div');
        taskDetailsContainer.classList.add('edit-task-details-textarea');
        const taskDetails = document.createElement('textarea');
        taskDetails.setAttribute('id','edit-task-details');
        taskDetails.setAttribute('placeholder','Details: e.g shopping, gym, deadlines');
        taskDetails.classList.add('edit-task-details');
        taskDetails.value = taskObject.details;

        const taskDateContainer = document.createElement('div');
        taskDateContainer.classList.add('edit-task-due-date')
        const taskDateText = document.createElement('h3');
        taskDateText.textContent = 'Due:';
        const taskDateInput = document.createElement('input');
        taskDateInput.setAttribute('id','edit-task-date');
        taskDateInput.setAttribute('type','date');
        taskDateInput.classList.add('edit-task-date');
        taskDateInput.value = taskObject.dueDate;

        const modalFooter = document.createElement('div');
        modalFooter.classList.add('modal-footer');

        const confirmEditBtn = document.createElement('input');
        confirmEditBtn.setAttribute('id','confirm-edit-btn');
        confirmEditBtn.setAttribute('type','submit');
        confirmEditBtn.classList.add('confirm-edit-btn');

        const confirmEditBtnIcon = document.createElement('i');
        confirmEditBtnIcon.classList.add('bi','bi-x');
        
        const confirmEditBtnText = document.createElement('p');
        confirmEditBtnText.classList.add('confirm-task');
        confirmEditBtnText.textContent = 'Confirm Edit';

        editForm.appendChild(modal);
        modal.appendChild(modalContent);
        modalContent.appendChild(modalHeader);
        modalHeader.appendChild(headerText);
        modalHeader.appendChild(closeFormBtn);
        closeFormBtn.appendChild(closeFormBtnIcon);
        
        modalContent.appendChild(modalMain);
        modalMain.appendChild(taskTitleContainer);
        modalMain.appendChild(taskDetailsContainer);
        modalMain.appendChild(taskDateContainer);
        taskTitleContainer.appendChild(taskTitle);
        taskDetailsContainer.appendChild(taskDetails);
        taskDateContainer.appendChild(taskDateText);
        taskDateContainer.appendChild(taskDateInput);
    
        modalContent.appendChild(modalFooter);
        modalFooter.appendChild(confirmEditBtn);
        confirmEditBtn.appendChild(confirmEditBtnIcon);
        confirmEditBtn.appendChild(confirmEditBtnText);
    }
    static updateTask(e,editForm){
        e.preventDefault();
        const i = e.target.children[1].firstElementChild.firstElementChild.dataset.index;
        console.log(i);
        const project = e.target.firstElementChild.dataset.project;
        const listOfTaskObjects = LocalStorage.getSavedProjectList()
        .getProject(project)
        .getTaskList();
        // Get current task details
        listOfTaskObjects[i].name = document.getElementById('edit-task-title').value;
        listOfTaskObjects[i].dueDate = document.getElementById('edit-task-date').value;
        listOfTaskObjects[i].details = document.getElementById('edit-task-details').value;

        if(document.getElementById('edit-task-title').value === ''){
            alert('Name cannot be empty');
            return;
        }
        // Rename the task object name in storage.
        if(LocalStorage.getSavedProjectList().getProject(projectName).taskListContains(newTaskName)){
            document.getElementById('edit-task-title').value = '';
            alert('Task name already exists');
            return;
        }
        LocalStorage.renameTask(projectName,taskNode.children[1].textContent,newTaskName);
        // Update the name display for the task. 
        taskNode.children[1].innerHTML = newTaskName;
        // Reassign the task object since its name has been changed. 
        let taskObject = LocalStorage.getSavedProjectList()
            .getProject(projectName)
            .getTask(taskNode.children[1].textContent);
        // If the current displayed date text is not the same as new date. Update the task object date.
        if(taskObject.getDate() !== newTaskDate){
            LocalStorage.setTaskDate(projectName,taskObject.getTaskName(),newTaskDate);
            taskNode.children[2].innerHTML = newTaskDate;
        }
        if(taskObject.getDetails() !== newTaskDetails){
            LocalStorage.setTaskDetails(projectName,taskObject.getTaskName(),newTaskDetails);
        }
        Interface.clearTaskList();
        Interface.loadProjectTasks(projectName);
        editForm.classList.toggle('popup-active');
    }
}