import { Component } from '@angular/core';

interface Address {
  province: string;
  city: string;
}

@Component({
  selector: 'sl-user',
  template: `
    <h2>大家好，我是{{name}}</h2>
    <p>我来自<strong>{{address.province}}</strong>,
      <strong>{{address.city}}</strong>市
    </p>
    <div *ngIf="showSkills">
      <h3>我的技能</h3>
      <ul>
        <li *ngFor="let skill of skills">
          {{skill}}
        </li>
      </ul>
      <form (submit)="addSkill(skill.value)">
        <label>添加技能</label>
        <input type="text" #skill>
        <button type="submit">添加技能</button>
      </form>
    </div>
    <button (click)="toggleSkills()">
      {{showSkills ? '隐藏技能' : '显示技能'}}
    </button>
  `
})

export class UserComponent {
  name: string;
  address: Address;
  showSkills: boolean;
  skills: string[];

  constructor() {
      this.name = 'Semlinker';
      this.address = {
        province: '福建',
        city: '厦门'
      };
      this.showSkills = true;
      this.skills = ['AngularJS 1.x', 'Angular 2.x', 'Angular 4.x'];
  }

  toggleSkills() {
    this.showSkills = !this.showSkills;
  }

  addSkill(skill: string) {
    let skillStr = skill.trim();
    if(this.skills.indexOf(skillStr) === -1) {
      this.skills.push(skillStr);
    }
  }
}