import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-star-button',
  imports: [],
  templateUrl: './star-button.html',
  styleUrl: './star-button.css'
})
export class StarButton {
  disabled = input<boolean>();
  selected = input<boolean>();
  clikEvent = output<Event>();

  onClick(event: Event) {
    this.clikEvent.emit(event);
  }

}
