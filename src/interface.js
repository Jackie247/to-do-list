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
        document.addEventListener('keydown',Interface.handleCloseFormInput)
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
        const savedProjectList = LocalStorage.getSavedProjectList();
        if(projectName === 'Inbox'){
            // For every project,
            savedProjectList.getProjects().forEach((project) => {
                if(project.getName() === 'Today' || project.getName() === 'Upcoming'){
                    return;
                }
                // For every task within the project
                project.getTaskList().forEach((task) => {
                    Interface.createTask(task.name,task.dueDate,task);
                })
            })
        }
        else{
            LocalStorage.getSavedProjectList()
                .getProject(projectName).getTaskList()
                .forEach(task => {
                    Interface.createTask(task.name,task.dueDate,task);
        })
        }
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
        taskList.innerHTML = '';
    }
    static closeEditTaskPopupModal(){
        const modal = document.getElementById('edit-task-modal')
        if(modal.classList.contains('popup-active')){
            modal.classList.remove('popup-active');
        }
        return;
    }
    static closeAllForms(){
        Interface.closeAddProjectForm();
        Interface.closeEditTaskPopupModal();
        Interface.closeAddTaskModal();
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
        projectButtons.forEach((project) => {
            project.addEventListener('click', Interface.handleUserProjects);
            project.addEventListener('keydown',Interface.handleProjectBtnInput);
        })
    }
    static handleProjectBtnInput(e){
        const projectName = this.children[0].children[1].textContent;
        if(e.key === 'Delete' || e.key === 'Backspace'){
            Interface.deleteProject(projectName,this);
        }
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
        acceptBtn.addEventListener('keypress',Interface.handleAddProjectInput);
    }
    static handleAddProjectInput(e){
        if(e.key === 'Enter') Interface.addProject();
    }
    static handleCloseFormInput(e){
        if(e.key === 'Escape') Interface.closeAllForms();
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
    static createTask(taskName, date,taskObject){
        // Since this function gets called whenever a new project is loaded
        // The current open project might be different from the project that the task was 
        // created in. Therefore we need to have the task Object and the current open project title
        const currOpenProject = document.getElementById('project-tasks-title');
        const taskList = document.getElementById('task-list');

        const newTaskContainer = document.createElement('div');
        newTaskContainer.classList.add('task');
        newTaskContainer.setAttribute('data-project',`${taskObject.getParentProject()}`);
        newTaskContainer.setAttribute('data-index',taskObject.getIndex());

        const checkBox = document.createElement('div');
        checkBox.classList.add('task-checkbox');

        const name = document.createElement('p');
        name.classList.add('task-name');
        // If the task is within its project that is its parent project (project it was created in)
        // Then we just render its name normally.
        if(currOpenProject.textContent  === taskObject.getParentProject()){
            name.textContent = taskName;
        }
        else{
            // If the task is being displayed in another project, such as inbox,today,upcoming.
            // We want to show the parent project of the task in brackets.
            name.textContent = `(${taskObject.getParentProject()}) ${taskName}`;
        }
        const dateText = document.createElement('p');
        dateText.classList.add('task-date');
        if(date === ''){
            dateText.textContent = 'No date';
        }
        else{
            dateText.textContent = date;
        }
        const details = document.createElement('button');
        details.textContent = 'Edit';
        details.classList.add('edit-task');
        details.setAttribute('type','button');

        const deleteBtn = document.createElement('button');
        deleteBtn.setAttribute('id','del-task-btn');
        deleteBtn.classList.add('del-task-btn','bi','bi-x-circle');
        deleteBtn.setAttribute('type','button');

        newTaskContainer.appendChild(checkBox);
        newTaskContainer.appendChild(name);
        newTaskContainer.appendChild(dateText);
        newTaskContainer.appendChild(details);
        newTaskContainer.appendChild(deleteBtn);
        taskList.appendChild(newTaskContainer);

        if(taskObject.getChecked()){
            checkBox.classList.add('checked');
            name.classList.add('checked');
            dateText.classList.add('checked');
            details.classList.add('checked');
            deleteBtn.classList.add('checked');
        }

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
        // Task information to save to local storage.
        const projectName = document.getElementById('project-tasks-title').textContent;
        const taskTitle = document.getElementById('new-task-title').value;
        const taskDate = document.getElementById('new-task-date').value;
        const taskDetails = document.getElementById('new-task-details').value;
        const projectObject = LocalStorage.getSavedProjectList()
            .getProject(projectName);    
        // If task title is empty, prompt user to enter.
        if(taskTitle === ''){
            alert('Enter task title');
            return;
        }
        // If task already exists within the project, alert user to change name.
        if(LocalStorage.getSavedProjectList().getProject(projectName).taskListContains(taskTitle)){
            alert('Task names must be different');
            return;
        }
        // Adds the task object to localStorage
        LocalStorage.addTask(projectName, new Task(taskTitle));
        // If task date is not provided, we just set an empty task date for the task object
        if(taskDate === ''){
            LocalStorage.setTaskDate(projectName,taskTitle,taskDate);
        }
        else{
            // If task is provided, we can set the task object date 
            // to a formatted string.
            const newTaskDate = format(new Date(taskDate),'dd/MM/yyyy');
            LocalStorage.setTaskDate(projectName,taskTitle,newTaskDate);
            // Update both Today and Upcoming projects if the date is within these ranges
            LocalStorage.updateToday();
            LocalStorage.updateUpcoming();
        }
        LocalStorage.setTaskDetails(projectName,taskTitle,taskDetails);
        LocalStorage.setTaskProjectParent(projectName,taskTitle);
        LocalStorage.setTaskIndex(projectName,taskTitle,projectObject.getTaskList().length);
        // Create task to display on interface
        const taskObject = LocalStorage.getSavedProjectList()
            .getProject(projectName)
            .getTask(taskTitle);
            
        Interface.createTask(taskTitle,taskDate,taskObject);
        Interface.clearTaskList();
        Interface.loadProjectTasks(projectName);
        Interface.closeAddTaskModal();
    }
    /** -------------Event listeners for created tasks buttons---------------*/  
    static initTaskButtons(){
        // init task buttons for every single created task
        const tasks = document.querySelectorAll('.task');
        // Event handlers for task buttons, and the buttons on edit task form modal.
        tasks.forEach((task) => {
            task.addEventListener('click',Interface.handleTaskEvents);
            task.addEventListener('keydown',Interface.handleTaskEventsInput);
        })
    }
    static deleteTask(task){
        const openProject = document.getElementById('project-tasks-title').textContent;
        const taskProjectParent = task.dataset.project;
        const taskName = task.children[1].textContent;
        if(openProject === 'Inbox' || openProject === 'Today' || openProject === 'Upcoming'){
            LocalStorage.deleteTask(taskProjectParent,taskName);
        }
        LocalStorage.deleteTask(openProject,taskName);
        Interface.clearTaskList();
        Interface.loadProjectTasks(openProject);
    }
    static handleTaskEvents(e){
        const project = e.currentTarget.dataset.project;
        const projectObject = LocalStorage.getSavedProjectList()
            .getProject(project)
        if(e.target.classList.contains('bi-x-circle')){
            Interface.deleteTask(this);
        }
        if(e.target.classList.contains('edit-task')){
            Interface.renderTaskDetails(this,projectObject);
        }
        if(e.target.classList.contains('task-checkbox')){
            Interface.updateTaskCompleted(this,projectObject);
        }
    }
    static handleTaskEventsInput(e){
        if(e.key === 'Enter'){
            if(e.target.classList.contains('bi-x-circle')){
                Interface.deleteTask(this);
            }
        }
    }
    static updateTaskCompleted(task,projectObj){
        const checkBox = task.children[0];
        const taskElem = task.children[1];
        const dateText = task.children[2];
        const editBtn = task.children[3];
        const delBtn = task.children[4];
        let taskName = task.children[1].textContent;
        const currOpenProject = document.getElementById('project-tasks-title').textContent;

        if(projectObj.getName() !== currOpenProject){
            var tempArr = taskName.split(' ');
            const [, ...rest] = tempArr;
            taskName = rest.join(" ");
        }
        const taskObj = projectObj.getTask(taskName);

        checkBox.classList.toggle('checked');
        taskElem.classList.toggle('checked');
        dateText.classList.toggle('checked');
        editBtn.classList.toggle('checked');
        delBtn.classList.toggle('checked');

        if(taskObj.getChecked()){
            LocalStorage.setTaskChecked(projectObj.getName(),taskName,false);
        }else{
            LocalStorage.setTaskChecked(projectObj.getName(),taskName,true);
        }
    }

    static renderTaskDetails(task,projectObj){
        // listOfTaskObjects is the tasks parent project task list.
        const currOpenProject = document.getElementById('project-tasks-title').textContent;
        let taskName = task.children[1].textContent; // either 'task' or '(project) task'
        // If not in parent project
        if(projectObj.getName() !== currOpenProject){
            var tempArr = task.children[1].textContent.split(' ');
            const [, ...rest] = tempArr;
            taskName = rest.join(" ");
        }
        let taskObject = projectObj.getTask(taskName);
        let i = taskObject.getIndex();

        Interface.closeAllForms();
        const editForm = document.getElementById('edit-task-popup');
        editForm.innerHTML = '';
        // Body of popup form
        const modal = document.createElement('div');
        modal.classList.add('modal','popup-active');
        modal.setAttribute('id','edit-task-modal');
        
        const modalContent = document.createElement('div');
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
        const [month,day,year] = taskObject.returnDateFormatted().split('/');
        taskDateInput.value = `${year}-${month}-${day}`;

        const modalFooter = document.createElement('div');
        modalFooter.classList.add('modal-footer');

        const confirmEditBtn = document.createElement('button');
        confirmEditBtn.setAttribute('id','confirm-edit-btn');
        confirmEditBtn.setAttribute('type','button');
        confirmEditBtn.classList.add('confirm-edit-btn');
        confirmEditBtn.textContent = 'Confirm Edit';
        confirmEditBtn.addEventListener('click', () => {
            Interface.updateTask(taskName,projectObj,modal);
        })

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
    }
    static updateTask(taskName,projectObj,editForm){
        const currOpenProject = document.getElementById('project-tasks-title').textContent;
        const taskObj = projectObj.getTask(taskName);
        // New task info to update.
        const newDate = document.getElementById('edit-task-date').value;
        const newDetails = document.getElementById('edit-task-details').value;
        const newName = document.getElementById('edit-task-title').value;
        if(newDate === ''){
            LocalStorage.setTaskDate(projectObj.getName(),taskObj.getTaskName(),newDate);
        }
        else{
            LocalStorage.setTaskDate(projectObj.getName(),taskObj.getTaskName(),format(new Date(newDate),'dd/MM/yyyy'));
            LocalStorage.updateToday();
            LocalStorage.updateUpcoming();
        }
        LocalStorage.setTaskDetails(projectObj.getName(),taskObj.getTaskName(),newDetails);
        LocalStorage.renameTask(projectObj.getName(),taskObj.getTaskName(),newName);
        // Reset the interface.
        Interface.clearTaskList();
        Interface.loadProjectTasks(currOpenProject);
        editForm.classList.toggle('popup-active');

    }
}