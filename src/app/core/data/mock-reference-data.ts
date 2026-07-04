import { MockUser, ReferenceOption } from '../models/reference-data.models';

export const MOCK_DEPARTMENTS: readonly ReferenceOption[] = [
  { id: 'dept-all', name: 'All Departments' },
  { id: 'dept-finance', name: 'Finance' },
  { id: 'dept-hr', name: 'Human Resources' },
  { id: 'dept-it', name: 'Information Technology' },
  { id: 'dept-legal', name: 'Legal and Compliance' },
  { id: 'dept-operations', name: 'Operations' },
];

export const MOCK_ROLES: readonly ReferenceOption[] = [
  { id: 'role-employee', name: 'Employee' },
  { id: 'role-manager', name: 'Manager' },
  { id: 'role-director', name: 'Director' },
  { id: 'role-contractor', name: 'Contractor' },
];

export const MOCK_LOCATIONS: readonly ReferenceOption[] = [
  { id: 'loc-boston', name: 'Boston' },
  { id: 'loc-chicago', name: 'Chicago' },
  { id: 'loc-dallas', name: 'Dallas' },
  { id: 'loc-remote', name: 'Remote' },
];

export const MOCK_USER_GROUPS: readonly ReferenceOption[] = [
  { id: 'group-all-staff', name: 'All Staff' },
  { id: 'group-people-leaders', name: 'People Leaders' },
  { id: 'group-new-hires', name: 'New Hires' },
  { id: 'group-system-owners', name: 'System Owners' },
];

export const MOCK_USERS: readonly MockUser[] = [
  {
    id: 'usr-1001',
    displayName: 'Jordan Lee',
    departmentId: 'dept-finance',
    roleId: 'role-manager',
    locationId: 'loc-boston',
    userGroupIds: ['group-all-staff', 'group-people-leaders'],
  },
  {
    id: 'usr-1002',
    displayName: 'Priya Shah',
    departmentId: 'dept-it',
    roleId: 'role-employee',
    locationId: 'loc-remote',
    userGroupIds: ['group-all-staff', 'group-system-owners'],
  },
  {
    id: 'usr-1003',
    displayName: 'Marcus Green',
    departmentId: 'dept-operations',
    roleId: 'role-employee',
    locationId: 'loc-chicago',
    userGroupIds: ['group-all-staff', 'group-new-hires'],
  },
];
