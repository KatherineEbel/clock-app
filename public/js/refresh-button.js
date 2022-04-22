export class RefreshButton {
  button;

  constructor() {
    this.button = document.getElementById('refresh');
  }

  emit(quote) {
    let event = new CustomEvent('quote', {bubbles: true, detail: quote })
    this.button.dispatchEvent(event)
  }

  toggle() {
    const { disabled, classList } = this.button;
    this.button.disabled = !disabled;
    classList.toggle('rotate');
  }
}