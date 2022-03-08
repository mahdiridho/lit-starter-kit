import { html, LitElement, css } from 'lit';
import { router, navigator, outlet } from 'lit-element-router';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../redux/store';
import { updateMetadata } from 'pwa-helpers/metadata.js';
import { setPassiveTouchGestures } from '../utils/settings.js';
import { installMediaQueryWatcher } from "../utils/media-query";
import { Layouts } from '@collaborne/lit-flexbox-literals';

// These are the actions needed by this element.
import { initMetadata } from '../redux/actions.js';

// These are the elements needed by this element.
import '@material/mwc-drawer';
import '@material/mwc-top-app-bar';
import '@material/mwc-icon-button';
import '@material/mwc-icon';
import '@material/mwc-list/mwc-list';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-snackbar';
import '@pwabuilder/pwainstall';

class MyApp extends connect(store)(router(navigator(outlet(LitElement)))) {
  static get styles() {
    return [
      Layouts,
      css`
      :host {
        --app-primary-color: #4285f4;
        --app-secondary-color: black;
        display: block;
      }

      mwc-drawer {
        height: 100vh;
      }

      mwc-icon-button.menu[hidden] {
        display: none;
      }

      .main-content {
        padding-left: 20px;
      }

      .sublist {
        padding-left: 20px;
      }

      .sublist[hidden] {
        display: none;
      }
      pwa-install {
        position: fixed;
        bottom: 10px; right: 10px;
      }
      `
    ];
  }

  render() {
    // Anything that's related to rendering should be done in here.
    return html`
      <style>
      mwc-top-app-bar {
        --mdc-top-app-bar-width: ${this.desktop?'calc(100% - 256px)':'100%'};
      }
      </style>
      <!-- Header -->
      <mwc-drawer hasHeader .type="${this.desktop ? '' : 'modal'}" ?open=${this.drawerState} @MDCDrawer:closed="${() => this.drawerState = !this.drawerState}">
        <span slot="title">Menu</span>
        <span slot="subtitle">Hi ${this.name}</span>
        <div>
          <mwc-list>
            <mwc-list-item graphic="avatar" @click="${() => this.linkClick('/home')}">
              <span>Home</span>
              <mwc-icon slot="graphic">home</mwc-icon>
            </mwc-list-item>
            <mwc-list-item graphic="avatar" @click="${this.pageExpand}">
              <span>
                Page
              </span>
              <mwc-icon slot="graphic">article</mwc-icon>
            </mwc-list-item>
            <mwc-list class="sublist" ?hidden="${!this.collapse}">
              <mwc-list-item graphic="avatar" @click="${() => this.linkClick('/page/one')}">
                <span>Sub Page 1</span>
                <mwc-icon slot="graphic">subject</mwc-icon>
              </mwc-list-item>
              <mwc-list-item graphic="avatar" @click="${() => this.linkClick('/page/two?query1=abc&query2=1234')}">
                <span>Sub Page 2</span>
                <mwc-icon slot="graphic">subject</mwc-icon>
              </mwc-list-item>
            </mwc-list>
          </mwc-list>
        </div>
        <div slot="appContent">
          <mwc-top-app-bar>
            <mwc-icon-button slot="navigationIcon" class="menu" icon="menu" ?hidden="${this.desktop}" @click="${() => this.drawerState = !this.drawerState}"></mwc-icon-button>
            <div slot="title">${this.title}</div>
            <mwc-icon-button slot="actionItems" icon="account_circle" title="Profile" @click=${() => this.navigate("/profile")}></mwc-icon-button>
          </mwc-top-app-bar>
          <div class="main-content">
            <my-home route='home'></my-home>
            <my-page route='page' .params=${this.params} .query=${this.query}></my-page>
            <my-profile route='profile'></my-profile>
            <my-view404 route='view404'></my-view404>
          </div>
          <mwc-snackbar></mwc-snackbar>
          <pwa-install></pwa-install>
        </div>
      </mwc-drawer>
    `;
  }

  get toast() {
    return this.shadowRoot.querySelector("mwc-snackbar")
  }

