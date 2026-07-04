import {
  Announcement,
  Audience,
  UserAnnouncementStatus,
  VersionHistory,
} from '../../features/announcements/models/announcement.models';

const isoDaysFromNow = (days: number, hour = 14): string => {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

export const MOCK_ANNOUNCEMENTS: readonly Announcement[] = [
  {
    id: 'ann-1001',
    title: 'Severe weather office closure',
    summary: 'The Boston office will remain closed tomorrow; remote operations remain available.',
    body: 'Employees assigned to Boston should work remotely where possible and coordinate coverage with their manager. Building access updates will be shared through this portal.',
    type: 'URGENT_ALERT', priority: 'CRITICAL', status: 'LIVE',
    publishAt: isoDaysFromNow(-1), expireAt: isoDaysFromNow(2),
    showInBanner: true, showInNotificationCenter: true, acknowledgementRequired: true,
    createdBy: 'usr-1002', lastEditedBy: 'usr-1002', createdAt: isoDaysFromNow(-3), updatedAt: isoDaysFromNow(-1),
    readCount: 184, totalAudience: 240,
  },
  {
    id: 'ann-1002',
    title: 'Information security policy acknowledgement',
    summary: 'Review and acknowledge the updated information security policy by the stated deadline.',
    body: 'The annual policy update clarifies acceptable use, data handling, and incident reporting expectations. Employees must review the policy and record acknowledgement.',
    type: 'POLICY_COMPLIANCE', priority: 'IMPORTANT', status: 'LIVE',
    publishAt: isoDaysFromNow(-7), expireAt: isoDaysFromNow(21),
    showInBanner: false, showInNotificationCenter: true, acknowledgementRequired: true,
    createdBy: 'usr-1002', lastEditedBy: 'usr-1001', createdAt: isoDaysFromNow(-12), updatedAt: isoDaysFromNow(-7),
    readCount: 412, totalAudience: 650,
  },
  {
    id: 'ann-1003',
    title: 'Benefits enrollment reminder',
    summary: 'Annual benefits enrollment closes at 5:00 PM next Friday.',
    body: 'Review available medical, dental, vision, and savings plan options before the enrollment window closes. Existing elections will carry forward where permitted.',
    type: 'HR_BENEFITS', priority: 'IMPORTANT', status: 'SCHEDULED',
    publishAt: isoDaysFromNow(3), expireAt: isoDaysFromNow(17),
    showInBanner: false, showInNotificationCenter: true, acknowledgementRequired: false,
    createdBy: 'usr-1001', lastEditedBy: 'usr-1001', createdAt: isoDaysFromNow(-5), updatedAt: isoDaysFromNow(-1),
    readCount: 0, totalAudience: 650,
  },
  {
    id: 'ann-1004',
    title: 'Scheduled finance platform maintenance',
    summary: 'The expense and purchasing platform will be unavailable during Saturday maintenance.',
    body: 'Submit time-sensitive expense and purchasing requests before the maintenance window. Service is expected to resume Sunday morning.',
    type: 'SYSTEM_IT', priority: 'INFORMATIONAL', status: 'LIVE',
    publishAt: isoDaysFromNow(-2), expireAt: isoDaysFromNow(5),
    showInBanner: false, showInNotificationCenter: true, acknowledgementRequired: false,
    createdBy: 'usr-1002', lastEditedBy: 'usr-1002', createdAt: isoDaysFromNow(-8), updatedAt: isoDaysFromNow(-2),
    readCount: 96, totalAudience: 160,
  },
  {
    id: 'ann-1005',
    title: 'Manager training: effective performance conversations',
    summary: 'Registration is open for the next manager development session.',
    body: 'The session covers preparation, equitable feedback, documentation, and follow-up practices for productive performance conversations.',
    type: 'EVENT_TRAINING', priority: 'INFORMATIONAL', status: 'PENDING_REVIEW',
    publishAt: null, expireAt: null,
    showInBanner: false, showInNotificationCenter: true, acknowledgementRequired: false,
    createdBy: 'usr-1001', lastEditedBy: 'usr-1001', createdAt: isoDaysFromNow(-2), updatedAt: isoDaysFromNow(-1),
    readCount: 0, totalAudience: 84,
  },
  {
    id: 'ann-1006',
    title: 'Updated hybrid work guidance',
    summary: 'Draft guidance clarifies team scheduling and workspace reservation expectations.',
    body: 'The proposed update establishes shared planning expectations while allowing business units to document role-specific operating needs.',
    type: 'HR_BENEFITS', priority: 'INFORMATIONAL', status: 'DRAFT',
    publishAt: null, expireAt: null,
    showInBanner: false, showInNotificationCenter: false, acknowledgementRequired: false,
    createdBy: 'usr-1001', lastEditedBy: 'usr-1001', createdAt: isoDaysFromNow(-1), updatedAt: isoDaysFromNow(-1),
    readCount: 0, totalAudience: 650,
  },
  {
    id: 'ann-1007',
    title: 'Quarter-end purchasing process update',
    summary: 'Finance has updated submission cutoffs for quarter-end purchasing requests.',
    body: 'Requests requiring review should be submitted before the published cutoff. Complete cost center and approval information will help avoid processing delays.',
    type: 'COMPANY_UPDATE', priority: 'IMPORTANT', status: 'LIVE',
    publishAt: isoDaysFromNow(-4), expireAt: isoDaysFromNow(9),
    showInBanner: false, showInNotificationCenter: true, acknowledgementRequired: false,
    createdBy: 'usr-1001', lastEditedBy: 'usr-1001', createdAt: isoDaysFromNow(-9), updatedAt: isoDaysFromNow(-4),
    readCount: 71, totalAudience: 120,
  },
  {
    id: 'ann-1008',
    title: 'Security awareness learning module',
    summary: 'Complete the quarterly security awareness module by month end.',
    body: 'This short module reviews phishing indicators, secure document sharing, and the process for reporting suspicious activity.',
    type: 'EVENT_TRAINING', priority: 'IMPORTANT', status: 'LIVE',
    publishAt: isoDaysFromNow(-10), expireAt: isoDaysFromNow(20),
    showInBanner: false, showInNotificationCenter: true, acknowledgementRequired: false,
    createdBy: 'usr-1002', lastEditedBy: 'usr-1002', createdAt: isoDaysFromNow(-14), updatedAt: isoDaysFromNow(-10),
    readCount: 355, totalAudience: 650,
  },
  {
    id: 'ann-1009',
    title: 'New employee orientation schedule',
    summary: 'The upcoming orientation agenda includes benefits, security, and operations sessions.',
    body: 'New employees should review the session schedule and confirm required attendance with their manager before orientation day.',
    type: 'EVENT_TRAINING', priority: 'INFORMATIONAL', status: 'SCHEDULED',
    publishAt: isoDaysFromNow(5), expireAt: isoDaysFromNow(12),
    showInBanner: false, showInNotificationCenter: true, acknowledgementRequired: false,
    createdBy: 'usr-1001', lastEditedBy: 'usr-1003', createdAt: isoDaysFromNow(-3), updatedAt: isoDaysFromNow(-1),
    readCount: 0, totalAudience: 28,
  },
  {
    id: 'ann-1010',
    title: 'Prior quarter town hall recording',
    summary: 'The prior quarter town hall recording and presentation are now archived.',
    body: 'The archived communication remains available for reference and summarizes organizational priorities discussed during the prior quarter.',
    type: 'COMPANY_UPDATE', priority: 'INFORMATIONAL', status: 'ARCHIVED',
    publishAt: isoDaysFromNow(-90), expireAt: isoDaysFromNow(-30),
    showInBanner: false, showInNotificationCenter: false, acknowledgementRequired: false,
    createdBy: 'usr-1001', lastEditedBy: 'usr-1001', createdAt: isoDaysFromNow(-95), updatedAt: isoDaysFromNow(-30),
    readCount: 508, totalAudience: 620,
  },
];

const allAudience = (id: string, announcementId: string): Audience => ({
  id, announcementId, departmentIds: [], roleIds: [], locationIds: [], userGroupIds: [],
});

export const MOCK_AUDIENCES: readonly Audience[] = [
  { ...allAudience('aud-1001', 'ann-1001'), locationIds: ['loc-boston'] },
  allAudience('aud-1002', 'ann-1002'),
  allAudience('aud-1003', 'ann-1003'),
  { ...allAudience('aud-1004', 'ann-1004'), departmentIds: ['dept-finance', 'dept-operations'] },
  { ...allAudience('aud-1005', 'ann-1005'), roleIds: ['role-manager', 'role-director'] },
  allAudience('aud-1006', 'ann-1006'),
  { ...allAudience('aud-1007', 'ann-1007'), departmentIds: ['dept-finance', 'dept-legal'], roleIds: ['role-manager'], locationIds: ['loc-boston'] },
  allAudience('aud-1008', 'ann-1008'),
  { ...allAudience('aud-1009', 'ann-1009'), userGroupIds: ['group-new-hires'] },
  allAudience('aud-1010', 'ann-1010'),
];

export const MOCK_USER_ANNOUNCEMENT_STATUSES: readonly UserAnnouncementStatus[] = [
  { id: 'uas-1001', userId: 'usr-1001', announcementId: 'ann-1001', readAt: isoDaysFromNow(-1), dismissedAt: null, acknowledgedAt: null, doNotShowAgain: false },
  { id: 'uas-1002', userId: 'usr-1001', announcementId: 'ann-1002', readAt: isoDaysFromNow(-5), dismissedAt: null, acknowledgedAt: isoDaysFromNow(-4), doNotShowAgain: false },
  { id: 'uas-1003', userId: 'usr-1002', announcementId: 'ann-1004', readAt: isoDaysFromNow(-1), dismissedAt: isoDaysFromNow(-1), acknowledgedAt: null, doNotShowAgain: true },
  { id: 'uas-1004', userId: 'usr-1003', announcementId: 'ann-1008', readAt: null, dismissedAt: null, acknowledgedAt: null, doNotShowAgain: false },
];

export const MOCK_VERSION_HISTORY: readonly VersionHistory[] = [
  {
    id: 'ver-1001', announcementId: 'ann-1001', editedBy: 'usr-1002', editedAt: isoDaysFromNow(-1),
    previousContent: { title: 'Weather operations update', summary: 'Boston operations may be affected by severe weather.', body: 'Teams should monitor local conditions and prepare for remote operations.', type: 'URGENT_ALERT', priority: 'IMPORTANT', status: 'PENDING_REVIEW' },
    changeNote: 'Confirmed office closure, elevated priority, and prepared the employee banner.',
  },
  {
    id: 'ver-1002', announcementId: 'ann-1002', editedBy: 'usr-1001', editedAt: isoDaysFromNow(-7),
    previousContent: { title: 'Annual information security policy', summary: 'The updated policy is ready for employee review.', body: 'Employees should review the annual policy update.', type: 'POLICY_COMPLIANCE', priority: 'INFORMATIONAL', status: 'SCHEDULED' },
    changeNote: 'Added the acknowledgement requirement and clarified the employee deadline.',
  },
  {
    id: 'ver-1003', announcementId: 'ann-1002', editedBy: 'usr-1002', editedAt: isoDaysFromNow(-9),
    previousContent: { title: 'Information security policy update', summary: 'Policy content is being prepared for annual review.', body: 'Draft policy communication.', type: 'POLICY_COMPLIANCE', priority: 'INFORMATIONAL', status: 'DRAFT' },
    changeNote: 'Prepared the announcement for compliance review.',
  },
];
