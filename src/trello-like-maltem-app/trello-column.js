/**
 * @file: trello-column
 * @fileoverview: TrelloColumn class defining Trello column web component
 * @author: lmartini
 * @date: 07/07/18
 */

import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import './editable-text.js';

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
        #column-container {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            background-color: azure;
            
        }
      </style>
       
      <div id="col-header-container">
        <h2><edit-text id=[[id]]Title>{{title}}</edit-text></h2>
        <button id="removeBtn"> X </button>
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
                notify: true
            },
            id: {
                type: String
            }
        };
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
                {detail: {btn:e.target, col:this.id.replace('col','')}, composed:true}));
        });

    }

    disconnectedCallback() {
        super.disconnectedCallback();
        console.log(this.id);
        this.dispatchEvent(new CustomEvent('rc', {composed:true}));

    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name,oldValue,newValue);
        console.log(name, newValue);
    }

    removeColumn(elem) {
        elem.parentNode.removeChild(elem);
    }


}

customElements.define('trello-column', TrelloColumn);


