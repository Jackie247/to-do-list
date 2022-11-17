"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunkto_do_list"] = self["webpackChunkto_do_list"] || []).push([["task"],{

/***/ "./src/task.js":
/*!*********************!*\
  !*** ./src/task.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Task)\n/* harmony export */ });\nclass Task{\n    constructor(name, dueDate, details){\n        this.name = name;\n        this.dueDate = dueDate;\n        this.details = details;\n    }\n    // GETTERS AND SETTERS //\n    setTaskName(name){\n        this.name = name;\n        return\n    }\n    getTaskName(){\n        return this.name;\n    }\n    setDate(newDate){\n        this.dueDate = newDate;\n        return\n    }\n    getDate(){\n        if(this.dueDate !== null){\n            return this.dueDate;\n        }\n        return;\n    }\n    setDetails(details){\n        this.details = details;\n        return\n    }\n    getDetails(){\n        return this.details;\n    }\n}\n\n//# sourceURL=webpack://to-do-list/./src/task.js?");

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./src/task.js"));
/******/ }
]);