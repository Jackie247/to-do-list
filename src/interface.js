export default class Interface{
    constructor(){}
    static displayNav(){

    }
    static updateInterface(){

    }

    static initProjectButtons(){
        this.addProjectBtn();
    }

    static addProjectBtn(){
        const container = document.querySelector('.add-project-container');
        const button = document.getElementById('add-project-btn');
        const projectName = document.createElement('input');
        button.addEventListener('click',()=>{
            button.classList.add('hidden');
            container.appendChild(projectName);
            container.appendChild(this.createAcceptButton());
            container.appendChild(this.createCancelButton());
        });
    }

    static createAcceptButton(){
        const container = document.createElement('div');
        const acceptBtn = document.createElement('button');

        container.setAttribute('id','btn-container');
        acceptBtn.setAttribute('id','accept-btn');

        acceptBtn.textContent = 'Accept';

        container.appendChild(acceptBtn);

        return container;
    }

    static createCancelButton(){
        const container = document.createElement('div');
        const cancelBtn = document.createElement('button');

        container.setAttribute('id','btn-container');
        cancelBtn.setAttribute('id','cancel-btn');

        cancelBtn.textContent = 'Cancel';
        
        container.appendChild(cancelBtn);

        return container;
    }
}