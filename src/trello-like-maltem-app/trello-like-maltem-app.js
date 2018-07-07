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
        .fancy {
            font-size: 14px;
            color: white;
            border-radius: 5px;
            padding: 0.5em 1em;
            background: rgb(76, 208, 204);
            
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
            justify-content: space-around;
            align-items: flex-start;
        }
      </style>
      <h1>[[Title]]</h1>
       <app-toolbar>
        <div main-title>My board</div>
      </app-toolbar>
      <div id="board-container">
        </div>
    `;
  }
  static get properties() {
    return {
      Title: {
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
        this.numberOfColumn = 0;
        this.totalNumberOfCard = 0;
        this.requestObject = {
          method: 'GET',
          url: columnUrl
        };


    }


    ready(){
        super.ready();

        this.boardContainer = this.$['board-container'];

        // apply custom event
        this.addEventListener('createCard', (e) => {
            this.createCard(e.detail);
        });

        // call to request
        request(this.requestObject)
            .then(columns => {
                this.columns = JSON.parse(columns);
                this.requestObject.url = cardUrl;
                return request(this.requestObject)
            })
            .then(cards => {
                    this.cards = JSON.parse(cards);
                    this.initBoard();
                }
            )
            .catch(error => {
                console.log(error);
            });

    }

    initBoard(){
      const /** number */ colLength = this.columns.length;
      if (colLength !== 0) {
        this.columns.forEach(currentCol => {
          const /** trello-column */ newCol = document.createElement('trello-column');
          newCol.title = currentCol.title;
          newCol.id = `col${currentCol.id}`;

          const /** array<object> */ correspondingCard = this.cards.filter(card => card.columnId === currentCol.id);
          correspondingCard.forEach(currCard => {
              const /** trello-card */ newCard = document.createElement('trello-card');
              newCard.title = currCard.title;
              newCard.id = `card${currCard.id}`;
              if (currCard.description !== undefined) newCard.description = currCard.description;
              newCard.slot = 'card';

              newCol.appendChild(newCard);
              this.totalNumberOfCard++;
              return newCol;
          });

          this.boardContainer.appendChild(newCol);
          this.numberOfColumn++;
        });


      }


      // now add the add Column button
        const /** simple-button */ addColButt = document.createElement('button');
        addColButt.setAttribute('class', 'fancy');
        addColButt.textContent = 'Add Column';

        addColButt.addEventListener('click',() => {
            this.createColumn(addColButt);
        });

        this.boardContainer.appendChild(addColButt);


    }

    createColumn(addColButt){
        this.numberOfColumn++;
        const /** trello-column */ newCol = document.createElement('trello-column');
        newCol.title = `Column ${this.numberOfColumn}`;
        newCol.id = `col${this.numberOfColumn}`;

        this.boardContainer.insertBefore(newCol, addColButt);
    }

    createCard(addCardBtn){
        this.totalNumberOfCard++;
        const /** trello-card */ newCard = document.createElement('trello-card');
        newCard.title = `Card${this.totalNumberOfCard}`;
        newCard.id = `card${this.totalNumberOfCard}`;
        newCard.description = "No description";
        newCard.slot = 'card';

        addCardBtn.parentNode.insertBefore(newCard, addCardBtn);
    }
}

customElements.define('trello-like-maltem-app', TrelloLikeMaltemApp);


