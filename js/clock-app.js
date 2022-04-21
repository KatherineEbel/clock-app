import {QuoteGenerator} from "./quote-generator.js";
import {GEO_API_KEY} from "./geoapikey.js";

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
      let geoIP = await fetch(`https://api.freegeoip.app/json/?apikey=${GEO_API_KEY}`)
      const {country_code, region_name, time_zone} = await geoIP.json();

      const worldTime = await fetch(`http://worldtimeapi.org/api/timezone/${time_zone}`)
      const {abbreviation, day_of_week, day_of_year, week_number, utc_datetime} = await worldTime.json();
      return {abbreviation, country_code, day_of_week, day_of_year, region_name, time_zone, utc_datetime, week_number}
    } catch (e) {
      console.log(e)
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
    let hour = String(date.getHours()).padStart(2, '0')
    let minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hour}<span class="blink">:</span>${minutes}`
  }

  #trackTime(date) {
    let ms = date.getTime();
    const oneMinute = 60 * 1000
    setInterval(() => {
      let newDate = new Date(oneMinute + ms);
      ms = newDate.getTime();
      document.getElementById('time').innerHTML = ClockApp.#getTime(newDate.toUTCString())
    }, oneMinute)
  }

  #updateUI(details) {
    const { utc_datetime} = details;
    this.#trackTime(new Date(utc_datetime));
    details.time = ClockApp.#getTime(utc_datetime);
    delete details.utc_datetime;
    Object.keys(details).forEach(key => {
      const el = document.getElementById(key);
      if (!el) return console.log('no element for', key)
      if (key === 'time') {
        el.innerHTML = details[key]
      } else {
        el.textContent = details[key];
      }
    })
  }
}