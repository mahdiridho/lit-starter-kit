import { LitElement, html, css } from 'lit';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../redux/store';
import { setName } from '../redux/actions.js';

class MyProfile extends connect(store)(LitElement) {
  static get styles() {
    return css`
      :host {
        display: block;
        margin: 10px;
      }
    `;
  }

  render() {
    return html`
      <label for="name">Name</label>
      <input type="text" name="name" .value=${this.name} @input=${this.changeName}>
    `;
  }

  static get properties() {
    return {
      name: { type: String }
    }
  }

  constructor() {
    super();
    this.name = '';
  }

  changeName(e) {
    store.dispatch(setName(e.target.value))
  }

  stateChanged(state) {
    if (this.name != state.app.name) {
      this.name = state.app.name;
    }
  }
}

window.customElements.define('my-profile', MyProfile);
