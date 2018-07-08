/**
 * @file: editable-text
 * @fileoverview: EditableText class defining editable text web component
 * @author: lmartini
 * @date: 07/07/18
 */

import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {afterNextRender} from '@polymer/polymer/lib/utils/render-status.js';


/**
 * @customElement
 * @polymer
 */
class EditableText extends PolymerElement {
    static get template() {
        return html`
      <style>
        :host {
            display: flex;
        }
        span {
         background-color: #eef; 
         padding: 0 2px;
         display: flex;
         flex:1;
        }
        form {
            display: none;
            flex:1;
        }
        input {
            display: flex;
            flex:1;
        }
      </style>
      <form id="editableForm">
        <input id="editableInput" required="required" value={{text}}/>
        </form>
      <span id="editableField">{{text}}</span>
    `;
    }

  static get properties() {
        return {
            text: {
                type: String,
                notify: true
            },
            id: {
                type: String
            }
        };
    }

  constructor() {
    super();
    this.setAttribute('tabindex', '0');
  }

  ready(){
    super.ready();
    const /** HTMLElement */ editSpan = this.$['editableField'];
    const /** HTMLElement */ editInput = this.$['editableInput'];
    const /** HTMLElement */ editForm = this.$['editableForm'];

    editSpan.textContent = this.text;
    editInput.value = this.text;
    console.log(editSpan.textContent);
    editInput.style.width = editSpan.clientWidth + 'px';

    afterNextRender(this, function() {
      this.addEventListener('click', function () {
          editSpan.style.display = 'none';
          editForm.style.display = 'flex';
          editInput.value = editSpan.textContent;
          editInput.focus();
      });

      editForm.addEventListener('submit', function (e) {
          e.preventDefault();
      });
      editInput.addEventListener('change', (e) => {updateDisplay(this)});
      editInput.addEventListener('focusout', (e) => {
          editSpan.style.display = 'flex';
          editForm.style.display = 'none';

      });

      function updateDisplay(hostElem) {
          editSpan.style.display = 'flex';
          editForm.style.display = 'none';
          editSpan.textContent = editInput.value;
          editInput.style.width = editSpan.clientWidth + 'px';
          hostElem.text = editInput.value;
      }

    });

  }
}

window.customElements.define('edit-text', EditableText);