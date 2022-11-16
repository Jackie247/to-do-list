import "./style/main.scss"
import Interface from "./interface.js";
import LocalStorage from "./localStorage";

document.addEventListener('DOMContentLoaded', Interface.displayHome);

const savedProjectList = LocalStorage.getSavedProjectList();
const editForm = document.getElementById('edit-task-modal');
editForm.addEventListener('click', e => {
    Interface.updateTask(e,savedProjectList,editForm);
})
