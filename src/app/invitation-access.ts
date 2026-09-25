export interface CustomerInvitation {
  themeSlug: string;
  customerSlug: string;
  coupleName: string;
  brideFullName?: string;
  groomFullName?: string;
  expiresAt: string;
}

export const CUSTOMER_INVITATIONS: readonly CustomerInvitation[] = [
  {
    themeSlug: 'mawar-andalusia',
    customerSlug: 'andiani-putra',
    coupleName: 'Andiani & Putra',
    brideFullName: 'Andiani',
    groomFullName: 'Putra',
    expiresAt: '2026-08-30T23:59:59+07:00',
  },
  {
    themeSlug: 'mawar-andalusia',
    customerSlug: 'dinda-arga',
    coupleName: 'Dinda & Arga',
    brideFullName: 'Dinda Larasati',
    groomFullName: 'Arga Pratama',
    expiresAt: '2026-08-22T23:59:59+07:00',
  },
];

export function findCustomerInvitation(
  themeSlug: string | null,
  customerSlug: string | null,
): CustomerInvitation | undefined {
  return CUSTOMER_INVITATIONS.find(
    (invitation) => invitation.themeSlug === themeSlug && invitation.customerSlug === customerSlug,
  );
}
