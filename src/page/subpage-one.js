import { LitElement, html } from 'lit';

class SubpageOne extends LitElement {
  render() {
    return html`
      Sub Page 1
    `;
  }
}

window.customElements.define('subpage-one', SubpageOne);
