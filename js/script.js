'use strict';

(function(){
    
    function createVal(formId, todoItemsId) {
        
        return {
            formId,
            todoItemsId,
            form: null,
            todoItem: null,
            removeBtnAll: null,
            
            
            getForm() {

                const form = document.getElementById(this.formId);
                if(!form) throw new Error('No Form!');

                this.form = form;

            },

            getTodo() {

                const todoItem = document.getElementById(this.todoItemsId);
                if(!todoItem) throw new Error('No todoContainer!');

                this.todoItem = todoItem;

            },

            getRemoveBtn() {
                const removeBtnAll = document.querySelector('.removeAll');
                
                this.removeBtnAll = removeBtnAll;
                
            },

            events() {

                this.form.addEventListener('submit', this.handler.bind(this));
                
                document.addEventListener('DOMContentLoaded', this.dataOnLocal.bind(this));

                this.todoItem.addEventListener('change',this.checkTask.bind(this))
               
                this.todoItem.addEventListener('click', this.removeTask.bind(this));
              
                this.removeBtnAll.addEventListener('click', this.removeAll.bind(this));
            },

            dataOnLocal() {

                const data = JSON.parse(localStorage.getItem(this.formId));
                if(data === null) return;
              

                data.forEach(item => {
                    document.getElementById(this.todoItemsId).prepend(this.createTask(item));
                }) 
            },

            handler(event) {

                event.preventDefault();
                const randomId = Math.random();

                const inputs = event.target.querySelectorAll('input[type=text], textarea');
                const data = {};

                for(const i of inputs) {
                    data[i.name] = i.value;
                }
                
                if(Object.keys(data).length === 0) throw new Error('No data');

                for(const key in data) {
                    if(!data[key].trim().length) throw new Error('Empty data');
                }
               
                data.itemId = randomId;
                data.completed = false

                this.dataInLocal(data);
                
                document.getElementById(this.todoItemsId).prepend(this.createTask(data));

                event.target.reset();
            },

            dataInLocal(data) {
                
                if(!localStorage.getItem(this.formId)) {
                    localStorage.setItem(this.formId, JSON.stringify([data]));

                    return;
                }
                
                const addData = JSON.parse(localStorage.getItem(this.formId))
                addData.push(data);

                localStorage.setItem(this.formId, JSON.stringify(addData));   
            }, 
            
            checkTask({target}) {
                
                const checked = target.checked;

                if(checked) {
                    target.closest('.taskWrapper').classList.add('check');
                }else {
                    target.closest('.taskWrapper').classList.remove('check');
                }
                
                this.completedTask(target.getAttribute('data-item-id'), this.formId, checked);
                
            },

        
            completedTask(dataId, formId, checked) {

                if(!dataId) throw new Error('No dataId');
            
                const data = JSON.parse(localStorage.getItem(formId));
                const index = data.find(item => item.itemId === +dataId)
                
                index.completed = checked;

                localStorage.setItem(formId, JSON.stringify(data));

            },

            removeTask({target}) {

                if(!target.classList.contains('remove-item')) return;

                this.deleteItem(target.getAttribute('data-item-id'), this.formId);
        
                target.closest('.taskWrapper').parentElement.remove();
            },

            deleteItem(dataId, formId) {
                
                if(!dataId) throw new Error('No elementId');

                const data = JSON.parse(localStorage.getItem(formId));
                const index = data.findIndex(todoItem => todoItem.itemId === +dataId);

                data.splice(index, 1);

                localStorage.setItem(formId, JSON.stringify(data));
            },

            removeAll() {

                this.todoItem.textContent = '';

                localStorage.removeItem(this.formId)
            },

            createTask({title, description, itemId, completed}) {
               
                const div = document.createElement('div');
                div.classList.add('col-4');

                let content;

                if(!!completed) {
                   content =  `<div class="taskWrapper check">`;
                } else {
                    content =  `<div class="taskWrapper">`;
                }
                content += `<div class="taskHeading">${title}</div>`;
                content += `<div>`;
                content += `<div class="taskDescription">${description}</div>`;
                content += `<hr>`;
                content += `<label class="completed form-check check-item">`;
                content += `<input data-item-id="${itemId}" class="form-check-input check-item" type="checkbox" id="checkboxNoLabel" value="" aria-label="...">`;
                content += `<span>Completed</span>`
                content += `</label>`;
                content += `</div>`;
                content += `<hr>`;
                content += `<button class="btn btn-danger remove-item" data-item-id="${itemId}">Remove</button>`;
                content += `</div>`;
               
                div.innerHTML = content;
                div.querySelector('input[type=checkbox]').checked = completed;

                return div;
            },

            init() {

                this.getForm();
                this.getTodo();
                this.getRemoveBtn()
                this.events();
            }
           
        }
        
    }

    createVal('todoForm', 'todoItems').init();

})();