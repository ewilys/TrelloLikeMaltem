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
            border: 1px groove lavender;
            border-radius: 5px;
            display:flex;
            flex-direction: column;
            padding: 5px;
            margin: 5px 0px;
            background-color: lightgoldenrodyellow;
           
        }
        #card-header-container {
            display: flex;
            flex:1
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

        }
        #removeBtn {
            font-size: 10px;
            color: black;
            border-radius: 5px;
            padding: 0.5em ;
            background: lavender;
            display:flex;
            align-self: center;
        }
        #card-description {
            display: flex;
            flex-direction: column;
            /*background-color: lightblue;*/
           
            
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

        this.addEventListener('click', () => {
           const /** HTMLElement */ details = this.shadowRoot.querySelector('details');
           if (details.hasAttribute('open')) {
               details.removeAttribute('open');
           } else {
               details.setAttribute('open', true);
           }
        });
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
            if( newValue === "No description" || newValue === "None") {
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
