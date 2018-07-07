/**
 * @file: trello-like-maltem-app
 * @fileoverview: TrelloLikeMaltemApp class defining main web component of this app
 * @author: lmartini
 * @date: 07/07/18
 */

import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import './trello-column.js';
import './trello-card.js';
import {columnUrl, cardUrl, request} from "./fake-server.js";

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
      <div id="board-container">
       <!-- <trello-column title="T1">
            <trello-card slot="card" title="c1" ></trello-card>
            <trello-card slot="card" title="c2" description=""></trello-card>
        </trello-column>
        <trello-column title="T2">
            <trello-card slot="card" title="c3" description=""></trello-card>
            <trello-card slot="card" title="c4" description="oopopo"></trello-card>
            <trello-card slot="card" title="c5" description="pofjepiowejfpiwej"></trello-card>
        </trello-column>-->
        </div>
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

    constructor() {
        super();

        // initiate columns and cards with db.json info
        this.columns = [];
        this.cards = [];
        this.requestObject = {
          method: 'GET',
          url: columnUrl
        };
        // call to request
        request(this.requestObject)
            .then(columns => {
                this.columns = columns;
                this.requestObject.url = cardUrl;
                return request(this.requestObject)
            })
            .then(cards => {
                this.cards = cards;
                console.log(this.columns, this.cards);
              }
            )
            .catch(error => {
                console.log(error);
            });

    }

    ready(){
        super.ready();

    }

    initBoard(){

    }


}

customElements.define('trello-like-maltem-app', TrelloLikeMaltemApp);
