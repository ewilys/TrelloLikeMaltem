/**
 * @file: trello-column
 * @fileoverview: TrelloColumn class defining Trello column web component
 * @author: lmartini
 * @date: 07/07/18
 */

import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import './editable-text.js';
import {columnUrl, cardUrl, request} from "./fake-server";

/* global dragula */

/**
 * @customElement
 * @polymer
 */
class TrelloColumn extends PolymerElement {
    static get template() {
        return html`
      <style xmlns="http://www.w3.org/1999/html">
        :host {
            border-style: solid;
            border-width:1px;
            border-color: black;
            display:flex;
            flex-direction: column;
            justify-content: space-around;
            /* align-items: center; */
            
        }
        .fancy {
            font-size: 14px;
            color: white;
            border-radius: 5px;
            padding: 0.5em 1em;
            background: rgb(76, 208, 204);
            display:flex;
            align-self: center;
          }
        #col-header-container {
            display: flex;
            flex:1
            flex-direction: row;
            justify-content: space-around;
            align-items: center;

        }
        #card-container {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            background-color: azure;
            
        }
      </style>
       
      <div id="col-header-container">
        <h2><edit-text id=[[id]]Title text={{title}}></h2>
        <button id="removeBtn">X</button>
       </div>
      
      <div id="card-container">
        <slot name="card"></slot>
        <button class="fancy" id="addCardBtn">Add Card</button>
        </div>
        
    `;
    }
    static get properties() {
        return {
            title: {
                type: String,
                value: 'Title',
                notify: true,
                observer: 'updateCol'
            },
            id: {
                type: String
            },
            idNumber:{
            type: Number,
                computed: 'getIdNumber(id)'
            }
        };
    }

    getIdNumber(id) {
        return Number(id.replace('col',''));
    }

    updateCol(newVal, oldVal) {
        if (oldVal) { // it means it's an update
            this.requestObject = {
                method: 'PUT',
                url: `${columnUrl}/${this.idNumber}`,
                headers: {'Content-Type': 'application/json'},
                body : JSON.stringify({
                    id: this.idNumber,
                    title: this.title,
                })
            };
            request(this.requestObject)
                .then(resp => {
                    resp = JSON.parse(resp);
                    console.log(`col ${resp.id} has been successfully updated`);
                })
                .catch(err => console.error(err));
        }

    }

    constructor() {
        super();
    }


    ready() {
        super.ready();
    }

    connectedCallback() {
        super.connectedCallback();

        const containers = this.$['card-container'].querySelectorAll('slot');
        console.log(containers);
        this.drake = dragula([this.$['card-container']]);
        this.drake.on('drag', function (el, source) {
            this.fire('dragula-drag', {el: el, source: source});
        }.bind(this));
        this.drake.on('dragend', function (el) {
            this.fire('dragula-dragend', {el: el});
        }.bind(this));
        this.drake.on('drop', function (el, target, source, sibling) {
            this.fire('dragula-drop', {el: el, target: target, source: source, sibling: sibling});
        }.bind(this));
        this.drake.on('cancel', function (el, container, source) {
            this.fire('dragula-cancel', {el: el, container: container, source: source});
        }.bind(this));
        this.drake.on('remove', function (el, container, source) {
            this.fire('dragula-remove', {el: el, container: container, source: source});
        }.bind(this));
        this.drake.on('shadow', function (el, container, source) {
            this.fire('dragula-shadow', {el: el, container: container, source: source});
        }.bind(this));
        this.drake.on('over', function (el, container, source) {
            this.fire('dragula-over', {el: el, container: container, source: source});
        }.bind(this));
        this.drake.on('out', function (el, container, source) {
            this.fire('dragula-out', {el: el, container: container, source: source});
        }.bind(this));
        this.drake.on('cloned', function (clone, container, type) {
            this.fire('dragula-cloned', {clone: clone, container: container, type: type});
        }.bind(this));

        // // attach event to the drop container
        // this.$['card-container'].addEventListener('dragover', (e) => e.preventDefault());
        // this.$['card-container'].addEventListener('drop', (e) => {
        //     console.log(e);
        //     console.log(e.dataTransfer.getData('application/x-moz-node'));
        //     e.preventDefault();
        // });

        // attach event for button
        this.$['removeBtn'].addEventListener('click', () => {
            this.removeColumn(this);
        });
        this.$['addCardBtn'].addEventListener('click', (e) =>{
            // this = trello-column
            this.dispatchEvent(new CustomEvent('createCard',
                {detail: {btn:e.target, col:this.idNumber}, composed:true}));
        });


    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.drake.destroy();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name,oldValue,newValue);
        console.log(name, newValue);
    }

    removeColumn(elem) {
        elem.parentNode.removeChild(elem);
        this.removeColumnFromDB(this.idNumber);
    }

    removeColumnFromDB(colId) {
        this.requestObject = {
            method: 'DELETE',
            url: `${columnUrl}/${colId}`,
        };
        request(this.requestObject)
            .then(resp => {
                console.log("remove column successful");
            })
            .catch(err => console.error(err));
    }


}

window.customElements.define('trello-column', TrelloColumn);


