# trello-like-maltem


Trello like assignment for Maltem using web components and Polymer


## Installation process

### Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed.
```bash
$ npm install -g polymer-cli
```
### Install the JSON-Sever

then install JSON-Server on your computer

```bash
$ npm install -g json-server
```

### Install dependencies

```bash
$ npm install
```

### To view the application
Run first the fake server

If you are under windowsOs run :

```bash
$ npm start
```
Otherwise you can run :

```bash
$ json-server --watch materials/db.json
```
and then on another console
```
$ polymer serve
```
Now you can go to [http://localhost:8081/](http://localhost:8081/)

## Features

### implemented

* columns and cards are displayed according to the db.json
* A column can be created and deleted using associated button, the db.json is updated with related changes
* The column's title can be modified when clicking on it, the db.json is updated with related changes
* In a column, a card can be created and deleted using associated button, the db.json is updated with related changes
* The card's title and description can be modified when clicking on it, the db.json is updated with related changes
* When clicking on the card, the description is revealed or hidden depending on the current state
* It's possible to search with one keyword or several, the view is updated accordingly

### not implemented

* Drag and drop of cards from one column to another
* Unit tests

## Remaining issues

* The search is not working on new cards added,
this.shadowRoot of the trello-board web component does not seems to be updated when the card is created
but the search works correctly when cards are removed



