import { daysInWeek } from "date-fns/fp";

export default class Task {
  constructor(name, dueDate, details) {
    this.name = name;
    this.dueDate = dueDate;
    this.details = details;
    this.parentProject;
    this.index;
    this.checked = false;
  }
  // GETTERS AND SETTERS //
  setTaskName(name) {
    this.name = name;
    return;
  }
  getTaskName() {
    return this.name;
  }
  setDate(newDate) {
    this.dueDate = newDate;
    return;
  }
  getDate() {
    if (this.dueDate !== null) {
      return this.dueDate;
    }
    return;
  }
  setDetails(details) {
    this.details = details;
    return;
  }
  getDetails() {
    return this.details;
  }
  setParentProject(projectName) {
    this.parentProject = projectName;
  }
  getParentProject() {
    return this.parentProject;
  }
  setIndex(index) {
    this.index = index;
  }
  getIndex() {
    return this.index;
  }
  setChecked(bool) {
    this.checked = bool;
  }
  getChecked() {
    return this.checked;
  }
  // METHODS
  returnDateFormatted() {
    const day = this.dueDate.split("/")[0];
    const month = this.dueDate.split("/")[1];
    const year = this.dueDate.split("/")[2];
    // date-fns uses this format to check if date is today or within this week.
    return `${month}/${day}/${year}`;
  }
}
