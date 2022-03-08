import { LitElement, html } from 'lit';

class SubpageTwo extends LitElement {
  render() {
    return html`
      Sub Page 2<br>
      Query: ${JSON.stringify(this.query)}
    `;
  }

  static get properties() {
    return {
      query: { type: Object }
    }
  }
}

window.customElements.define('subpage-two', SubpageTwo);
