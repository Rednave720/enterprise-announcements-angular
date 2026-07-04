import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { PortalRole } from '../portal-role';

@Component({
  selector: 'app-topbar',
  imports: [MatButtonModule, MatButtonToggleModule, MatIconModule, MatToolbarModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class Topbar {
  @Input({ required: true }) isHandset = false;
  @Input({ required: true }) role: PortalRole = 'ADMIN';
  @Output() readonly menuToggle = new EventEmitter<void>();
  @Output() readonly roleChange = new EventEmitter<PortalRole>();

  changeRole(role: PortalRole | undefined): void {
    if (role && role !== this.role) {
      this.roleChange.emit(role);
    }
  }
}
