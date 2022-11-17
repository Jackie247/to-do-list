"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkto_do_list"] = self["webpackChunkto_do_list"] || []).push([["project"],{

/***/ "./src/project.js":
/*!************************!*\
  !*** ./src/project.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Project)\n/* harmony export */ });\nclass Project{\n    constructor(name){\n        this.name = name;\n        this.taskList = [];\n    }\n    // GETTERS AND SETTERS //\n    setName(name){\n        this.name = name;\n    }\n    getName(){\n        return this.name;\n    }\n    setTaskList(tasks){\n        // sets this.taskList as a reference to new list;\n        this.taskList = tasks;\n    }\n    getTaskList(){\n        return this.taskList;\n    }\n    // METHODS //\n    addTask(newTask){\n        if(this.taskList.find((task) => task.getTaskName() === newTask.name)) return;\n        this.taskList.push(newTask);\n    }\n    deleteTask(task){\n        var index = this.taskList.indexOf(this.getTask(task));\n        this.taskList.splice(index, 1);\n        return;\n    }\n    getTask(taskName){\n        return this.taskList.find((task) => task.getTaskName() === taskName);\n    } \n    // HELPER //\n    taskListContains(taskName){\n        // returns true if found, false if not.\n        return this.taskList.some(task => task.getTaskName() === taskName);\n    }\n}\n\n//# sourceURL=webpack://to-do-list/./src/project.js?");

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./src/project.js"));
/******/ }
]);