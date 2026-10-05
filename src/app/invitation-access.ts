export interface ParentInfo {
  description: string;
  father: string;
  mother: string;
}

export const PREVIEW_PARENTS: { bride: ParentInfo; groom: ParentInfo } = {
  bride: {
    description: 'Putri pertama dari',
    father: 'Bapak Ahmad',
    mother: 'Ibu Siti',
  },
  groom: {
    description: 'Putra kedua dari',
    father: 'Bapak Budi',
    mother: 'Ibu Ratna',
  },
};

export interface CustomerInvitation {
  themeSlug: string;
  customerSlug: string;
  coupleName: string;
  brideFullName?: string;
  groomFullName?: string;
  brideParents?: ParentInfo;
  groomParents?: ParentInfo;
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
  {
    themeSlug: 'ranah-minang',
    customerSlug: 'Reza-Fitri',
    coupleName: 'Fitri & Reza',
    brideFullName: 'Andriani Safitri',
    groomFullName: 'Reza Putra Fadilah',
    brideParents: {
      description: 'Putri dari',
      father: 'Aulia Umar',
      mother: 'Ike Kusmawati',
    },
    groomParents: {
      description: 'Putra dari',
      father: 'Nursalim',
      mother: 'Atun Qonatun',
    },
    expiresAt: '2026-10-30T23:59:59+07:00',
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
