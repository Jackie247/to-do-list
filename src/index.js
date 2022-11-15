import "./style/main.scss"
import Interface from "./interface.js";

document.addEventListener('DOMContentLoaded', Interface.displayHome);

const editForm = document.getElementById('edit-task-popup');
editForm.addEventListener('submit', e => {
    Interface.updateTask(e,editForm);
})
