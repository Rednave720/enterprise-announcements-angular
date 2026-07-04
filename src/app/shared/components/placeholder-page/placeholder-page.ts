import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { PageHeader } from '../page-header/page-header';

interface PlaceholderRouteData {
  section: string;
  title: string;
  description: string;
  icon: string;
  placeholder: string;
  notFound?: boolean;
}

@Component({
  selector: 'app-placeholder-page',
  imports: [MatButtonModule, MatCardModule, MatIconModule, PageHeader, RouterLink],
  templateUrl: './placeholder-page.html',
  styleUrl: './placeholder-page.scss',
})
export class PlaceholderPage {
  private readonly route = inject(ActivatedRoute);
  private readonly routeData = toSignal(this.route.data, { initialValue: {} });

  readonly data = computed(() => this.routeData() as PlaceholderRouteData);
}
