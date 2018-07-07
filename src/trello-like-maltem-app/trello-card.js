/**
 * @file: trello-card
 * @fileoverview: TrelloCard class defining Trello column web component
 * @author: lmartini
 * @date: 07/07/18
 */

import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import './editable-text.js';

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
        #card-description {
            display: flex;
            flex-direction: column;
            background-color: lightblue;
            
        }
      </style>
      <h4><edit-text id=[[id]]Title>{{title}}</edit-text></h4>
      <div id="card-description">
        <label>description</label>
        <p><edit-text id=[[id]]Desc>{{description}}</edit-text></p>
      </div>
    `;
    }
    static get properties() {
        return {
            title: {
                type: String,
                value: 'card title'
            },
            description: {
                type: String
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
}

customElements.define('trello-card', TrelloCard);
