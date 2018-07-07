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
            width:300px;
            min-height: 300px;
        }
        #column-container {
            display: flex;
            flex-direction: column;
            background-color: azure;
            width: 200px;
        }
      </style>
      <h2><edit-text id=[[id]]Title>[[title]]</edit-text></h2>
      <div id="column-container">
        <slot name="card"></slot>
        </div>
    `;
    }
    static get properties() {
        return {
            title: {
                type: String,
                value: 'Title'
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

customElements.define('trello-column', TrelloColumn);
