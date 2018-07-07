# \<trello-like-maltem\>

trello like assignment for Maltem using web components

#Installation process

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed.
```bash
$ npm install -g polymer-cli
```
## Install the JSON-Sever

then install JSON-Server on your computer

```bash
$ npm install -g json-server
```

## Install dependencies

```bash
$ npm install
```

## To view the application
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

## Running Tests

```
$ polymer test
```

