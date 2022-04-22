import {QuoteGenerator} from "./quote-generator.js";

export class ClockApp {
  #moreButton;
  #quoteGenerator;
  #quote;
  #quoteAttribution;
  timeOfDay;

  constructor() {
    this.#moreButton = document.getElementById('more')
    this.#quoteGenerator = new QuoteGenerator();
    this.#quote = document.getElementById('quote');
    this.#quoteAttribution = document.querySelector('.attribution');
    this.#bindEvents();
    this.timeOfDay = 'morning';
    ClockApp.#getDetails().then(details => this.#updateUI(details));
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


  static async #getDetails() {
    try {
      let response = await fetch('./.netlify/functions/time-details');
      return await response.json();
    } catch (e) {
      alert('Sorry, unable to fetch time details.')
    }
  }

  #updateQuote(quote) {
    const {author, quote: q} = quote;
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

  static #getTime(dateString) {
    let date = new Date(dateString);
    let hour = String(date.getHours())
    let minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hour}<span class="blink">:</span>${minutes}`
  }

  static #timeOfDay(hour) {
    if (hour >= 5 && hour < 12) {
      return 'morning';
    }
    if (hour >= 12 && hour < 18) {
      return 'afternoon'
    }
    if (hour >= 18 || hour < 5) {
      return 'evening'
    }
  }

  #updateTimeOfDay(date) {
    const { timeOfDay } = this
    this.timeOfDay = ClockApp.#timeOfDay(date.getHours());
    document.querySelectorAll('.welcome').forEach(el => {
      el.textContent = el.textContent.trim().replace(timeOfDay, this.timeOfDay);
    })
    document.querySelector('html').dataset.theme = this.timeOfDay === 'evening' ? 'evening' : ''
  }

  startClock(date) {
    let ms = date.getTime();
    const oneMinute = 60 * 1000
    setInterval(() => {
      let newDate = new Date(oneMinute + ms);
      this.#updateTimeOfDay(newDate);
      ms = newDate.getTime();
      document.getElementById('time').innerHTML = ClockApp.#getTime(newDate.toUTCString())
    }, oneMinute)
  }

  #updateUI(details) {
    const { utc_datetime} = details;
    let date = new Date(utc_datetime);
    this.startClock(date);
    this.#updateTimeOfDay(date)
    details.time = ClockApp.#getTime(utc_datetime);
    delete details.utc_datetime;
    Object.keys(details).forEach(key => {
      const el = document.getElementById(key);
      if (!el) return;
      if (key === 'time') {
        el.innerHTML = details[key]
      } else {
        el.textContent = details[key];
      }
    })
  }
}