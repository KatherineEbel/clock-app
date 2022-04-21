import { RefreshButton } from "./refresh-button.js";

export class QuoteGenerator {
  #refreshButton;

  static #Url = "https://programming-quotes-api.herokuapp.com/Quotes/random"

  constructor() {
    this.#refreshButton = new RefreshButton();
    this.#bindEvents();
  }

  #bindEvents() {
    this.#refreshButton.button.addEventListener('click', this.#generateQuote.bind(this))
  }

  async #fetchQuote() {
    try {
      this.#refreshButton.toggle();
      let response = await fetch(QuoteGenerator.#Url);
      let {author, en: quote } = await response.json();
      return {author, quote }
    } catch (e) {
      console.log(e)
      return null
    } finally {
      this.#refreshButton.toggle();
    }
  }

  async #generateQuote() {
    const result = await this.#fetchQuote();
    if (!result) return alert('Unable to get new quote');
    this.#refreshButton.emit(result);
  }
}