import { LitElement, html } from 'lit';
import { navigator } from 'lit-element-router';

class MyPage extends navigator(LitElement) {
  render() {
    return html`
      <h3>Main Page</h3>
      <subpage-one ?hidden="${this.params.sub=='one'?false:true}"></subpage-one>
      <subpage-two ?hidden="${this.params.sub=='two'?false:true}" .query=${this.query}></subpage-two>
    `;
  }

  static get properties() {
    return {
      params: { type: Object },
      query: { type: Object }
    }
  }

  constructor() {
    super()
    this.params = {}
  }

  updated(updates) {
    if (updates.has('params'))
      this._subrouteChanged();
  }

  _subrouteChanged() {
    this.requestUpdate(); // call it to wait the page prop complete updated
    if (this.params.sub) {
      if (['one', 'two'].indexOf(this.params.sub) !== -1) {
        import('./page/subpage-' + this.params.sub + '.js');
      } else {
        this.navigate("/page");
      }
    }
  }
}

window.customElements.define('my-page', MyPage);
