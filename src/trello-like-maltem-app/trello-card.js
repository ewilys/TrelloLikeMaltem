import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

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
      <h4>[[title]]</h4>
      <div id="card-description">
        <label>description</label>
        <p>[[description]]</p>
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
                type: String,
                value: 'no description'
            }
        };
    }

    constructor() {
        super();
    }
}

customElements.define('trello-card', TrelloCard);
