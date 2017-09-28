import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-simple-form',
  template: `
    <div>
      <input type="text" #myInput>
      <button (click)="onClick(myInput.value)">点击</button>
    </div>
  `,
  styles: []
})
export class SimpleFormComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onClick() {
    
  }

}
