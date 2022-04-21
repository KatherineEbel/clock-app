import {QuoteGenerator} from "./quote-generator.js";

export class ClockApp {
  #moreButton;
  #quoteGenerator;
  #quote;
  #quoteAttribution;

  constructor() {
    this.#moreButton = document.getElementById('more')
    this.#quoteGenerator = new QuoteGenerator();
    this.#quote = document.getElementById('quote');
    this.#quoteAttribution = document.querySelector('.attribution');
    this.#bindEvents();
  }

  #bindEvents() {
    document.addEventListener('quote', (event) => {
      this.#updateQuote(event.detail);
    });

    this.#moreButton.addEventListener('click', () => {
      document.body.classList.toggle('show-more')
      const moreLabel = this.#moreButton.querySelector('.more__label');
      const text = moreLabel.textContent.trim();
      moreLabel.textContent = text === 'More' ? 'Less' : 'More';
    })
  }

  #updateQuote(quote) {
    const { author, quote: q} = quote;
    [this.#quote, this.#quoteAttribution].forEach(el => {
      el.classList.replace('fade-in', 'fade-out');
    })
    setTimeout(() => {
      this.#quote.innerHTML = `<span>&quot;${q}&quot;</span>`
      this.#quoteAttribution.textContent = author;
      [this.#quote, this.#quoteAttribution].forEach(el => {
        el.classList.replace('fade-out', 'fade-in');
      })
    }, 300)
  }
}