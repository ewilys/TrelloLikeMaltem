import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

/**
 * @customElement
 * @polymer
 */
class TrelloLikeMaltemApp extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        app-toolbar {
            /* Toolbar is the main header, so give it some color */
          background-color: #1E88E5;
          font-family: 'Roboto', Helvetica, sans-serif;
          color: white;
          --app-toolbar-font-size: 24px;
        }
        #board-container {
            display: flex;
            flex-direction: row;
        }
      </style>
      <h1>[[prop1]]</h1>
       <app-toolbar>
        <div main-title>My board</div>
      </app-toolbar>
      <div id="board-container"></div>
    `;
  }
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'My trello'
      }
    };
  }
}

window.customElements.define('trello-like-maltem-app', TrelloLikeMaltemApp);
