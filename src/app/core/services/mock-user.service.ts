import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MOCK_USERS } from '../data/mock-reference-data';
import { MockUser } from '../models/reference-data.models';

@Injectable({ providedIn: 'root' })
export class MockUserService {
  private readonly currentUserSubject = new BehaviorSubject<MockUser>(MOCK_USERS[0]);

  readonly currentUser$ = this.currentUserSubject.asObservable();

  getUsers(): Observable<readonly MockUser[]> {
    return of(MOCK_USERS);
  }

  getCurrentMockUser(): MockUser {
    return this.currentUserSubject.value;
  }

  getUserById(userId: string): MockUser | undefined {
    return MOCK_USERS.find((user) => user.id === userId);
  }

  switchMockUser(userId: string): void {
    const user = this.getUserById(userId);
    if (!user) {
      throw new Error(`Mock user ${userId} was not found.`);
    }
    this.currentUserSubject.next(user);
  }
}
