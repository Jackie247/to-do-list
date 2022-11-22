import { isThisWeek, isToday, toDate, subDays } from "date-fns";

export default class Project {
  constructor(name) {
    this.name = name;
    this.taskList = [];
  }
  // GETTERS AND SETTERS //
  setName(name) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
  setTaskList(tasks) {
    // sets this.taskList as a reference to new list;
    this.taskList = tasks;
  }
  getTaskList() {
    return this.taskList;
  }
  // METHODS //
  addTask(newTask) {
    if (this.taskList.find((task) => task.getTaskName() === newTask.name))
      return;
    this.taskList.push(newTask);
  }
  deleteTask(task) {
    var index = this.taskList.indexOf(this.getTask(task));
    this.taskList.splice(index, 1);
    return;
  }
  getTask(taskName) {
    return this.taskList.find((task) => task.getTaskName() === taskName);
  }
  // HELPER //
  taskListContains(taskName) {
    // returns true if found, false if not.
    return this.taskList.some((task) => task.getTaskName() === taskName);
  }
  getTodaysTasks() {
    return this.taskList.filter((task) => {
      return isToday(toDate(new Date(task.returnDateFormatted())));
    });
  }
  getUpcomingTasks() {
    return this.taskList.filter((task) => {
      const taskDueDate = new Date(task.returnDateFormatted());
      return isThisWeek(subDays(toDate(taskDueDate), 1));
    });
  }
}
