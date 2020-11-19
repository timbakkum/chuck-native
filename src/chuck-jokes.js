import { LitElement, html } from 'lit-element';

import { unsafeHTML } from "lit-html/directives/unsafe-html.js";

// chuckApi: http://api.icndb.com/jokes/random/${number}

const fetchJokes = async (number = 10) => {
  const result = await fetch(`http://api.icndb.com/jokes/random/${number}`);
  const data = await result.json();
  return data.value.map(({ joke }) => joke);
}

class ChuckJokes extends LitElement {
  static properties = {
    jokes: { type: Array },
    polling: { type: Number },
  };

  render() {
    if (!this.jokes) {
      return html``;
    }

    return html`
      <button @click=${this.togglePolling}>${this.polling ? 'stop' : 'start'}</button>
      <ul>
        ${this.jokes.map((joke) => html` <li>${unsafeHTML(joke)}</li> `)}
      </ul>
    `;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.jokes = await fetchJokes(10);
  }

  async togglePolling() {
    if (this.polling) {
      clearTimeout(this.polling);
      this.polling = false;
      return;
    }

    this.polling = setInterval(async () => {
      const newJokes = await fetchJokes(10);
      this.jokes = [...new Set([...this.jokes, ...newJokes])];
    }, 1000);
  }
}

customElements.define('chuck-jokes', ChuckJokes);