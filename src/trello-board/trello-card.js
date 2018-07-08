/**
 * @file: trello-card
 * @fileoverview: TrelloCard class defining Trello column web component
 * @author: lmartini
 * @date: 07/07/18
 */

import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import './editable-text.js';
import {cardUrl, request} from "./fake-server.js";

/**
 * @customElement
 * @polymer
 */
class TrelloCard extends PolymerElement {
    static get template() {
        return html`
      <style>
        :host {
            border-style: groove;
            border-width: 1px;
            border-color: blue;
            
        }
        #card-header-container {
            display: flex;
            flex:1
            flex-direction: row;
            justify-content: space-around;
            align-items: center;

        }
        #card-description {
            display: flex;
            flex-direction: column;
            background-color: lightblue;
            
        }
      </style>
      
      <div id="card-header-container">
         <h4><edit-text id=[[id]]Title text={{title}}></h4>
        <button id="removeBtn"> X </button>
       </div>
       
      <details id="card-description">
          <summary>
                <label id="descLabel">No description available</label>
           </summary> 
           <p><edit-text id=[[id]]Desc text={{description}}></edit-text></p>
      </details>
    `;
    }
    static get properties() {
        return {
            title: {
                type: String,
                value: 'card title',
                notify: true,
                observer: 'updateCard'
            },
            description: {
                type: String,
                notify: true,
                reflectToAttribute:true,
                observer: 'updateCard'
            },
            id: {
                type: String
            },
            idNumber:{
                type: Number,
                computed: 'getIdNumber(id)'
            },
            columnId: {
                type: Number
            }
        };
    }

    getIdNumber(id) {
        return id.replace('card','');
    }


    updateCard(newVal, oldVal) {
        if (oldVal) { // it means it's an update
            console.log(newVal);
            this.requestObject = {
                method: 'PUT',
                url: `${cardUrl}/${this.idNumber}`,
                headers: {'Content-Type': 'application/json'},
                body : JSON.stringify({
                    id: this.idNumber,
                    title: this.title,
                    description: this.description,
                    columnId: this.columnId
                })
            };
            request(this.requestObject)
                .then(resp => {
                    resp = JSON.parse(resp);
                    console.log(`card ${resp.id} has been successfully updated`);
                })
                .catch(err => console.error(err));
        }

    }

    constructor() {
        super();
        this.requestObject = {};
    }

    ready() {
        super.ready();
    }

    connectedCallback() {
        super.connectedCallback();

        this.$['removeBtn'].addEventListener('click', () => {
            this.removeCard(this);
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeCardFromDB(this.idNumber);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name,oldValue,newValue);
        if (name === "description") {
           // this.$['card-description'].empty();
            if( newValue === "") {
                this.$['descLabel'].textContent = "No description available";
            } else {
                this.$['descLabel'].textContent = "Description";
            }
        }
    }

    removeCard(elem) {
        elem.parentNode.removeChild(elem);
    }

    removeCardFromDB(cardId) {
        this.requestObject = {
            method: 'DELETE',
            url: `${cardUrl}/${cardId}`,
        };
        request(this.requestObject)
            .then(resp => {
                console.log("remove card successful");
            })
            .catch(err => console.error(err));
    }


}

window.customElements.define('trello-card', TrelloCard);
