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
      <style>
        :host {
            border-style: solid;
            border-width:1px;
            border-color: black;
            display:flex;
            flex-direction: column;
            justify-content: space-around;
            /* align-items: center; */
            
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
        console.log('Column added to page');
        this.$['removeBtn'].addEventListener('click', () => {
            this.removeColumn(this);
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        console.log('Column removed from page.');

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


