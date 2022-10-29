import _ from 'lodash';
import "./style/main.scss"
import Interface from "./interface";

console.log(_.join(['Index','module','loaded'], ' '));
document.addEventListener('DOMContentLoaded',Interface.displayHome);
