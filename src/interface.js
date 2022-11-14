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
            Interface.createTask(task.name,task.dueDate);
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


        const deleteBtn = document.createElement('button');
        deleteBtn.setAttribute('id','del-task-btn');
        deleteBtn.classList.add('del-task-btn','bi','bi-x-circle');

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
        details.addEventListener('click', (e) => {
            Interface.populateEditForm(e);
            Interface.openEditTaskModal();
        });

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
        const closeEditTaskFormBtn = document.getElementById('close-edit-task-popup');
        // Event handlers for task buttons, and the buttons on edit task form modal.
        tasks.forEach((task) => {
            task.addEventListener('click',Interface.handleTaskEvents);
            task.children[3].addEventListener('click',(e) => {
                renderTaskDetails(e,tasks);
            })
        })
        closeEditTaskFormBtn.addEventListener('click',Interface.closeEditTaskModal);
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
        if(e.target.classList.contains('bi-x-circle')){
            Interface.deleteTask(this);
        }
        if(e.target.classList.contains('task-checkbox')){
            Interface.updateTaskCompleted(this);
        }
    }
    static renderTaskDetails(e,taskNodeList){
        const index = e.target.parentElement.dataset.index;
        
        Interface.closeAllForms();
        const editForm = document.getElementById('edit-task-popup');
    }
    static openEditTaskModal(){
        
        const editTaskModal = document.getElementById('edit-task-modal');
        editTaskModal.style.display = 'block';
    }
    static populateEditForm(e){
        const projectName = e.target.parentElement.dataset.project;
        const taskNode = e.target.parentElement;
        const taskName = e.target.parentElement.children[1].textContent;
        // get the task object from local storage
        const taskObject = LocalStorage.getSavedProjectList()
            .getProject(projectName)
            .getTask(taskName);
        // update the form information
        document.getElementById('edit-task-title').value = taskObject.getTaskName();
        document.getElementById('edit-task-details').value = taskObject.getDetails();
        if(document.getElementById('edit-task-date').value === 'No date'){
            return;
        }else{
            document.getElementById('edit-task-date').value = taskObject.getDate();
        }
        const confirmBtn = document.getElementById('confirm-edit-btn');
        confirmBtn.addEventListener('click', ()=>{
            Interface.updateTask(taskNode);
        });
    }
    static closeEditTaskModal(){
        const editForm = document.getElementById('edit-task-modal');    
        editForm.style.display = 'none';
    }
    static updateTask(taskNode){
        // Get current task details
        const projectName = taskNode.target.parentElement.dataset.project;
        const newTaskName = document.getElementById('edit-task-title').value;
        const newTaskDate = document.getElementById('edit-task-date').value;
        const newTaskDetails = document.getElementById('edit-task-details').value;
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
        Interface.closeEditTaskModal();
    }
    static getTaskFromTaskList(index){
        return document.querySelectorAll('.tasks')[index - 1];
    }
}