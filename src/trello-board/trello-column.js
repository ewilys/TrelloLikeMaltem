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

/**
 * @customElement
 * @polymer
 */
class TrelloColumn extends PolymerElement {
    static get template() {
        return html`
      <style xmlns="http://www.w3.org/1999/html">
        :host {
            border: 2px solid lightblue;
            border-radius: 5px;
            display:flex;
            flex-direction: column;
            justify-content: space-around;
            padding: 10px;
            
            
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
          
        #removeBtn {
            font-size: 10px;
            color: white;
            border-radius: 5px;
            padding: 0.5em ;
            background: rgb(76, 208, 204);
            display:flex;
            align-self: center;
        }
        #col-header-container {
            display: flex;
            flex:1;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

        }
        #column-container {
            display: flex;
            flex:1;
            flex-direction: column;
            justify-content: space-around;
            background-color: azure;
            
        }
      </style>
       
      <div id="col-header-container">
        <h2><edit-text id=[[id]]Title text={{title}}></h2>
        <button id="removeBtn">X</button>
       </div>
      
      <div id="column-container">
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


