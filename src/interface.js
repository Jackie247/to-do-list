import Project from './project.js';
import ProjectList from './projectList.js';
import LocalStorage from './localStorage.js';
/**
 * Handles user interaction with to-do-list interface,
 * methods to handle creating project, tasks, editing tasks, delete project/task
 */
export default class Interface{
    /** Disply content to screen  */
    /** Calls methods to load homepage content  */
    static displayHome(){
        Interface.loadSavedProjects();
        Interface.initProjectButtons();
        Interface.initTaskButtons();
    }
    static loadSavedProjects(){
        LocalStorage.getSavedProjectList()
         .getProjects().forEach((project) => {
            if(project.name !== 'Inbox' && project.name !== 'Today' && project.name !== 'Upcoming'){
                Interface.createProject(project.name);
            }
        })
    }
    static loadTasks(projectName){
        LocalStorage.getSavedProjectList()
         .getProject(projectName).getTaskList()
         .forEach(task => {
            Interface.createTask(task.name,task.date);
         })
    }
    static loadProjectTasks(projectName){
        const projectTasks = document.getElementById('project-tasks');
        const addTaskBtn = document.getElementById('add-task');
        projectTasks.innerHTML = `
            <h2 class="project-title">${projectName}</h2>
            <div class="task-list"></div>
            <button type="button" id='add-task' class="add-task-btn">
                <i id='add-task-icon' class="bi bi-plus-square"></i>
                <p id='add-task-text'>Add Task</p>
            </button>
        `;
        if(projectName == 'Today' || projectName == 'Upcoming'){
            addTaskBtn.style.display = 'none';
        }
        Interface.loadTasks(projectName);
    }
    /** -------------Content creation------------------- */
    /** 
     * @param {string} projectName 
     * Creates a html element and appends itself as a child to the project list.
     * using projectName as the textContent for the project.
     */ 
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
    /** Creates the HTML elements for tasks to be displayed. */ 
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
    }
    /** -----------------Content manipulation------------------- */
    /** Clears all project and task content from the display */
    static clearDisplay(){
        Interface.clearProjectList();
        Interface.clearTaskList();
    }
    /** Clears the projects from the display */
    static clearProjectList(){
        const projectList = document.getElementById('project-list');
        projectList.textContent = '';
    }
    /** Clears the tasks from the display */
    static clearTaskList(){
        const taskList = document.getElementById('task-list');
        taskList.textContent = '';
    }

    /** -------------Event listeners for project---------------*/
    static openProject(projectName, projectButton){
        const projects = document.querySelectorAll('.project');
        const buttons = [projects];
        buttons.forEach((button) => button.classList.remove('active'));
        projectButton.classList.add('active');
        Interface.loadProjectTasks(projectName);
    }
    static deleteProject(projectName,button){
        if(button.classList.contains('active')){
            Interface.clearTaskList()
        };
        LocalStorage.deleteProject(projectName);
        Interface.clearProjectList();
        Interface.loadSavedProjects();
    }
    static initProjectButtons(){
        const inboxBtn = document.getElementById('inbox')
        const todayBtn = document.getElementById('today');
        const upcomingBtn = document.getElementById('upcoming');
        const dropdownBtn = document.getElementById('nav-dropdown')
        const projectsNav = document.querySelector('.projects-tab');

        inboxBtn.addEventListener('click',Interface.loadProjectTasks('Inbox'))
        todayBtn.addEventListener('click',Interface.loadProjectTasks('Today'))
        upcomingBtn.addEventListener('click',Interface.loadProjectTasks('Upcoming'))

        dropdownBtn.addEventListener('click', () => {
            projectsNav.style.display == 'block' ? 
            projectsNav.style.display == 'none' : 
            projectsNav.style.display == 'block';
        })
        Interface.addProjectBtn();
    }
    /** Creates */
    static addProjectBtn(){
        const addBtn = document.getElementById('add-project');
        addBtn.addEventListener('click', Interface.createProjectPopupModal);
    }
    static createProjectPopupModal(){
        const section = document.getElementById('project-popup');
        section.innerHTML = '';
        const container = document.createElement('div');
        const content = document.createElement('div');
        const contentHeader = document.createElement('div');
        const title = document.createElement('h1');
        const closeBtn = document.createElement('button');
        const closeBtnIcon = document.createElement('i');
        const projectNameContainer = document.createElement('div');
        const projectNameInput = document.createElement('input');
        const acceptBtn = document.createElement('button');

        container.classList.add('modal');
        content.classList.add('modal-content');
        contentHeader.classList.add('modal-header');
        closeBtn.classList.add('close-btn');
        closeBtnIcon.classList.add('bi','bi-x-circle');
        container.setAttribute('id','project-modal');

        title.textContent = 'Add a new project.'

        container.appendChild(content);
        content.appendChild(contentHeader);
        content.appendChild(projectNameContainer);
        content.appendChild(acceptBtn);
        contentHeader.appendChild(title);
        contentHeader.appendChild(closeBtn);
        projectNameContainer.appendChild(projectNameInput);
        closeBtn.appendChild(closeBtnIcon);
        
        closeBtn.addEventListener('click', () => {
            container.style.display = 'none';
        })
        section.appendChild(container);
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
                    <h1>Add a new task.</h1>
                    <button id='close-task-popup'class="close-btn">
                    <i class="bi bi-x-circle"></i>
                    </button>
                </div>
                <div class='new-task-title-textarea'>
                    <textarea placeholder="Title: New task" maxlength="40" id="new-task-title" required></textarea>
                </div>
                <div class='new-task-details-textarea'>
                    <textarea placeholder='Details:e.g shopping, gym, deadlines'></textarea>
                </div>
                <div class='new-task-due-date'>
                    <input type='date' class='new-task-date' required>
                </div>
                <div class='new-task-completion'>
                    <label for='complete'>Completed:</label>
                    <input type='checkbox' class='task-complete' name='complete'>
                </div>
                <button>Add Task</button>
            </div>
        </div>`;
        const closeBtn = document.getElementById('close-task-popup');
        const container = document.getElementById('modal-content');
        closeBtn.addEventListener('click', () => {
            container.style.display = 'none';
        })
        section.appendChild(container);
    }
}