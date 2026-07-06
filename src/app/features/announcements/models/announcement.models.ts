export type AnnouncementType =
  | 'COMPANY_UPDATE'
  | 'POLICY_COMPLIANCE'
  | 'HR_BENEFITS'
  | 'SYSTEM_IT'
  | 'EVENT_TRAINING'
  | 'URGENT_ALERT';

export type AnnouncementPriority = 'CRITICAL' | 'IMPORTANT' | 'INFORMATIONAL';

export type AnnouncementStatus = 'DRAFT' | 'PENDING_REVIEW' | 'SCHEDULED' | 'LIVE' | 'ARCHIVED';

export interface Announcement {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly body: string;
  readonly type: AnnouncementType;
  readonly priority: AnnouncementPriority;
  readonly status: AnnouncementStatus;
  readonly publishAt: string | null;
  readonly expireAt: string | null;
  readonly showInBanner: boolean;
  readonly showInNotificationCenter: boolean;
  readonly acknowledgementRequired: boolean;
  readonly createdBy: string;
  readonly lastEditedBy: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly readCount: number;
  readonly totalAudience: number;
}

export interface Audience {
  readonly id: string;
  readonly announcementId: string;
  readonly departmentIds: readonly string[];
  readonly roleIds: readonly string[];
  readonly locationIds: readonly string[];
  readonly userGroupIds: readonly string[];
}

export type AudienceSelection = Omit<Audience, 'id' | 'announcementId'>;

export interface UserAnnouncementStatus {
  readonly id: string;
  readonly userId: string;
  readonly announcementId: string;
  readonly readAt: string | null;
  readonly dismissedAt: string | null;
  readonly acknowledgedAt: string | null;
  readonly doNotShowAgain: boolean;
}

export interface AnnouncementVersionSnapshot {
  readonly title: string;
  readonly summary: string;
  readonly body: string;
  readonly type: AnnouncementType;
  readonly priority: AnnouncementPriority;
  readonly status: AnnouncementStatus;
}

export interface VersionHistory {
  readonly id: string;
  readonly announcementId: string;
  readonly editedBy: string;
  readonly editedAt: string;
  readonly previousContent: AnnouncementVersionSnapshot;
  readonly changeNote: string;
}

export interface AdminDashboardSummary {
  readonly total: number;
  readonly draft: number;
  readonly pendingReview: number;
  readonly scheduled: number;
  readonly live: number;
  readonly archived: number;
  readonly acknowledgementRequired: number;
}

export interface AnnouncementFilters {
  readonly searchTerm?: string;
  readonly statuses?: readonly AnnouncementStatus[];
  readonly priorities?: readonly AnnouncementPriority[];
  readonly types?: readonly AnnouncementType[];
}

export type CreateAnnouncementInput = Omit<
  Announcement,
  'id' | 'createdAt' | 'updatedAt' | 'readCount' | 'totalAudience'
>;

export type UpdateAnnouncementInput = Partial<
  Omit<Announcement, 'id' | 'createdAt' | 'createdBy' | 'readCount' | 'totalAudience'>
>;
