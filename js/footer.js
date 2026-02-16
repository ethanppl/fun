class Footer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <footer>
        <div class="footer-container">
          <a href="/">Home</a>
          <a href="https://ethanppl.com" target="_blank">About me</a>
        </div>
      </footer>
    `;
  }
}

customElements.define('c-footer', Footer);
