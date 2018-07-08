/**
 * @file: trello-board
 * @fileoverview: TrelloBoard class defining main web component of this app
 * @author: lmartini
 * @date: 07/07/18
 */

import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/paper-button/paper-button.js';
import './editable-text.js';
import './trello-column.js';
import './trello-card.js';
import {columnUrl, cardUrl, request} from "./fake-server.js";

/**
 * @customElement
 * @polymer
 */
class TrelloBoard extends PolymerElement {
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
        <input id="searchField" value={{search}}/>
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
          },
        search: {
            type: String,
            value: 'Search',
            notify:true,
            observer: 'searchKeyword'
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
        this.search = "Search";

        this.boardContainer = this.$['board-container'];

        // apply custom events
        this.addEventListener('createCard', (e) => {
            // e.detail contains btn and column Id
            this.createCard(e.detail.btn, e.detail.col);
        });


        this.$['searchField'].addEventListener('change',(e) => this.search = e.target.value);
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
              newCard.columnId = currentCol.id;
              newCard.description = currCard.description || "";
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
        this.addColumnToDB(newCol);

    }

    createCard(addCardBtn, columnId){
        this.totalNumberOfCard++;
        const /** trello-card */ newCard = document.createElement('trello-card');
        newCard.title = `Card ${this.totalNumberOfCard}`;
        newCard.id = `card${this.totalNumberOfCard}`;
        newCard.columnId = columnId;
        newCard.description = "No description";
        newCard.slot = 'card';

        addCardBtn.parentNode.insertBefore(newCard, addCardBtn);
        this.addCardToDB(newCard);
    }


    addColumnToDB(newCol){
        this.requestObject = {
            method: 'POST',
            url: columnUrl,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "id": this.numberOfColumn,
                "title": newCol.title
            })
        };
        request(this.requestObject)
            .then(resp => {
                resp = JSON.parse(resp);
                console.log(`add column ${resp.id} successful `);
            })
            .catch(err => console.error(err));
    }

    addCardToDB(newCard){
        this.requestObject = {
            method: 'POST',
            url: cardUrl,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "id": this.totalNumberOfCard,
                "title": newCard.title,
                "description": newCard.description,
                "columnId":newCard.columnId
            })
        };
        request(this.requestObject)
            .then(resp => {
                resp = JSON.parse(resp);
                console.log(`add card ${resp.id} to column ${resp.columnId} successful `);
            })
            .catch(err => console.error(err));
    }


    searchKeyword(newVal, oldVal) {
        if (oldVal) {
            // if several words we need to do multiple text research and merge results
            const /** array<string> */ splitKeywords = newVal.trim().split(' ');
            const /** array<promise> */ requestPromisesArray = [];
            for(let sk=0; sk<splitKeywords.length; sk++){
                const /** object */ requestObject = {
                    method: 'GET',
                    url: `${cardUrl}?q=${splitKeywords[sk]}`
                };
                requestPromisesArray.push(request(requestObject)
                    .then(resp => {
                        resp = JSON.parse(resp);
                        return resp.map(val => val.id);}));
            }
            Promise.all(requestPromisesArray)
                .then(values => {
                    const /** array<number> */ resp = values.reduce((acc, val) => acc.concat(val), [])
                                                            .filter((val, i, arr) => arr.lastIndexOf(val) === i);
                    // get all cards on the DOM
                    const /** array */ allDomCards = [].slice.call(this.shadowRoot.querySelectorAll('trello-card'));
                    if (resp.length !== 0) {
                        const /** array */ cardsToDisplay = allDomCards.filter((node) => resp.includes(Number(node.idNumber)));
                        const /** array */ cardsToHide = allDomCards.filter((node) => !resp.includes(Number(node.idNumber)));
                        cardsToDisplay.forEach(card => card.removeAttribute('hidden'));
                        cardsToHide.forEach(card => card.setAttribute('hidden', true));
                    } else {
                        allDomCards.forEach(card => card.setAttribute('hidden', true));
                    }
                })
                .catch(err => console.error(err));

        }
    }

}

window.customElements.define('trello-board', TrelloBoard);


