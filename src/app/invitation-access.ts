export interface ParentInfo {
  description: string;
  father: string;
  mother: string;
}

export interface EventLocation {
  venue: string;
  address: string;
  mapsUrl?: string;
  qrImage?: string;
}

export interface EventInfo {
  date: string; // YYYY-MM-DD
  hijriDate?: string; // Tanggal Hijriah sesuai kalender yang dipakai keluarga
  akadTime: string; // HH:mm, WIB
  walimahTime: string; // HH:mm, WIB
  akadLocation?: EventLocation;
  walimahLocation?: EventLocation;
}

export interface StoryDates {
  taaruf?: string;
  nazhor?: string;
  istikharah?: string;
  khitbah?: string;
}

export interface InvitationStoryMoment {
  title: string;
  date: string;
  description: string;
}

export const PREVIEW_STORY_DATES: StoryDates = {
  taaruf: 'Januari 2025',
  nazhor: 'Maret 2025',
  istikharah: 'Juni 2025',
  khitbah: 'Desember 2025',
};

const PREVIEW_LOCATION: EventLocation = {
  venue: 'Gedung Serbaguna Bahagia',
  address: 'Jl. Contoh Bahagia No. 20, Jakarta',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Gedung%20Serbaguna%20Bahagia%2C%20Jl.%20Contoh%20Bahagia%20No.%2020%2C%20Jakarta',
  qrImage: '/assets/qr-lokasi-undangan.png',
};

export const PREVIEW_EVENT: EventInfo = {
  date: '2026-10-20',
  akadTime: '10:00',
  walimahTime: '13:00',
  akadLocation: PREVIEW_LOCATION,
  walimahLocation: PREVIEW_LOCATION,
};

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
  groomFirst?: boolean;
  fixedThemeOutfit?: boolean;
  brideFullName?: string;
  groomFullName?: string;
  brideParents?: ParentInfo;
  groomParents?: ParentInfo;
  event?: EventInfo;
  storyDates?: StoryDates;
  storyMoments?: readonly InvitationStoryMoment[];
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
    themeSlug: 'kebun-senja',
    customerSlug: 'reza-fitri',
    coupleName: 'Reza & Fitri',
    groomFirst: true,
    fixedThemeOutfit: true,
    brideFullName: 'Adriani Safitri, S.Pd.',
    groomFullName: 'Reza Putra Fadilah, S.Kom.',
    brideParents: {
      description: 'Putri dari',
      father: 'Bpk. Aulia Umar (rahimahullah)',
      mother: 'Ibu Ike Kusmawati',
    },
    groomParents: {
      description: 'Putra dari',
      father: 'Bpk. Nursalim',
      mother: 'Ibu Atun Qonatun',
    },
    event: {
      date: '2026-11-08',
      hijriDate: '28 Jumadilawal 1448 H',
      akadTime: '10:00',
      walimahTime: '11:00',
      // QR dibuat otomatis dari lokasi. Isi qrImage hanya jika memakai gambar QR sendiri.
      akadLocation: {
        venue: 'Kediaman Keluarga Pihak Wanita',
        address: 'Gg. Flamboyan No.12, RT.1/RW.9, Bintaro, Kec. Pesanggrahan, Kota Jakarta Selatan',
        mapsUrl: 'Gg. Flamboyan No.12, RT.1/RW.9, Bintaro, Kec. Pesanggrahan, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12330',
        qrImage: '',
      },
      walimahLocation: {
        venue: 'Kediaman Keluarga Pihak Wanita',
        address: 'Gg. Flamboyan No.12, RT.1/RW.9, Bintaro, Kec. Pesanggrahan, Kota Jakarta Selatan',
        mapsUrl: 'Gg. Flamboyan No.12, RT.1/RW.9, Bintaro, Kec. Pesanggrahan, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12330',
        qrImage: '',
      },
    },
    storyMoments: [
      {
        date: 'Mei 2026',
        title: 'Ta’aruf',
        description: 'Berawal dari sebuah perkenalan melalui web ta’aruf, kami melakukan tanya jawab untuk menyelaraskan prinsip hidup dan visi misi dalam pernikahan. Dengan niat baik dan keyakinan untuk melangkah lebih jauh, kami memutuskan untuk melanjutkan ke tahap nazhor, sebagai ikhtiar awal menuju ridha-Nya.',
      },
      {
        date: 'Juni 2026',
        title: 'Nazhor',
        description: 'Pertemuan pertama kami bertatap muka untuk pertama kalinya dalam penjagaan. Percakapan yang lebih dalam dan hati yang perlahan menimbang. Bukan sekadar rupa, melainkan mengenal arah dan tujuan yang hendak dituju bersama.',
      },
      {
        date: 'Oktober 2026',
        title: 'Khitbah',
        description: 'Dalam kesederhanaan rumah, dihangatkan oleh doa dan kehadiran keluarga, sebuah niat baik disampaikan. Menjadi langkah yang kian dekat menuju ikatan suci, dengan restu keluarga dan harapan akan ridha-Nya.',
      },
      {
        date: 'November 2026',
        title: 'Akad Nikah',
        description: 'Bismillah, semoga Allah mudahkan. Ikrar janji suci penyatuan dua insan itu terucap. Dalam kesederhanaan namun penuh makna, kami merayakan karunia terindah ini dengan penuh syukur, mengawali perjalanan bersama dalam cinta, doa, dan ridha-Nya. Semoga Allah Ta’ala menurunkan pertolongan-Nya dalam setiap kondisi bahtera rumah tangga kami. Aamiin.',
      },
    ],
    expiresAt: '2026-11-08T23:59:59+07:00',
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
