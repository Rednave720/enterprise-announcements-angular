import { TestBed } from '@angular/core/testing';
import { MockUser } from '../../../core/models/reference-data.models';
import { Audience } from '../models/announcement.models';
import { AudienceService } from './audience.service';

describe('AudienceService', () => {
  let service: AudienceService;
  const user: MockUser = {
    id: 'user-test',
    displayName: 'Test User',
    departmentId: 'dept-finance',
    roleId: 'role-manager',
    locationId: 'loc-boston',
    userGroupIds: ['group-all-staff', 'group-people-leaders'],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudienceService);
  });

  it('treats empty dimensions as all employees', () => {
    const audience: Audience = {
      id: 'aud-test', announcementId: 'ann-test',
      departmentIds: [], roleIds: [], locationIds: [], userGroupIds: [],
    };

    expect(service.matchesUser(audience, user)).toBe(true);
  });

  it('uses OR within a dimension and AND across dimensions', () => {
    const matchingAudience: Audience = {
      id: 'aud-match', announcementId: 'ann-match',
      departmentIds: ['dept-finance', 'dept-legal'],
      roleIds: ['role-manager'],
      locationIds: ['loc-boston'],
      userGroupIds: [],
    };
    const wrongLocation = { ...matchingAudience, locationIds: ['loc-chicago'] };

    expect(service.matchesUser(matchingAudience, user)).toBe(true);
    expect(service.matchesUser(wrongLocation, user)).toBe(false);
  });
});