  static get properties() {
    return {
      page: { type: String },
      params: { type: Object },
      query: { type: Object },
      data: { type: Object },
      title: { type: String },
      metadata: { type: Object },
      desktop: { type: Boolean },
      drawerState: { type: Boolean },
      collapse: { type: Boolean },
      name: { type: String }
    };
  }

  static get routes() {
    return [{
      name: 'home',
      pattern: '',
      data: { 
        title: 'Home',
        description: "Trazit Platform",
        img: "./images/lit.png"
      }
    }, {
      name: 'home',
      pattern: 'home',
      data: { 
        title: 'Home',
        description: "Trazit Platform",
        img: "./images/lit.png"
      }
    }, {
      name: 'profile',
      pattern: 'profile',
      data: { title: 'Profile' }
    }, {
      name: 'page',
      pattern: 'page'
    }, {
      name: 'page',
      pattern: 'page/:sub'
    }, {
      name: 'view404',
      pattern: '*'
    }];
  }

  router(route, params, query, data) {
    this.activeRoute = route;
    this.params = params;
    this.query = query;
    this.data = data;
    console.log(route, params, query, data)
    this._routeChanged();
  }

  constructor() {
    super();
    // To force all event listeners for gestures to be passive.
    // See https://www.polymer-project.org/3.0/docs/devguide/settings#setting-passive-touch-gestures
    setPassiveTouchGestures(true);
    this.page = "";
    this.params = {};
    this.query = {};
    this.data = {};
    this.drawerState = false;
  }

  firstUpdated() {
    window.addEventListener('online', () => {
      this.toast.labelText = "You are now online"
      this.toast.show()
    })
    window.addEventListener('offline', () => {
      this.toast.labelText = "You are now offline"
      this.toast.show()
    })
    installMediaQueryWatcher(`(min-width: 461px)`, desktop => this.desktop = desktop);
    fetch("./src/config.json").then((response)=>{ // load the file data
      return response.json()
    }).then((json)=>{
      this.title = json.appTitle;
    }).catch((e)=>{
      console.log("ERROR : ",e)
      return reject(e)
    })
  }

  updated(updates) {
    if (updates.has('page') || updates.has('params'))
      this._pageChanged();
  }

  pageExpand() {
    this.linkClick('/page');
    this.collapse = !this.collapse;
  }

  linkClick(path) {
    this.navigate(path);
  }

  _routeChanged() {
    // Show the corresponding page according to the route.
    //
    // If no page was found in the route data, page will be an empty string.
    // Show 'home' in that case. And if the page doesn't exist, show 'view404'.
    if (this.activeRoute == "") {
      this.page = "home";
    } else if (['home', 'profile', 'page','view404'].indexOf(this.activeRoute) !== -1) {
      this.page = this.activeRoute;
    } else {
      this.navigate("/view404");
    }
  }

  _pageChanged() {
    this.requestUpdate(); // call it to wait the page prop complete updated
    // Import the page component on demand.
    //
    // Note: `polymer build` doesn't like string concatenation in the import
    // statement, so break it up.
    switch (this.page) {
      case 'home':
        this.title = "Home";
        import('./my-home');
        break;
      case 'page':
        this.title = "Page";
        import('./my-page');
        if (['one', 'two'].indexOf(this.params.sub) !== -1)
          this.title += " - " + this.params.sub;
        break;
      case 'profile':
        this.title = "profile";
        import('./my-profile');
        break;
      case 'view404':
        this.title = "404";
        import('./my-view404');
        break;
    }

    if (this.page == 'home') {
      store.dispatch(initMetadata({
        title: this.title +' - '+ this.data.title,
        image: './images/'+ this.data.img
      }));
    } else {
      store.dispatch(initMetadata({
        title: this.title +' - '+ this.params.menu
      }));
    }
  }

  stateChanged(state) {
    if (JSON.stringify(state.app.metadata) != JSON.stringify(this.metadata)) {
      this.metadata = state.app.metadata;
      updateMetadata({
        ...state.app.metadata,
        url: window.location.href
      })
    }
    if (this.name != state.app.name) {
      this.name = state.app.name
    }
  }
}

window.customElements.define('my-app', MyApp);
