import { Component, OnInit } from '@angular/core';

import { MemberService } from './member.service'

interface Member {
  id: string;
  login: string;
  avatar_url: string;
}

@Component({
  selector: 'sl-members',
  template: `
    <h3>Angular Orgs Members</h3>
    <ul *ngIf="members">
      <li *ngFor="let member of members;">
        <p>
          <img [src]="member.avatar_url" width="48" height="48" />
          ID: <span>{{member.id}}</span>
          Name: <span>{{member.login}}</span>
        </p>
      </li>
    </ul>
  `
})

export class MembersComponent implements OnInit {
  members: Member[]

  constructor(private memberService: MemberService) {};

  ngOnInit() {
    this.memberService.getMembers()
      .subscribe(data => {
        if(data) this.members = data;
      });
  }
}