import { LitElement, html } from 'lit';

class MyHome extends LitElement {
  render() {
    return html`
      <h1>Welcome to lit starter kit!</h1>
    `;
  }
}

window.customElements.define('my-home', MyHome);
