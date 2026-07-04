import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  MOCK_DEPARTMENTS,
  MOCK_LOCATIONS,
  MOCK_ROLES,
  MOCK_USER_GROUPS,
} from '../data/mock-reference-data';
import { ReferenceOption } from '../models/reference-data.models';

@Injectable({ providedIn: 'root' })
export class ReferenceDataService {
  getDepartments(): Observable<readonly ReferenceOption[]> {
    return of(MOCK_DEPARTMENTS);
  }

  getRoles(): Observable<readonly ReferenceOption[]> {
    return of(MOCK_ROLES);
  }

  getLocations(): Observable<readonly ReferenceOption[]> {
    return of(MOCK_LOCATIONS);
  }

  getUserGroups(): Observable<readonly ReferenceOption[]> {
    return of(MOCK_USER_GROUPS);
  }
}
