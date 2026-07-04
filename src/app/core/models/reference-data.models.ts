export interface ReferenceOption {
  readonly id: string;
  readonly name: string;
}

export interface MockUser {
  readonly id: string;
  readonly displayName: string;
  readonly departmentId: string;
  readonly roleId: string;
  readonly locationId: string;
  readonly userGroupIds: readonly string[];
}
