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
        }
        form {
            display: none;
        }
        input {
            display: flex;
            flex:1;
        }
      </style>
      <form id="editableForm">
        <input id="editableInput" required="required" value={{description}}/>
        </form>
      <span id="editableField">{{description}}</span>
    `;
    }

  static get properties() {
        return {
            description: {
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
    //editSpan.textContent = this.textContent;

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

      function updateDisplay(hostElem) {
          editSpan.style.display = 'flex';
          editForm.style.display = 'none';
          editSpan.textContent = editInput.value;
          editInput.style.width = editSpan.clientWidth + 'px';
          hostElem.description = editInput.value;
      }

    });

  }
}

customElements.define('edit-text', EditableText);