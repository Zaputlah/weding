import { Component, HostListener, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { findCustomerInvitation } from '../invitation-access';

type ThemeId =
  | 'emerald'
  | 'maroon'
  | 'midnight'
  | 'mocha'
  | 'ivory'
  | 'javanese'
  | 'boho'
  | 'watercolor'
  | 'mihrab'
  | 'terracotta'
  | 'pearl'
  | 'indigo'
  | 'sundanese'
  | 'minangkabau'
  | 'dayak'
  | 'balinese'
  | 'bugis'
  | 'betawi';

interface InvitationTheme {
  id: ThemeId;
  slug: string;
  name: string;
  concept: string;
  deep: string;
  dark: string;
  primary: string;
  secondary: string;
  accentDark: string;
  accent: string;
  cream: string;
  paper: string;
  border: string;
  muted: string;
  copy: string;
  soft: string;
  mist: string;
  scrapbookAsset?: string;
}

interface StoryMoment {
  step: string;
  title: string;
  date: string;
  description: string;
}

interface GalleryItem {
  src: string;
  alternate: string;
  alt: string;
  caption: string;
}

interface JourneyScene {
  base: string;
  alternate: string;
  alt: string;
  description: string;
}

interface OutfitThemePalette {
  label: string;
  hueRotation: number;
  saturation: number;
  brightness: number;
}

interface ThemeExperience {
  storyLabel: string;
  storyCardClipPath: string;
  storyCardWidth: string;
  storyCardMinHeight: string;
  storyTextAlign: 'left' | 'center' | 'right';
  storyMarkerClipPath: string;
  galleryLabel: string;
  galleryColumns: string;
  galleryGap: string;
  galleryTextAlign: 'left' | 'center' | 'right';
  galleryCardClipPaths: readonly string[];
  galleryCardHeights: readonly string[];
  coupleStageClipPath: string;
  couplePortraitClipPaths: readonly [string, string];
  coupleJoinedClipPath: string;
  journeyLabel: string;
  journeyFrameClipPath: string;
  journeyImageClipPath: string;
  eventColumns: string;
  eventCardClipPaths: readonly [string, string];
  closingLabel: string;
  closingClipPath: string;
  closingWidth: string;
  closingTextAlign: 'left' | 'center' | 'right';
  closingPadding: string;
}

interface SurpriseParticle {
  x: number;
  y: number;
  delay: number;
  rotate: number;
  symbol: string;
}

interface FallingFlower {
  left: number;
  delay: number;
  duration: number;
  drift: number;
  rotation: number;
  size: number;
  symbol: string;
}

@Component({
  selector: 'app-invitation',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './invitation.html',
  host: {
    '[style.--theme-deep]': 'activeTheme().deep',
    '[style.--theme-dark]': 'activeTheme().dark',
    '[style.--theme-primary]': 'activeTheme().primary',
    '[style.--theme-secondary]': 'activeTheme().secondary',
    '[style.--theme-accent-dark]': 'activeTheme().accentDark',
    '[style.--theme-accent]': 'activeTheme().accent',
    '[style.--theme-cream]': 'activeTheme().cream',
    '[style.--theme-paper]': 'activeTheme().paper',
    '[style.--theme-border]': 'activeTheme().border',
    '[style.--theme-muted]': 'activeTheme().muted',
    '[style.--theme-copy]': 'activeTheme().copy',
    '[style.--theme-soft]': 'activeTheme().soft',
    '[style.--theme-mist]': 'activeTheme().mist',
  },
})
export class Invitation implements OnInit, OnDestroy {
  private readonly title = inject(Title);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly inactivityDurationMs = 60 * 1000;
  private readonly openedAtStorageKey = 'undangan-opened-at';
  private readonly guestNameStorageKey = 'undangan-guest-name';
  private readonly themeStorageKey = 'undangan-theme';
  private timer?: ReturnType<typeof setInterval>;
  private inactivityTimer?: ReturnType<typeof setTimeout>;
  private lastActivityRecordedAt = 0;
  private revealTimer?: ReturnType<typeof setTimeout>;
  private openingTimer?: ReturnType<typeof setTimeout>;
  private envelopeLetterReleaseTimer?: ReturnType<typeof setTimeout>;
  private starTimer?: ReturnType<typeof setTimeout>;
  private surpriseStartTimer?: ReturnType<typeof setTimeout>;
  private surpriseEndTimer?: ReturnType<typeof setTimeout>;
  private surpriseRemoveTimer?: ReturnType<typeof setTimeout>;
  private surpriseFrame?: number;
  private flowerRainStartTimer?: ReturnType<typeof setTimeout>;
  private flowerRainRemoveTimer?: ReturnType<typeof setTimeout>;
  private flowerRainFrame?: number;
  private envelopeEntranceFrame?: number;
  private envelopeEntranceStartFrame?: number;
  private scrollAnimationFrame?: number;
  private themeRouteSubscription?: Subscription;
  readonly guestName = signal('Tamu Undangan');
  readonly brideName = signal('Fulanah');
  readonly groomName = signal('Fulan');
  readonly brideFullName = signal('Fulanah binti Fulan');
  readonly groomFullName = signal('Fulan bin Fulan');
  readonly coupleName = computed(() => `${this.brideName()} & ${this.groomName()}`);
  readonly coupleInitials = computed(
    () => `${this.brideName().charAt(0).toUpperCase()}&${this.groomName().charAt(0).toUpperCase()}`,
  );
  readonly nameError = signal('');
  readonly isOpen = signal(false);
  readonly isOpening = signal(false);
  readonly isCoverHidden = signal(false);
  readonly isEnvelopeBackVisible = signal(false);
  readonly isEnvelopeReady = signal(false);
  readonly isEnvelopeLetterReleased = signal(false);
  readonly isSurpriseRendered = signal(false);
  readonly isSurpriseActive = signal(false);
  readonly isFlowerRainRendered = signal(false);
  readonly isFlowerRainFalling = signal(false);
  readonly activeMobileSection = signal('home-section');
  readonly selectedGalleryItem = signal<GalleryItem | null>(null);
  readonly themes: readonly InvitationTheme[] = [
    {
      id: 'emerald',
      slug: 'klasik-zamrud',
      name: 'Klasik Zamrud',
      concept: 'Geometris elegan',
      deep: '#183128',
      dark: '#28493b',
      primary: '#315c4a',
      secondary: '#3e6856',
      accentDark: '#b8924d',
      accent: '#d8b66f',
      cream: '#f5e6c5',
      paper: '#fffdf8',
      border: '#ddcfb3',
      muted: '#6d746d',
      copy: '#526158',
      soft: '#f8f3e9',
      mist: '#e9eee8',
    },
    {
      id: 'maroon',
      slug: 'mawar-andalusia',
      name: 'Mawar Andalusia',
      concept: 'Floral romantis',
      deep: '#35171d',
      dark: '#55252f',
      primary: '#6f3542',
      secondary: '#824956',
      accentDark: '#b78652',
      accent: '#d9b778',
      cream: '#f6e5cf',
      paper: '#fffaf5',
      border: '#dfcbb8',
      muted: '#766b6d',
      copy: '#68555a',
      soft: '#fbf1ed',
      mist: '#f2e6e5',
    },
    {
      id: 'midnight',
      slug: 'langit-qamar',
      name: 'Langit Qamar',
      concept: 'Celestial Islami',
      deep: '#111f33',
      dark: '#1d3553',
      primary: '#294a6c',
      secondary: '#3b5e7e',
      accentDark: '#ad8748',
      accent: '#d6b873',
      cream: '#f2e7cd',
      paper: '#fbfaf6',
      border: '#d9cfba',
      muted: '#68717c',
      copy: '#526173',
      soft: '#f2f4f7',
      mist: '#e6ecf2',
    },
    {
      id: 'mocha',
      slug: 'kebun-senja',
      name: 'Kebun Senja',
      concept: 'Rustic botanikal',
      deep: '#2d251f',
      dark: '#493b31',
      primary: '#625142',
      secondary: '#786553',
      accentDark: '#aa783f',
      accent: '#d0a660',
      cream: '#f2e3c8',
      paper: '#fffaf0',
      border: '#ddcbb0',
      muted: '#766e64',
      copy: '#655b50',
      soft: '#f7f0e6',
      mist: '#eee7dd',
    },
    {
      id: 'ivory',
      slug: 'ivory-editorial',
      name: 'Ivory Editorial',
      concept: 'Minimalis modern',
      deep: '#2d2a27',
      dark: '#514a43',
      primary: '#766d63',
      secondary: '#a69b8d',
      accentDark: '#92734e',
      accent: '#c8a96d',
      cream: '#f8f3ea',
      paper: '#fffdfa',
      border: '#d8d0c4',
      muted: '#77716a',
      copy: '#5d5751',
      soft: '#f5f2ed',
      mist: '#ece8e1',
    },
    {
      id: 'javanese',
      slug: 'pusaka-jawa',
      name: 'Pusaka Jawa',
      concept: 'Tradisional klasik',
      deep: '#2b1712',
      dark: '#4b261b',
      primary: '#70442d',
      secondary: '#956b45',
      accentDark: '#b88936',
      accent: '#d9b45d',
      cream: '#f2dfb5',
      paper: '#fff9eb',
      border: '#ddc58f',
      muted: '#786a5d',
      copy: '#695346',
      soft: '#f6edda',
      mist: '#eadcc4',
    },
    {
      id: 'boho',
      slug: 'dark-boho',
      name: 'Dark Boho',
      concept: 'Moody kontemporer',
      deep: '#10100f',
      dark: '#20211f',
      primary: '#343733',
      secondary: '#4b504a',
      accentDark: '#987a45',
      accent: '#c4a262',
      cream: '#e8dfcc',
      paper: '#f8f3e8',
      border: '#c9bda6',
      muted: '#716e68',
      copy: '#5d5c56',
      soft: '#ebe8e0',
      mist: '#d9dcd5',
    },
    {
      id: 'watercolor',
      slug: 'chateau-watercolor',
      name: 'Château Watercolor',
      concept: 'Lukisan taman klasik',
      deep: '#32464a',
      dark: '#4d686a',
      primary: '#829a96',
      secondary: '#aebdb4',
      accentDark: '#b47c72',
      accent: '#d7a99e',
      cream: '#f7eee5',
      paper: '#fffaf5',
      border: '#ddcbc4',
      muted: '#777071',
      copy: '#626f6d',
      soft: '#f4eee9',
      mist: '#e8efed',
    },
    {
      id: 'mihrab',
      slug: 'mihrab-sage',
      name: 'Mihrab Sage',
      concept: 'Arsitektur Islami',
      deep: '#183b35',
      dark: '#28534a',
      primary: '#53776c',
      secondary: '#7f9b8f',
      accentDark: '#9c7b45',
      accent: '#d1b878',
      cream: '#f3e8cc',
      paper: '#fffdf7',
      border: '#d9d1bd',
      muted: '#6f7b74',
      copy: '#52665d',
      soft: '#f2f5ef',
      mist: '#e5eee9',
    },
    {
      id: 'terracotta',
      slug: 'surat-terracotta',
      name: 'Surat Terracotta',
      concept: 'Handmade hangat',
      deep: '#40251f',
      dark: '#654036',
      primary: '#956453',
      secondary: '#ba8770',
      accentDark: '#9b713c',
      accent: '#d6aa69',
      cream: '#f4e1c5',
      paper: '#fff9ef',
      border: '#ddc6aa',
      muted: '#7d6e64',
      copy: '#6c584e',
      soft: '#f8eee5',
      mist: '#f0dfd5',
    },
    {
      id: 'pearl',
      slug: 'mutiara-nikah',
      name: 'Mutiara Nikah',
      concept: 'Elegan lembut',
      deep: '#303c45',
      dark: '#4c5b64',
      primary: '#7c8b91',
      secondary: '#aeb8b9',
      accentDark: '#aa8955',
      accent: '#dbc08c',
      cream: '#f6ead4',
      paper: '#fffefa',
      border: '#d8d6ce',
      muted: '#72797b',
      copy: '#5e696d',
      soft: '#f4f5f2',
      mist: '#e9eded',
    },
    {
      id: 'indigo',
      slug: 'naskah-nusantara',
      name: 'Naskah Nusantara',
      concept: 'Nusantara Islami',
      deep: '#18263a',
      dark: '#293e59',
      primary: '#405b78',
      secondary: '#68809a',
      accentDark: '#a8793f',
      accent: '#d5ad65',
      cream: '#f1dfbd',
      paper: '#fffaf0',
      border: '#d8c6a4',
      muted: '#6d7580',
      copy: '#596675',
      soft: '#f1f2f4',
      mist: '#e6eaf0',
    },
    {
      id: 'sundanese',
      slug: 'priangan-sunda',
      name: 'Priangan Sunda',
      concept: 'Sunda botanikal',
      deep: '#183b34',
      dark: '#2a574b',
      primary: '#557f6f',
      secondary: '#88a58e',
      accentDark: '#9a7133',
      accent: '#d8b66b',
      cream: '#f5e8c8',
      paper: '#fffdf5',
      border: '#d9c89f',
      muted: '#6d776f',
      copy: '#52675e',
      soft: '#f1f5eb',
      mist: '#e4eee7',
      scrapbookAsset: '/assets/scrapbook-priangan-sunda.svg',
    },
    {
      id: 'minangkabau',
      slug: 'ranah-minang',
      name: 'Ranah Minang',
      concept: 'Songket dan gonjong',
      deep: '#241719',
      dark: '#4a2025',
      primary: '#7e3035',
      secondary: '#a94c45',
      accentDark: '#a87722',
      accent: '#dfb84f',
      cream: '#f6e8c5',
      paper: '#fffaf0',
      border: '#ddc588',
      muted: '#786966',
      copy: '#6a5050',
      soft: '#faeee6',
      mist: '#f0dfd8',
      scrapbookAsset: '/assets/scrapbook-ranah-minang.svg',
    },
    {
      id: 'dayak',
      slug: 'rimba-dayak',
      name: 'Rimba Dayak',
      concept: 'Ukir Borneo',
      deep: '#172b27',
      dark: '#29453d',
      primary: '#496958',
      secondary: '#8b6a43',
      accentDark: '#a1642e',
      accent: '#dda85a',
      cream: '#f4e4c5',
      paper: '#fffaf0',
      border: '#d9c39c',
      muted: '#716e62',
      copy: '#59645d',
      soft: '#f1efe5',
      mist: '#e4ebe3',
      scrapbookAsset: '/assets/scrapbook-rimba-dayak.svg',
    },
    {
      id: 'balinese',
      slug: 'bali-agung',
      name: 'Bali Agung',
      concept: 'Gerbang dan ukiran Bali',
      deep: '#281b18',
      dark: '#4b3028',
      primary: '#795044',
      secondary: '#a87555',
      accentDark: '#a8742c',
      accent: '#dcb259',
      cream: '#f4e4c1',
      paper: '#fff9ed',
      border: '#dcc18b',
      muted: '#756a60',
      copy: '#66564d',
      soft: '#f7eee2',
      mist: '#ede0d3',
      scrapbookAsset: '/assets/scrapbook-bali-agung.svg',
    },
    {
      id: 'bugis',
      slug: 'pinisi-bugis',
      name: 'Pinisi Bugis',
      concept: 'Maritim Sulawesi',
      deep: '#102d3a',
      dark: '#17485b',
      primary: '#2f6b79',
      secondary: '#6c9794',
      accentDark: '#aa7735',
      accent: '#e0b765',
      cream: '#f3e8ce',
      paper: '#fffdf7',
      border: '#d5c9ad',
      muted: '#68777b',
      copy: '#506772',
      soft: '#eef5f3',
      mist: '#e0eceb',
      scrapbookAsset: '/assets/scrapbook-pinisi-bugis.svg',
    },
    {
      id: 'betawi',
      slug: 'kembang-betawi',
      name: 'Kembang Betawi',
      concept: 'Semarak Betawi',
      deep: '#173b3a',
      dark: '#215c58',
      primary: '#2f8176',
      secondary: '#c75e52',
      accentDark: '#ad7132',
      accent: '#e7b955',
      cream: '#f8e9ca',
      paper: '#fffaf1',
      border: '#dec89c',
      muted: '#6e7470',
      copy: '#516963',
      soft: '#eff5ef',
      mist: '#e3eee8',
      scrapbookAsset: '/assets/scrapbook-kembang-betawi.svg',
    },
  ];
  readonly activeThemeId = signal<ThemeId>('emerald');
  readonly activeTheme = computed(
    () => this.themes.find((theme) => theme.id === this.activeThemeId()) ?? this.themes[0],
  );
  readonly themeExperiences: Readonly<Record<ThemeId, ThemeExperience>> = {
    emerald: {
      storyLabel: 'Catatan Geometris',
      storyCardClipPath: 'polygon(5% 0,95% 0,100% 10%,100% 90%,95% 100%,5% 100%,0 90%,0 10%)',
      storyCardWidth: '44rem',
      storyCardMinHeight: '18rem',
      storyTextAlign: 'center',
      storyMarkerClipPath: 'polygon(50% 0,100% 50%,50% 100%,0 50%)',
      galleryLabel: 'Album Zamrud',
      galleryColumns: 'repeat(auto-fit,minmax(min(100%,13.5rem),1fr))',
      galleryGap: '1rem',
      galleryTextAlign: 'center',
      galleryCardClipPaths: ['polygon(6% 0,94% 0,100% 6%,100% 94%,94% 100%,6% 100%,0 94%,0 6%)', 'polygon(50% 0,100% 18%,100% 82%,50% 100%,0 82%,0 18%)'],
      galleryCardHeights: ['17rem', '20rem', '18.5rem'],
      coupleStageClipPath: 'polygon(8% 0,92% 0,100% 12%,100% 88%,92% 100%,8% 100%,0 88%,0 12%)',
      couplePortraitClipPaths: ['polygon(50% 0,95% 18%,100% 82%,50% 100%,0 82%,5% 18%)', 'polygon(50% 0,100% 20%,94% 84%,50% 100%,6% 84%,0 20%)'],
      coupleJoinedClipPath: 'polygon(50% 0,94% 16%,100% 84%,50% 100%,0 84%,6% 16%)',
      journeyLabel: 'Jejak Bersudut',
      journeyFrameClipPath: 'polygon(4% 0,96% 0,100% 8%,100% 92%,96% 100%,4% 100%,0 92%,0 8%)',
      journeyImageClipPath: 'polygon(3% 0,97% 0,100% 5%,100% 95%,97% 100%,3% 100%,0 95%,0 5%)',
      eventColumns: 'repeat(auto-fit,minmax(min(100%,18rem),1fr))',
      eventCardClipPaths: ['polygon(0 0,92% 0,100% 8%,100% 100%,8% 100%,0 92%)', 'polygon(8% 0,100% 0,100% 92%,92% 100%,0 100%,0 8%)'],
      closingLabel: 'Khatimah Zamrud',
      closingClipPath: 'polygon(5% 0,95% 0,100% 8%,100% 92%,95% 100%,5% 100%,0 92%,0 8%)',
      closingWidth: '58rem',
      closingTextAlign: 'center',
      closingPadding: 'clamp(2rem,6vw,5rem)',
    },
    maroon: {
      storyLabel: 'Herbarium Kisah',
      storyCardClipPath: 'inset(0 round 8rem 8rem 2rem 2rem)',
      storyCardWidth: '42rem',
      storyCardMinHeight: '19rem',
      storyTextAlign: 'center',
      storyMarkerClipPath: 'polygon(50% 0,61% 35%,100% 50%,61% 65%,50% 100%,39% 65%,0 50%,39% 35%)',
      galleryLabel: 'Taman Kenangan',
      galleryColumns: 'repeat(auto-fit,minmax(min(100%,12rem),1fr))',
      galleryGap: '1.35rem',
      galleryTextAlign: 'center',
      galleryCardClipPaths: ['inset(0 round 8rem 8rem 1.5rem 1.5rem)', 'inset(0 round 1.5rem 1.5rem 8rem 8rem)', 'ellipse(50% 48% at 50% 50%)'],
      galleryCardHeights: ['19rem', '22rem', '19rem'],
      coupleStageClipPath: 'inset(0 round 12rem 12rem 2rem 2rem)',
      couplePortraitClipPaths: ['inset(0 round 8rem 8rem 1.25rem 1.25rem)', 'inset(0 round 8rem 8rem 1.25rem 1.25rem)'],
      coupleJoinedClipPath: 'inset(0 round 12rem 12rem 2rem 2rem)',
      journeyLabel: 'Kelopak Perjalanan',
      journeyFrameClipPath: 'inset(0 round 14rem 14rem 2rem 2rem)',
      journeyImageClipPath: 'inset(0 round 12rem 12rem 1.5rem 1.5rem)',
      eventColumns: 'repeat(auto-fit,minmax(min(100%,17rem),1fr))',
      eventCardClipPaths: ['inset(0 round 9rem 9rem 2rem 2rem)', 'inset(0 round 2rem 2rem 9rem 9rem)'],
      closingLabel: 'Doa di Taman',
      closingClipPath: 'inset(0 round 14rem 14rem 3rem 3rem)',
      closingWidth: '62rem',
      closingTextAlign: 'center',
      closingPadding: 'clamp(2.25rem,7vw,6rem)',
    },
    midnight: {
      storyLabel: 'Orbit Kisah',
      storyCardClipPath: 'ellipse(68% 50% at 50% 50%)',
      storyCardWidth: '38rem',
      storyCardMinHeight: '21rem',
      storyTextAlign: 'center',
      storyMarkerClipPath: 'ellipse(44% 50% at 50% 50%)',
      galleryLabel: 'Konstelasi Kenangan',
      galleryColumns: 'repeat(auto-fit,minmax(min(100%,11.5rem),1fr))',
      galleryGap: '1.75rem',
      galleryTextAlign: 'right',
      galleryCardClipPaths: ['circle(49% at 50% 50%)', 'ellipse(47% 50% at 50% 50%)', 'polygon(50% 0,88% 18%,100% 58%,72% 100%,28% 100%,0 58%,12% 18%)'],
      galleryCardHeights: ['18rem', '21rem', '18rem'],
      coupleStageClipPath: 'ellipse(50% 48% at 50% 50%)',
      couplePortraitClipPaths: ['ellipse(48% 50% at 50% 50%)', 'ellipse(48% 50% at 50% 50%)'],
      coupleJoinedClipPath: 'ellipse(46% 50% at 50% 50%)',
      journeyLabel: 'Lintasan Qamar',
      journeyFrameClipPath: 'ellipse(50% 49% at 50% 50%)',
      journeyImageClipPath: 'ellipse(49% 48% at 50% 50%)',
      eventColumns: 'repeat(auto-fit,minmax(min(100%,16rem),1fr))',
      eventCardClipPaths: ['ellipse(50% 50% at 50% 50%)', 'polygon(50% 0,90% 18%,100% 62%,72% 100%,28% 100%,0 62%,10% 18%)'],
      closingLabel: 'Doa di Bawah Qamar',
      closingClipPath: 'ellipse(50% 49% at 50% 50%)',
      closingWidth: '60rem',
      closingTextAlign: 'center',
      closingPadding: 'clamp(3rem,9vw,7rem)',
    },
    mocha: {
      storyLabel: 'Jurnal Kebun',
      storyCardClipPath: 'polygon(2% 4%,98% 0,96% 96%,4% 100%,0 12%)',
      storyCardWidth: '40rem',
      storyCardMinHeight: '18rem',
      storyTextAlign: 'left',
      storyMarkerClipPath: 'polygon(50% 0,92% 25%,86% 78%,48% 100%,8% 74%,14% 22%)',
      galleryLabel: 'Album Botani',
      galleryColumns: 'repeat(auto-fit,minmax(min(100%,14rem),1fr))',
      galleryGap: '1.5rem',
      galleryTextAlign: 'left',
      galleryCardClipPaths: ['polygon(3% 0,100% 5%,96% 100%,0 94%)', 'polygon(0 5%,96% 0,100% 94%,4% 100%)', 'polygon(5% 2%,98% 0,94% 98%,0 100%)'],
      galleryCardHeights: ['20rem', '17rem', '22rem'],
      coupleStageClipPath: 'polygon(3% 0,100% 4%,96% 100%,0 95%)',
      couplePortraitClipPaths: ['polygon(14% 0,100% 8%,90% 100%,0 92%)', 'polygon(0 8%,86% 0,100% 92%,10% 100%)'],
      coupleJoinedClipPath: 'polygon(4% 0,100% 6%,94% 100%,0 94%)',
      journeyLabel: 'Jalur Daun',
      journeyFrameClipPath: 'polygon(2% 3%,98% 0,100% 94%,4% 100%,0 12%)',
      journeyImageClipPath: 'polygon(3% 0,100% 4%,96% 100%,0 96%)',
      eventColumns: 'minmax(0,1fr)',
      eventCardClipPaths: ['polygon(0 0,94% 4%,100% 92%,6% 100%,2% 18%)', 'polygon(6% 0,100% 6%,96% 100%,0 94%,0 12%)'],
      closingLabel: 'Catatan Senja',
      closingClipPath: 'polygon(2% 4%,98% 0,100% 92%,94% 100%,4% 96%,0 12%)',
      closingWidth: '52rem',
      closingTextAlign: 'left',
      closingPadding: 'clamp(2rem,6vw,4.5rem)',
    },
    ivory: {
      storyLabel: 'Wedding Journal · Chapter 01',
      storyCardClipPath: 'inset(0)',
      storyCardWidth: '50rem',
      storyCardMinHeight: '16rem',
      storyTextAlign: 'left',
      storyMarkerClipPath: 'inset(0)',
      galleryLabel: 'Editorial Frames',
      galleryColumns: 'repeat(auto-fit,minmax(min(100%,15rem),1fr))',
      galleryGap: '0.25rem',
      galleryTextAlign: 'left',
      galleryCardClipPaths: ['inset(0)', 'polygon(0 0,100% 0,100% 92%,0 100%)', 'polygon(0 8%,100% 0,100% 100%,0 100%)'],
      galleryCardHeights: ['24rem', '16rem', '20rem'],
      coupleStageClipPath: 'inset(0 0 0 0)',
      couplePortraitClipPaths: ['inset(0 12% 0 12%)', 'inset(0 12% 0 12%)'],
      coupleJoinedClipPath: 'inset(0 8% 0 8%)',
      journeyLabel: 'Chronology · 01—05',
      journeyFrameClipPath: 'inset(0)',
      journeyImageClipPath: 'inset(0 8% 0 8%)',
      eventColumns: 'repeat(auto-fit,minmax(min(100%,19rem),1fr))',
      eventCardClipPaths: ['inset(0)', 'polygon(0 0,100% 0,100% 92%,92% 100%,0 100%)'],
      closingLabel: 'Final Edition',
      closingClipPath: 'inset(0)',
      closingWidth: '68rem',
      closingTextAlign: 'left',
      closingPadding: 'clamp(2rem,5vw,4rem)',
    },
    javanese: {
      storyLabel: 'Serat Lelakon',
      storyCardClipPath: 'polygon(50% 0,92% 20%,100% 72%,78% 100%,22% 100%,0 72%,8% 20%)',
      storyCardWidth: '40rem',
      storyCardMinHeight: '21rem',
      storyTextAlign: 'center',
      storyMarkerClipPath: 'polygon(50% 0,90% 42%,50% 100%,10% 42%)',
      galleryLabel: 'Pigura Pusaka',
      galleryColumns: 'repeat(auto-fit,minmax(min(100%,12.5rem),1fr))',
      galleryGap: '0.8rem',
      galleryTextAlign: 'center',
      galleryCardClipPaths: ['polygon(50% 0,94% 18%,100% 76%,76% 100%,24% 100%,0 76%,6% 18%)', 'polygon(12% 0,88% 0,100% 22%,92% 100%,8% 100%,0 22%)'],
      galleryCardHeights: ['21rem', '19rem', '21rem'],
      coupleStageClipPath: 'polygon(50% 0,96% 20%,100% 78%,72% 100%,28% 100%,0 78%,4% 20%)',
      couplePortraitClipPaths: ['polygon(50% 0,100% 28%,90% 100%,10% 100%,0 28%)', 'polygon(50% 0,100% 28%,90% 100%,10% 100%,0 28%)'],
      coupleJoinedClipPath: 'polygon(50% 0,96% 24%,88% 100%,12% 100%,4% 24%)',
      journeyLabel: 'Laku Menuju Akad',
      journeyFrameClipPath: 'polygon(50% 0,96% 20%,100% 82%,78% 100%,22% 100%,0 82%,4% 20%)',
      journeyImageClipPath: 'polygon(50% 0,94% 22%,100% 82%,76% 100%,24% 100%,0 82%,6% 22%)',
      eventColumns: 'repeat(auto-fit,minmax(min(100%,18rem),1fr))',
      eventCardClipPaths: ['polygon(50% 0,100% 20%,94% 100%,6% 100%,0 20%)', 'polygon(6% 0,94% 0,100% 80%,50% 100%,0 80%)'],
      closingLabel: 'Panutup',
      closingClipPath: 'polygon(50% 0,94% 16%,100% 78%,76% 100%,24% 100%,0 78%,6% 16%)',
      closingWidth: '56rem',
      closingTextAlign: 'center',
      closingPadding: 'clamp(3rem,8vw,6.5rem)',
    },
    boho: {
      storyLabel: 'Freeform Stories',
      storyCardClipPath: 'polygon(0 0,86% 0,100% 22%,94% 100%,16% 94%,0 74%)',
      storyCardWidth: '43rem',
      storyCardMinHeight: '19rem',
      storyTextAlign: 'right',
      storyMarkerClipPath: 'polygon(25% 6%,75% 6%,100% 50%,75% 94%,25% 94%,0 50%)',
      galleryLabel: 'Desert Frames',
      galleryColumns: 'repeat(auto-fit,minmax(min(100%,13rem),1fr))',
      galleryGap: '1.1rem',
      galleryTextAlign: 'right',
      galleryCardClipPaths: ['polygon(0 0,82% 0,100% 20%,94% 100%,14% 92%,0 72%)', 'polygon(18% 0,100% 8%,100% 78%,84% 100%,0 94%,6% 16%)', 'ellipse(48% 50% at 50% 50%)'],
      galleryCardHeights: ['22rem', '18rem', '20rem'],
      coupleStageClipPath: 'polygon(0 8%,82% 0,100% 22%,94% 100%,14% 94%,0 72%)',
      couplePortraitClipPaths: ['polygon(0 0,84% 0,100% 24%,92% 100%,12% 92%,0 72%)', 'polygon(16% 0,100% 8%,100% 76%,86% 100%,0 94%,8% 18%)'],
      coupleJoinedClipPath: 'polygon(6% 0,88% 4%,100% 24%,92% 100%,10% 94%,0 70%)',
      journeyLabel: 'The Sacred Path',
      journeyFrameClipPath: 'polygon(0 6%,84% 0,100% 20%,94% 100%,16% 94%,0 72%)',
      journeyImageClipPath: 'polygon(6% 0,90% 4%,100% 22%,92% 100%,8% 94%,0 70%)',
      eventColumns: 'repeat(auto-fit,minmax(min(100%,17.5rem),1fr))',
      eventCardClipPaths: ['polygon(0 0,82% 0,100% 24%,92% 100%,12% 94%,0 72%)', 'polygon(18% 0,100% 8%,100% 78%,84% 100%,0 94%,6% 16%)'],
      closingLabel: 'Closing Note',
      closingClipPath: 'polygon(0 6%,86% 0,100% 22%,94% 100%,14% 94%,0 74%)',
      closingWidth: '54rem',
      closingTextAlign: 'right',
      closingPadding: 'clamp(2.5rem,7vw,5.5rem)',
    },
    watercolor: {
      storyLabel: 'Sapuan Kisah',
      storyCardClipPath: 'polygon(8% 0,86% 3%,100% 28%,92% 92%,70% 100%,12% 94%,0 64%,3% 18%)',
      storyCardWidth: '42rem',
      storyCardMinHeight: '20rem',
      storyTextAlign: 'center',
      storyMarkerClipPath: 'polygon(50% 0,88% 12%,100% 50%,82% 92%,45% 100%,8% 82%,0 42%,18% 8%)',
      galleryLabel: 'Galeri Sapuan',
      galleryColumns: 'repeat(auto-fit,minmax(min(100%,12.5rem),1fr))',
      galleryGap: '1.65rem',
      galleryTextAlign: 'center',
      galleryCardClipPaths: ['polygon(8% 0,86% 4%,100% 30%,92% 90%,68% 100%,10% 94%,0 62%,4% 18%)', 'polygon(14% 2%,92% 0,100% 62%,84% 98%,20% 100%,0 72%,4% 20%)', 'ellipse(48% 50% at 50% 50%)'],
      galleryCardHeights: ['20rem', '23rem', '18rem'],
      coupleStageClipPath: 'polygon(8% 0,88% 4%,100% 30%,92% 92%,68% 100%,10% 94%,0 62%,4% 18%)',
      couplePortraitClipPaths: ['polygon(12% 0,88% 4%,100% 34%,90% 100%,14% 94%,0 60%)', 'polygon(8% 4%,86% 0,100% 58%,88% 96%,12% 100%,0 34%)'],
      coupleJoinedClipPath: 'polygon(10% 0,88% 4%,100% 30%,90% 96%,68% 100%,10% 92%,0 60%,4% 18%)',
      journeyLabel: 'Aliran Menuju Akad',
      journeyFrameClipPath: 'polygon(6% 0,88% 4%,100% 26%,94% 88%,72% 100%,12% 94%,0 68%,3% 20%)',
      journeyImageClipPath: 'polygon(10% 0,90% 5%,100% 30%,92% 94%,70% 100%,8% 90%,0 62%,5% 16%)',
      eventColumns: 'repeat(auto-fit,minmax(min(100%,16.5rem),1fr))',
      eventCardClipPaths: ['polygon(8% 0,88% 4%,100% 28%,92% 94%,14% 100%,0 68%,4% 18%)', 'polygon(12% 4%,92% 0,100% 66%,86% 100%,8% 92%,0 26%)'],
      closingLabel: 'Sapuan Doa',
      closingClipPath: 'polygon(6% 0,88% 3%,100% 28%,94% 90%,72% 100%,12% 94%,0 66%,4% 18%)',
      closingWidth: '60rem',
      closingTextAlign: 'center',
      closingPadding: 'clamp(3rem,8vw,6rem)',
    },
    mihrab: {
      storyLabel: 'Riwayat Dalam Mihrab',
      storyCardClipPath: 'inset(0 round 50% 50% 1.5rem 1.5rem)',
      storyCardWidth: '39rem',
      storyCardMinHeight: '22rem',
      storyTextAlign: 'center',
      storyMarkerClipPath: 'polygon(50% 0,88% 28%,88% 100%,12% 100%,12% 28%)',
      galleryLabel: 'Relung Kenangan',
      galleryColumns: 'repeat(auto-fit,minmax(min(100%,12rem),1fr))',
      galleryGap: '0.9rem',
      galleryTextAlign: 'center',
      galleryCardClipPaths: ['inset(0 round 50% 50% 1rem 1rem)', 'inset(0 round 42% 42% 2rem 2rem)', 'polygon(50% 0,92% 20%,92% 100%,8% 100%,8% 20%)'],
      galleryCardHeights: ['22rem', '20rem', '22rem'],
      coupleStageClipPath: 'inset(0 round 50% 50% 1.5rem 1.5rem)',
      couplePortraitClipPaths: ['inset(0 round 50% 50% 1rem 1rem)', 'inset(0 round 50% 50% 1rem 1rem)'],
      coupleJoinedClipPath: 'inset(0 round 50% 50% 1.5rem 1.5rem)',
      journeyLabel: 'Jalan Menuju Mihrab',
      journeyFrameClipPath: 'inset(0 round 50% 50% 1.5rem 1.5rem)',
      journeyImageClipPath: 'inset(0 round 48% 48% 1rem 1rem)',
      eventColumns: 'minmax(0,1fr)',
      eventCardClipPaths: ['inset(0 round 50% 50% 1.5rem 1.5rem)', 'polygon(50% 0,92% 20%,92% 100%,8% 100%,8% 20%)'],
      closingLabel: 'Doa Penutup',
      closingClipPath: 'inset(0 round 50% 50% 2rem 2rem)',
      closingWidth: '55rem',
      closingTextAlign: 'center',
      closingPadding: 'clamp(4rem,10vw,8rem)',
    },
    terracotta: {
      storyLabel: 'Potongan Surat',
      storyCardClipPath: 'polygon(0 5%,8% 0,24% 4%,42% 0,62% 5%,80% 1%,100% 6%,96% 96%,78% 100%,58% 95%,38% 100%,18% 96%,0 100%)',
      storyCardWidth: '41rem',
      storyCardMinHeight: '19rem',
      storyTextAlign: 'left',
      storyMarkerClipPath: 'polygon(0 8%,18% 0,38% 6%,58% 0,78% 7%,100% 2%,94% 100%,4% 94%)',
      galleryLabel: 'Keping Kenangan',
      galleryColumns: 'repeat(auto-fit,minmax(min(100%,13.5rem),1fr))',
      galleryGap: '1.35rem',
      galleryTextAlign: 'left',
      galleryCardClipPaths: ['polygon(0 4%,18% 0,36% 5%,56% 0,78% 4%,100% 0,96% 100%,4% 94%)', 'polygon(4% 0,24% 5%,46% 0,64% 4%,84% 0,100% 6%,94% 94%,0 100%)', 'polygon(0 8%,22% 0,44% 5%,68% 0,100% 4%,96% 100%,8% 94%)'],
      galleryCardHeights: ['18rem', '22rem', '20rem'],
      coupleStageClipPath: 'polygon(0 4%,20% 0,42% 5%,64% 0,84% 4%,100% 0,96% 96%,76% 100%,52% 95%,26% 100%,0 94%)',
      couplePortraitClipPaths: ['polygon(0 4%,22% 0,46% 5%,70% 0,100% 6%,94% 100%,6% 94%)', 'polygon(6% 0,30% 5%,54% 0,78% 4%,100% 0,94% 94%,0 100%)'],
      coupleJoinedClipPath: 'polygon(0 5%,20% 0,42% 4%,64% 0,84% 5%,100% 2%,94% 96%,72% 100%,48% 95%,22% 100%,0 94%)',
      journeyLabel: 'Rute Catatan',
      journeyFrameClipPath: 'polygon(0 5%,18% 0,38% 4%,60% 0,82% 5%,100% 0,96% 96%,78% 100%,54% 95%,28% 100%,0 94%)',
      journeyImageClipPath: 'polygon(0 4%,24% 0,46% 5%,68% 0,100% 4%,96% 100%,6% 94%)',
      eventColumns: 'repeat(auto-fit,minmax(min(100%,16.5rem),1fr))',
      eventCardClipPaths: ['polygon(0 6%,24% 0,48% 4%,72% 0,100% 6%,94% 100%,4% 94%)', 'polygon(4% 0,26% 5%,52% 0,76% 4%,100% 0,94% 94%,0 100%)'],
      closingLabel: 'Surat Penutup',
      closingClipPath: 'polygon(0 5%,18% 0,38% 4%,60% 0,82% 5%,100% 0,96% 96%,78% 100%,54% 95%,28% 100%,0 94%)',
      closingWidth: '57rem',
      closingTextAlign: 'left',
      closingPadding: 'clamp(2.5rem,7vw,5rem)',
    },
    pearl: {
      storyLabel: 'Untai Kisah',
      storyCardClipPath: 'inset(0 round 4rem)',
      storyCardWidth: '36rem',
      storyCardMinHeight: '20rem',
      storyTextAlign: 'center',
      storyMarkerClipPath: 'circle(50% at 50% 50%)',
      galleryLabel: 'Butir Kenangan',
      galleryColumns: 'repeat(auto-fit,minmax(min(100%,10.5rem),1fr))',
      galleryGap: '2rem',
      galleryTextAlign: 'center',
      galleryCardClipPaths: ['ellipse(45% 49% at 50% 50%)', 'inset(0 round 50% 50% 2.5rem 2.5rem)', 'ellipse(50% 46% at 50% 50%)'],
      galleryCardHeights: ['18rem', '22rem', '19rem'],
      coupleStageClipPath: 'inset(0 round 5rem)',
      couplePortraitClipPaths: ['inset(0 round 50% 50% 3rem 3rem)', 'inset(0 round 3rem 3rem 50% 50%)'],
      coupleJoinedClipPath: 'inset(0 round 5rem)',
      journeyLabel: 'Rangkaian Janji',
      journeyFrameClipPath: 'inset(0 round 5rem)',
      journeyImageClipPath: 'inset(0 round 4rem)',
      eventColumns: 'repeat(auto-fit,minmax(min(100%,15rem),1fr))',
      eventCardClipPaths: ['inset(0 round 50% 50% 3rem 3rem)', 'inset(0 round 3rem 3rem 50% 50%)'],
      closingLabel: 'Doa dalam Untai',
      closingClipPath: 'inset(0 round 6rem)',
      closingWidth: '50rem',
      closingTextAlign: 'center',
      closingPadding: 'clamp(3rem,9vw,7rem)',
    },
    indigo: {
      storyLabel: 'Naskah Kisah',
      storyCardClipPath: 'polygon(16% 0,84% 0,100% 50%,84% 100%,16% 100%,0 50%)',
      storyCardWidth: '36rem',
      storyCardMinHeight: '25rem',
      storyTextAlign: 'center',
      storyMarkerClipPath: 'polygon(50% 0,62% 34%,100% 50%,62% 66%,50% 100%,38% 66%,0 50%,38% 34%)',
      galleryLabel: 'Panel Nusantara',
      galleryColumns: 'repeat(auto-fit,minmax(min(100%,12rem),1fr))',
      galleryGap: '0.7rem',
      galleryTextAlign: 'right',
      galleryCardClipPaths: ['polygon(50% 0,100% 50%,50% 100%,0 50%)', 'polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)', 'polygon(50% 0,92% 22%,100% 70%,70% 100%,22% 92%,0 50%,18% 18%)'],
      galleryCardHeights: ['21rem', '18rem', '22rem'],
      coupleStageClipPath: 'polygon(10% 0,90% 0,100% 50%,90% 100%,10% 100%,0 50%)',
      couplePortraitClipPaths: ['polygon(18% 0,82% 0,100% 50%,82% 100%,18% 100%,0 50%)', 'polygon(10% 0,90% 0,100% 46%,88% 100%,12% 100%,0 54%)'],
      coupleJoinedClipPath: 'polygon(12% 0,88% 0,100% 22%,94% 88%,78% 100%,20% 94%,0 72%,4% 18%)',
      journeyLabel: 'Pola Perjalanan',
      journeyFrameClipPath: 'polygon(12% 0,88% 0,100% 50%,88% 100%,12% 100%,0 50%)',
      journeyImageClipPath: 'polygon(8% 0,92% 0,100% 18%,100% 82%,92% 100%,8% 100%,0 82%,0 18%)',
      eventColumns: 'repeat(auto-fit,minmax(min(100%,17rem),1fr))',
      eventCardClipPaths: ['polygon(14% 0,86% 0,100% 50%,86% 100%,14% 100%,0 50%)', 'polygon(8% 0,92% 0,100% 18%,100% 82%,92% 100%,8% 100%,0 82%,0 18%)'],
      closingLabel: 'Purna Naskah',
      closingClipPath: 'polygon(50% 0,94% 22%,100% 68%,70% 100%,26% 94%,0 52%,18% 18%)',
      closingWidth: '56rem',
      closingTextAlign: 'right',
      closingPadding: 'clamp(4rem,10vw,8rem)',
    },
    sundanese: {
      storyLabel: 'Lalakon Priangan',
      storyCardClipPath: 'polygon(6% 0,94% 0,100% 16%,94% 100%,6% 100%,0 16%)',
      storyCardWidth: '42rem',
      storyCardMinHeight: '19rem',
      storyTextAlign: 'left',
      storyMarkerClipPath: 'polygon(50% 0,88% 24%,100% 70%,62% 100%,18% 88%,0 45%,18% 10%)',
      galleryLabel: 'Pigura Priangan',
      galleryColumns: 'repeat(auto-fit,minmax(min(100%,12.75rem),1fr))',
      galleryGap: '1.25rem',
      galleryTextAlign: 'left',
      galleryCardClipPaths: ['polygon(6% 0,94% 0,100% 18%,92% 100%,8% 100%,0 18%)', 'inset(0 round 50% 50% 1.25rem 1.25rem)', 'polygon(0 8%,86% 0,100% 22%,94% 100%,8% 94%)'],
      galleryCardHeights: ['20rem', '22rem', '18rem'],
      coupleStageClipPath: 'polygon(7% 0,93% 0,100% 20%,93% 100%,7% 100%,0 20%)',
      couplePortraitClipPaths: ['inset(0 round 50% 50% 1rem 1rem)', 'polygon(8% 0,92% 0,100% 26%,92% 100%,8% 100%,0 26%)'],
      coupleJoinedClipPath: 'inset(0 round 48% 48% 1.5rem 1.5rem)',
      journeyLabel: 'Galur Priangan',
      journeyFrameClipPath: 'polygon(5% 0,95% 0,100% 15%,95% 100%,5% 100%,0 15%)',
      journeyImageClipPath: 'inset(0 round 5rem 5rem 1.25rem 1.25rem)',
      eventColumns: 'repeat(auto-fit,minmax(min(100%,17rem),1fr))',
      eventCardClipPaths: ['inset(0 round 5rem 5rem 1rem 1rem)', 'polygon(8% 0,92% 0,100% 20%,92% 100%,8% 100%,0 20%)'],
      closingLabel: 'Panutup Priangan',
      closingClipPath: 'polygon(6% 0,94% 0,100% 18%,94% 100%,6% 100%,0 18%)',
      closingWidth: '58rem',
      closingTextAlign: 'left',
      closingPadding: 'clamp(2.5rem,7vw,5.5rem)',
    },
    minangkabau: {
      storyLabel: 'Kaba dari Ranah',
      storyCardClipPath: 'polygon(0 18%,12% 0,32% 15%,50% 0,68% 15%,88% 0,100% 18%,96% 100%,4% 100%)',
      storyCardWidth: '44rem',
      storyCardMinHeight: '20rem',
      storyTextAlign: 'center',
      storyMarkerClipPath: 'polygon(50% 0,100% 38%,82% 100%,18% 100%,0 38%)',
      galleryLabel: 'Galeri Songket',
      galleryColumns: 'repeat(auto-fit,minmax(min(100%,12rem),1fr))',
      galleryGap: '0.9rem',
      galleryTextAlign: 'center',
      galleryCardClipPaths: ['polygon(0 18%,18% 0,36% 16%,54% 0,72% 16%,90% 0,100% 18%,96% 100%,4% 100%)', 'polygon(50% 0,100% 30%,92% 100%,8% 100%,0 30%)', 'polygon(0 0,100% 0,92% 86%,50% 100%,8% 86%)'],
      galleryCardHeights: ['21rem', '19rem', '22rem'],
      coupleStageClipPath: 'polygon(0 18%,14% 0,34% 16%,50% 0,66% 16%,86% 0,100% 18%,96% 100%,4% 100%)',
      couplePortraitClipPaths: ['polygon(50% 0,100% 28%,92% 100%,8% 100%,0 28%)', 'polygon(8% 0,92% 0,100% 72%,50% 100%,0 72%)'],
      coupleJoinedClipPath: 'polygon(0 18%,18% 0,36% 16%,54% 0,72% 16%,90% 0,100% 18%,94% 100%,6% 100%)',
      journeyLabel: 'Jalan Gonjong',
      journeyFrameClipPath: 'polygon(0 14%,14% 0,32% 14%,50% 0,68% 14%,86% 0,100% 14%,96% 100%,4% 100%)',
      journeyImageClipPath: 'polygon(8% 0,92% 0,100% 24%,94% 100%,6% 100%,0 24%)',
      eventColumns: 'repeat(auto-fit,minmax(min(100%,18rem),1fr))',
      eventCardClipPaths: ['polygon(0 16%,18% 0,38% 14%,58% 0,78% 14%,100% 0,96% 100%,4% 100%)', 'polygon(4% 0,96% 0,100% 84%,50% 100%,0 84%)'],
      closingLabel: 'Panutup Kaba',
      closingClipPath: 'polygon(0 16%,16% 0,34% 14%,50% 0,66% 14%,84% 0,100% 16%,95% 100%,5% 100%)',
      closingWidth: '60rem',
      closingTextAlign: 'center',
      closingPadding: 'clamp(3.5rem,9vw,7rem)',
    },
    dayak: {
      storyLabel: 'Jejak Rimba',
      storyCardClipPath: 'polygon(10% 0,82% 4%,100% 26%,92% 82%,70% 100%,12% 94%,0 66%,4% 18%)',
      storyCardWidth: '41rem',
      storyCardMinHeight: '20rem',
      storyTextAlign: 'right',
      storyMarkerClipPath: 'polygon(50% 0,82% 14%,100% 48%,82% 86%,50% 100%,16% 84%,0 50%,18% 14%)',
      galleryLabel: 'Ukiran Kenangan',
      galleryColumns: 'repeat(auto-fit,minmax(min(100%,13rem),1fr))',
      galleryGap: '1.4rem',
      galleryTextAlign: 'right',
      galleryCardClipPaths: ['polygon(8% 0,86% 4%,100% 24%,94% 88%,72% 100%,12% 94%,0 68%,4% 18%)', 'polygon(16% 0,94% 6%,100% 68%,82% 100%,14% 94%,0 30%)', 'polygon(50% 0,92% 16%,100% 56%,78% 100%,28% 92%,0 54%,14% 14%)'],
      galleryCardHeights: ['22rem', '18rem', '20rem'],
      coupleStageClipPath: 'polygon(8% 0,88% 4%,100% 28%,94% 88%,70% 100%,10% 94%,0 66%,4% 16%)',
      couplePortraitClipPaths: ['polygon(12% 0,88% 4%,100% 32%,92% 100%,12% 94%,0 64%)', 'polygon(8% 4%,88% 0,100% 62%,86% 100%,10% 92%,0 30%)'],
      coupleJoinedClipPath: 'polygon(8% 0,90% 5%,100% 28%,92% 92%,68% 100%,10% 92%,0 62%,4% 18%)',
      journeyLabel: 'Lintasan Borneo',
      journeyFrameClipPath: 'polygon(6% 0,88% 4%,100% 24%,94% 88%,72% 100%,12% 94%,0 68%,4% 18%)',
      journeyImageClipPath: 'polygon(10% 0,92% 6%,100% 62%,86% 100%,8% 92%,0 30%)',
      eventColumns: 'repeat(auto-fit,minmax(min(100%,17rem),1fr))',
      eventCardClipPaths: ['polygon(8% 0,88% 4%,100% 30%,92% 94%,12% 100%,0 66%,4% 16%)', 'polygon(14% 4%,92% 0,100% 68%,84% 100%,8% 92%,0 26%)'],
      closingLabel: 'Salam dari Rimba',
      closingClipPath: 'polygon(8% 0,88% 4%,100% 26%,94% 90%,72% 100%,12% 94%,0 66%,4% 18%)',
      closingWidth: '56rem',
      closingTextAlign: 'right',
      closingPadding: 'clamp(3rem,8vw,6rem)',
    },
    balinese: {
      storyLabel: 'Lontar Perjalanan',
      storyCardClipPath: 'polygon(50% 0,96% 20%,100% 80%,76% 100%,24% 100%,0 80%,4% 20%)',
      storyCardWidth: '40rem',
      storyCardMinHeight: '21rem',
      storyTextAlign: 'center',
      storyMarkerClipPath: 'polygon(50% 0,88% 28%,82% 100%,18% 100%,12% 28%)',
      galleryLabel: 'Relief Kenangan',
      galleryColumns: 'repeat(auto-fit,minmax(min(100%,12.5rem),1fr))',
      galleryGap: '0.75rem',
      galleryTextAlign: 'center',
      galleryCardClipPaths: ['polygon(50% 0,96% 20%,100% 78%,76% 100%,24% 100%,0 78%,4% 20%)', 'polygon(8% 0,92% 0,100% 22%,88% 100%,12% 100%,0 22%)', 'polygon(50% 0,90% 18%,100% 72%,72% 100%,28% 100%,0 72%,10% 18%)'],
      galleryCardHeights: ['21rem', '19rem', '21rem'],
      coupleStageClipPath: 'polygon(50% 0,96% 20%,100% 78%,74% 100%,26% 100%,0 78%,4% 20%)',
      couplePortraitClipPaths: ['polygon(50% 0,100% 24%,92% 100%,8% 100%,0 24%)', 'polygon(8% 0,92% 0,100% 76%,50% 100%,0 76%)'],
      coupleJoinedClipPath: 'polygon(50% 0,94% 18%,100% 78%,74% 100%,26% 100%,0 78%,6% 18%)',
      journeyLabel: 'Gerbang Menuju Akad',
      journeyFrameClipPath: 'polygon(50% 0,96% 20%,100% 80%,76% 100%,24% 100%,0 80%,4% 20%)',
      journeyImageClipPath: 'polygon(8% 0,92% 0,100% 24%,92% 100%,8% 100%,0 24%)',
      eventColumns: 'repeat(auto-fit,minmax(min(100%,18rem),1fr))',
      eventCardClipPaths: ['polygon(50% 0,100% 22%,94% 100%,6% 100%,0 22%)', 'polygon(6% 0,94% 0,100% 78%,50% 100%,0 78%)'],
      closingLabel: 'Purna Lontar',
      closingClipPath: 'polygon(50% 0,94% 18%,100% 78%,76% 100%,24% 100%,0 78%,6% 18%)',
      closingWidth: '56rem',
      closingTextAlign: 'center',
      closingPadding: 'clamp(3.5rem,9vw,7rem)',
    },
    bugis: {
      storyLabel: 'Catatan Pelayaran',
      storyCardClipPath: 'polygon(0 8%,100% 0,94% 92%,0 100%)',
      storyCardWidth: '46rem',
      storyCardMinHeight: '18rem',
      storyTextAlign: 'left',
      storyMarkerClipPath: 'polygon(50% 0,100% 50%,50% 100%,0 50%)',
      galleryLabel: 'Album Pinisi',
      galleryColumns: 'repeat(auto-fit,minmax(min(100%,14rem),1fr))',
      galleryGap: '1rem',
      galleryTextAlign: 'left',
      galleryCardClipPaths: ['polygon(0 6%,100% 0,94% 92%,0 100%)', 'polygon(6% 0,100% 8%,100% 100%,0 92%)', 'polygon(0 0,92% 0,100% 86%,8% 100%)'],
      galleryCardHeights: ['18rem', '23rem', '19rem'],
      coupleStageClipPath: 'polygon(0 8%,100% 0,94% 92%,0 100%)',
      couplePortraitClipPaths: ['polygon(0 6%,96% 0,100% 92%,6% 100%)', 'polygon(6% 0,100% 8%,94% 100%,0 92%)'],
      coupleJoinedClipPath: 'polygon(0 6%,100% 0,94% 94%,0 100%)',
      journeyLabel: 'Haluan Menuju Akad',
      journeyFrameClipPath: 'polygon(0 6%,100% 0,96% 94%,0 100%)',
      journeyImageClipPath: 'polygon(4% 0,100% 6%,94% 100%,0 94%)',
      eventColumns: 'minmax(0,1fr)',
      eventCardClipPaths: ['polygon(0 6%,100% 0,96% 94%,0 100%)', 'polygon(4% 0,100% 6%,94% 100%,0 94%)'],
      closingLabel: 'Tiba di Pelabuhan',
      closingClipPath: 'polygon(0 6%,100% 0,94% 94%,0 100%)',
      closingWidth: '62rem',
      closingTextAlign: 'left',
      closingPadding: 'clamp(2.5rem,7vw,5rem)',
    },
    betawi: {
      storyLabel: 'Cerite Kite',
      storyCardClipPath: 'polygon(6% 0,94% 0,100% 12%,94% 88%,82% 100%,18% 100%,6% 88%,0 12%)',
      storyCardWidth: '43rem',
      storyCardMinHeight: '19rem',
      storyTextAlign: 'center',
      storyMarkerClipPath: 'polygon(50% 0,62% 36%,100% 50%,62% 64%,50% 100%,38% 64%,0 50%,38% 36%)',
      galleryLabel: 'Kembang Kenangan',
      galleryColumns: 'repeat(auto-fit,minmax(min(100%,12rem),1fr))',
      galleryGap: '1.6rem',
      galleryTextAlign: 'center',
      galleryCardClipPaths: ['polygon(50% 0,64% 34%,100% 50%,64% 66%,50% 100%,36% 66%,0 50%,36% 34%)', 'inset(0 round 5rem 1rem 5rem 1rem)', 'inset(0 round 1rem 5rem 1rem 5rem)'],
      galleryCardHeights: ['19rem', '22rem', '19rem'],
      coupleStageClipPath: 'polygon(6% 0,94% 0,100% 14%,94% 88%,82% 100%,18% 100%,6% 88%,0 14%)',
      couplePortraitClipPaths: ['inset(0 round 5rem 1rem 5rem 1rem)', 'inset(0 round 1rem 5rem 1rem 5rem)'],
      coupleJoinedClipPath: 'polygon(50% 0,96% 22%,100% 72%,74% 100%,26% 100%,0 72%,4% 22%)',
      journeyLabel: 'Langkah Kite',
      journeyFrameClipPath: 'polygon(6% 0,94% 0,100% 14%,94% 88%,82% 100%,18% 100%,6% 88%,0 14%)',
      journeyImageClipPath: 'inset(0 round 4rem 1rem 4rem 1rem)',
      eventColumns: 'repeat(auto-fit,minmax(min(100%,17rem),1fr))',
      eventCardClipPaths: ['inset(0 round 4rem 1rem 4rem 1rem)', 'inset(0 round 1rem 4rem 1rem 4rem)'],
      closingLabel: 'Salam Penutup',
      closingClipPath: 'polygon(6% 0,94% 0,100% 14%,94% 88%,82% 100%,18% 100%,6% 88%,0 14%)',
      closingWidth: '58rem',
      closingTextAlign: 'center',
      closingPadding: 'clamp(3rem,8vw,6rem)',
    },
  };
  readonly activeExperience = computed(() => this.themeExperiences[this.activeThemeId()]);
  readonly outfitPalettes: Readonly<Record<ThemeId, OutfitThemePalette>> = {
    emerald: { label: 'Zamrud–Emas', hueRotation: 168, saturation: 0.85, brightness: 0.9 },
    maroon: { label: 'Marun–Emas', hueRotation: 0, saturation: 1, brightness: 1 },
    midnight: { label: 'Navy–Emas', hueRotation: -135, saturation: 1.15, brightness: 0.92 },
    mocha: { label: 'Mocha–Krem', hueRotation: 47, saturation: 0.62, brightness: 1 },
    ivory: { label: 'Taupe–Champagne', hueRotation: 46, saturation: 0.3, brightness: 1.25 },
    javanese: { label: 'Sogan–Emas', hueRotation: 35, saturation: 1.1, brightness: 1 },
    boho: { label: 'Arang–Emas', hueRotation: 124, saturation: 0.18, brightness: 0.75 },
    watercolor: { label: 'Sage–Mawar', hueRotation: -176, saturation: 0.38, brightness: 1.12 },
    mihrab: { label: 'Sage–Emas', hueRotation: 174, saturation: 0.55, brightness: 1.12 },
    terracotta: { label: 'Terracotta–Krem', hueRotation: 31, saturation: 0.8, brightness: 1.18 },
    pearl: { label: 'Biru Mutiara–Emas', hueRotation: -149, saturation: 0.3, brightness: 1.22 },
    indigo: { label: 'Indigo–Emas', hueRotation: -135, saturation: 0.85, brightness: 1.05 },
    sundanese: { label: 'Sage Priangan–Emas', hueRotation: 166, saturation: 0.62, brightness: 1.08 },
    minangkabau: { label: 'Merah Minang–Emas', hueRotation: 4, saturation: 1.12, brightness: 0.96 },
    dayak: { label: 'Rimba–Tembaga', hueRotation: 138, saturation: 0.76, brightness: 0.92 },
    balinese: { label: 'Sogan Bali–Emas', hueRotation: 30, saturation: 0.94, brightness: 1.02 },
    bugis: { label: 'Laut Pinisi–Emas', hueRotation: -126, saturation: 0.88, brightness: 1.04 },
    betawi: { label: 'Hijau Betawi–Koral', hueRotation: 164, saturation: 0.92, brightness: 1.08 },
  };
  readonly activeOutfitPalette = computed(() => this.outfitPalettes[this.activeThemeId()]);
  readonly outfitImageFilter = 'url(#theme-outfit-recolor)';
  readonly themeScrapbookBackground = computed(
    () => this.activeTheme().scrapbookAsset ?? `/assets/scrapbook-${this.activeTheme().slug}.jpg`,
  );
  readonly isStarAnimating = signal(false);
  readonly isFrameVisible = signal(false);
  readonly isCoupleJoined = signal(false);
  readonly isAlternateOutfit = signal(false);
  readonly isJourneyRendered = signal(true);
  readonly storyScrollProgress = signal(0);
  readonly galleryScrollProgress = signal(0);
  readonly verseScrollProgress = signal(0);
  readonly coupleScrollProgress = signal(0);
  readonly journeyScrollProgress = signal(0);
  readonly eventScrollProgress = signal(0);
  readonly closingScrollProgress = signal(0);
  readonly journeySteps = ['Ta’aruf', 'Nazhor', 'Istikharah', 'Khitbah', 'Akad'] as const;
  readonly journeyNodePositions = [100, 300, 500, 700, 900] as const;
  readonly journeyScenes: readonly JourneyScene[] = [
    {
      base: '/assets/journey-taaruf-chat.jpg',
      alternate: '/assets/journey-taaruf-chat-maroon.jpg',
      alt: 'Ilustrasi ta’aruf melalui chat biro jodoh dengan pendampingan ibu',
      description: 'Berkenalan melalui biro jodoh, lalu melanjutkan komunikasi secara terarah dengan pendampingan keluarga.',
    },
    {
      base: '/assets/journey-nazhor-cafe.jpg',
      alternate: '/assets/journey-nazhor-cafe-maroon.jpg',
      alt: 'Ilustrasi nazhor di kafe, wanita didampingi ibunya dan pria datang sendiri',
      description: 'Pertemuan nazhor berlangsung di tempat terbuka; calon mempelai wanita hadir bersama ibunya.',
    },
    {
      base: '/assets/journey-istikharah-doa.jpg',
      alternate: '/assets/journey-istikharah-doa-maroon.jpg',
      alt: 'Ilustrasi calon mempelai pria dan wanita melaksanakan istikharah serta berdoa di tempat terpisah',
      description: 'Kami menunaikan salat istikharah dan berdoa kepada Allah, memohon petunjuk serta keteguhan sebelum melangkah.',
    },
    {
      base: '/assets/journey-khitbah-keluarga.jpg',
      alternate: '/assets/journey-khitbah-keluarga-maroon.jpg',
      alt: 'Ilustrasi keluarga calon mempelai pria bersilaturahmi dengan keluarga calon mempelai wanita saat khitbah',
      description: 'Keluarga calon mempelai pria datang bersilaturahmi dan menyampaikan niat khitbah kepada keluarga wanita.',
    },
    {
      base: '/assets/journey-akad-ijab-qabul.jpg',
      alternate: '/assets/journey-akad-ijab-qabul-maroon.jpg',
      alt: 'Ilustrasi ijab qabul antara mempelai pria dan wali dengan penghulu serta saksi',
      description: 'Ijab qabul dilangsungkan di hadapan wali, penghulu, dan para saksi sebagai awal ikatan pernikahan.',
    },
  ];
  readonly storyMoments: readonly StoryMoment[] = [
    {
      step: '01',
      title: 'Ta’aruf',
      date: 'Januari 2025',
      description:
        'Perkenalan dimulai melalui sebuah web biro jodoh, kemudian komunikasi dilanjutkan secara terarah dengan pendampingan keluarga.',
    },
    {
      step: '02',
      title: 'Nazhor',
      date: 'Maret 2025',
      description:
        'Kami bertemu di sebuah kafe untuk nazhor; calon mempelai wanita hadir bersama ibunya dan calon mempelai pria datang sendiri.',
    },
    {
      step: '03',
      title: 'Istikharah',
      date: 'Juni 2025',
      description:
        'Kami menunaikan salat istikharah dan berdoa kepada Allah, memohon petunjuk serta keteguhan hati sebelum melangkah lebih jauh.',
    },
    {
      step: '04',
      title: 'Khitbah',
      date: 'Desember 2025',
      description:
        'Keluarga calon mempelai pria bersilaturahmi dengan keluarga calon mempelai wanita untuk menyampaikan niat khitbah.',
    },
    {
      step: '05',
      title: 'Akad',
      date: '20 Oktober 2026',
      description:
        'Insyaallah, perjalanan ini kami sempurnakan dalam akad nikah dan memulai ibadah terpanjang bersama.',
    },
  ];
  readonly activeStoryIndex = computed(() =>
    Math.min(
      this.storyMoments.length - 1,
      Math.max(0, Math.round(this.storyScrollProgress() * (this.storyMoments.length - 1))),
    ),
  );
  readonly galleryItems: readonly GalleryItem[] = [
    {
      src: '/assets/journey-taaruf-chat.jpg',
      alternate: '/assets/journey-taaruf-chat-maroon.jpg',
      alt: 'Ilustrasi perkenalan melalui chat di web biro jodoh',
      caption: 'Awal Ta’aruf',
    },
    {
      src: '/assets/journey-nazhor-cafe.jpg',
      alternate: '/assets/journey-nazhor-cafe-maroon.jpg',
      alt: 'Ilustrasi nazhor di kafe dengan pendampingan ibu',
      caption: 'Pertemuan Nazhor',
    },
    {
      src: '/assets/journey-istikharah-doa.jpg',
      alternate: '/assets/journey-istikharah-doa-maroon.jpg',
      alt: 'Ilustrasi calon mempelai pria dan wanita berdoa memohon petunjuk Allah di tempat terpisah',
      caption: 'Memohon Petunjuk dalam Istikharah',
    },
    {
      src: '/assets/journey-khitbah-keluarga.jpg',
      alternate: '/assets/journey-khitbah-keluarga-maroon.jpg',
      alt: 'Ilustrasi pertemuan kedua keluarga saat khitbah',
      caption: 'Hari Khitbah',
    },
    {
      src: '/assets/gallery-keluarga-wanita-ke-pria.jpg',
      alternate: '/assets/gallery-keluarga-wanita-ke-pria-maroon.jpg',
      alt: 'Ilustrasi keluarga calon mempelai wanita berkunjung ke rumah keluarga calon mempelai pria',
      caption: 'Kunjungan Keluarga Wanita',
    },
    {
      src: '/assets/gallery-keluarga-pria-ke-wanita.jpg',
      alternate: '/assets/gallery-keluarga-pria-ke-wanita-maroon.jpg',
      alt: 'Ilustrasi keluarga calon mempelai pria berkunjung ke rumah keluarga calon mempelai wanita',
      caption: 'Kunjungan Keluarga Pria',
    },
    {
      src: '/assets/journey-akad-ijab-qabul.jpg',
      alternate: '/assets/journey-akad-ijab-qabul-maroon.jpg',
      alt: 'Ilustrasi ijab qabul di hadapan wali, penghulu, dan saksi',
      caption: 'Ijab Qabul',
    },
  ];
  readonly surpriseParticles: readonly SurpriseParticle[] = [
    { x: -172, y: -128, delay: 0, rotate: -30, symbol: '✦' },
    { x: -92, y: -178, delay: 80, rotate: 20, symbol: '◆' },
    { x: 4, y: -198, delay: 150, rotate: 45, symbol: '✧' },
    { x: 112, y: -164, delay: 55, rotate: 75, symbol: '✦' },
    { x: 184, y: -92, delay: 125, rotate: 110, symbol: '◆' },
    { x: 192, y: 36, delay: 30, rotate: 145, symbol: '✧' },
    { x: 136, y: 142, delay: 175, rotate: 185, symbol: '✦' },
    { x: 28, y: 192, delay: 95, rotate: 220, symbol: '◆' },
    { x: -92, y: 164, delay: 145, rotate: 255, symbol: '✧' },
    { x: -180, y: 86, delay: 45, rotate: 300, symbol: '✦' },
    { x: -204, y: -18, delay: 110, rotate: 340, symbol: '◆' },
  ];
  readonly fallingFlowers: readonly FallingFlower[] = [
    { left: 4, delay: 0, duration: 4200, drift: 38, rotation: 540, size: 22, symbol: '❀' },
    { left: 11, delay: 620, duration: 4700, drift: -26, rotation: -480, size: 16, symbol: '✿' },
    { left: 19, delay: 180, duration: 3900, drift: 44, rotation: 620, size: 19, symbol: '❁' },
    { left: 28, delay: 920, duration: 4400, drift: -38, rotation: -560, size: 24, symbol: '❀' },
    { left: 37, delay: 360, duration: 5000, drift: 22, rotation: 720, size: 15, symbol: '✿' },
    { left: 46, delay: 80, duration: 4300, drift: -46, rotation: -620, size: 21, symbol: '❁' },
    { left: 55, delay: 760, duration: 4100, drift: 32, rotation: 580, size: 17, symbol: '❀' },
    { left: 64, delay: 260, duration: 4900, drift: -24, rotation: -700, size: 23, symbol: '✿' },
    { left: 73, delay: 1040, duration: 4000, drift: 40, rotation: 520, size: 16, symbol: '❁' },
    { left: 82, delay: 470, duration: 4500, drift: -42, rotation: -600, size: 20, symbol: '❀' },
    { left: 91, delay: 120, duration: 4800, drift: 26, rotation: 680, size: 18, symbol: '✿' },
    { left: 97, delay: 850, duration: 4200, drift: -34, rotation: -540, size: 22, symbol: '❁' },
  ];
  readonly activeJourneyStep = computed(() =>
    Math.min(this.journeySteps.length - 1, Math.floor(this.journeyScrollProgress() * this.journeySteps.length)),
  );
  readonly locationUrl = 'https://www.google.com/maps/search/?api=1&query=Gedung%20Serbaguna%20Bahagia%2C%20Jl.%20Contoh%20Bahagia%20No.%2020%2C%20Jakarta';
  readonly countdown = signal({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  nameInput = '';

  ngOnInit(): void {
    this.syncThemeFromRoute(this.route.snapshot.paramMap.get('themeId'), false);
    this.syncCoupleFromRoute(
      this.route.snapshot.paramMap.get('themeId'),
      this.route.snapshot.paramMap.get('customerSlug'),
    );
    this.themeRouteSubscription = this.route.paramMap.subscribe((params) => {
      this.syncThemeFromRoute(params.get('themeId'));
      this.syncCoupleFromRoute(params.get('themeId'), params.get('customerSlug'));
    });
    this.nameInput = '';
    this.guestName.set('Tamu Undangan');
    this.title.setTitle(`Undangan Pernikahan ${this.coupleName()}`);
    this.updateCountdown();
    this.timer = setInterval(() => this.updateCountdown(), 1000);

    document.body.classList.add('overflow-hidden');
    this.playEnvelopeEntrance();
  }

  private syncCoupleFromRoute(themeSlug: string | null, customerSlug: string | null): void {
    const invitation = findCustomerInvitation(themeSlug, customerSlug);

    if (!invitation) {
      this.brideName.set('Fulanah');
      this.groomName.set('Fulan');
      this.brideFullName.set('Fulanah binti Fulan');
      this.groomFullName.set('Fulan bin Fulan');
      return;
    }

    const [brideName = 'Fulanah', groomName = 'Fulan'] = invitation.coupleName
      .split('&')
      .map((name) => name.trim());
    this.brideName.set(brideName);
    this.groomName.set(groomName);
    this.brideFullName.set(invitation.brideFullName ?? brideName);
    this.groomFullName.set(invitation.groomFullName ?? groomName);
  }

  private syncThemeFromRoute(routeThemeId: string | null, replayEnvelope = true): void {
    const theme = this.themes.find(
      (candidate) => candidate.slug === routeThemeId || candidate.id === routeThemeId,
    );

    if (!theme) {
      void this.router.navigate(['/halaman-tidak-tersedia'], { replaceUrl: true });
      return;
    }

    if (this.activeThemeId() !== theme.id) {
      this.activeThemeId.set(theme.id);
      if (replayEnvelope) this.resetInvitationAfterInactivity();
    }

    try {
      localStorage.setItem(this.themeStorageKey, theme.id);
    } catch {
      // Tema dari URL tetap digunakan meskipun penyimpanan browser tidak tersedia.
    }
  }

  ngOnDestroy(): void {
    this.themeRouteSubscription?.unsubscribe();
    if (this.timer) clearInterval(this.timer);
    if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
    if (this.revealTimer) clearTimeout(this.revealTimer);
    if (this.openingTimer) clearTimeout(this.openingTimer);
    if (this.envelopeLetterReleaseTimer) clearTimeout(this.envelopeLetterReleaseTimer);
    if (this.starTimer) clearTimeout(this.starTimer);
    this.stopOpeningSurprise();
    this.stopFlowerRain();
    if (this.envelopeEntranceFrame !== undefined) cancelAnimationFrame(this.envelopeEntranceFrame);
    if (this.envelopeEntranceStartFrame !== undefined) cancelAnimationFrame(this.envelopeEntranceStartFrame);
    if (this.scrollAnimationFrame !== undefined) cancelAnimationFrame(this.scrollAnimationFrame);
    document.body.classList.remove('overflow-hidden');
  }

  animateStar(): void {
    if (this.starTimer) clearTimeout(this.starTimer);
    this.isStarAnimating.set(false);
    this.isFrameVisible.update((isVisible) => !isVisible);

    requestAnimationFrame(() => {
      this.isStarAnimating.set(true);
      this.starTimer = setTimeout(() => this.isStarAnimating.set(false), 700);
    });
  }

  toggleCouplePose(): void {
    this.isCoupleJoined.update((isJoined) => !isJoined);
  }

  toggleOutfit(): void {
    this.isAlternateOutfit.update((isAlternate) => !isAlternate);
  }

  openGallery(item: GalleryItem): void {
    this.selectedGalleryItem.set(item);
    document.body.classList.add('overflow-hidden');
    this.recordUserActivity();
  }

  closeGallery(): void {
    if (!this.selectedGalleryItem()) return;
    this.selectedGalleryItem.set(null);
    if (this.isOpen()) document.body.classList.remove('overflow-hidden');
    this.recordUserActivity();
  }

  surpriseParticleTransform(particle: SurpriseParticle): string {
    if (!this.isSurpriseActive()) {
      return 'translate3d(0,0,0) scale(0.2) rotate(0deg)';
    }
    return `translate3d(${particle.x}px,${particle.y}px,0) scale(1) rotate(${particle.rotate}deg)`;
  }

  fallingFlowerTransform(flower: FallingFlower): string {
    if (!this.isFlowerRainFalling()) {
      return 'translate3d(0,-18vh,0) rotate(0deg)';
    }
    return `translate3d(${flower.drift}px,118vh,0) rotate(${flower.rotation}deg)`;
  }

  scrollToSection(sectionId: string): void {
    const section = document.getElementById(sectionId);
    if (!section) return;
    this.activeMobileSection.set(sectionId);
    this.recordUserActivity();

    section.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
    this.scheduleScrollEffectsUpdate();
  }

  toggleEnvelopeSide(): void {
    if (this.isOpening()) return;
    this.isEnvelopeBackVisible.update((isBackVisible) => !isBackVisible);
  }

  envelopeFlapClipPath(): string {
    switch (this.activeThemeId()) {
      case 'maroon':
        return 'ellipse(76% 100% at 50% 0%)';
      case 'midnight':
        return 'polygon(0 0, 100% 0, 50% 88%)';
      case 'mocha':
        return 'polygon(0 0, 100% 0, 58% 100%, 42% 100%)';
      case 'ivory':
        return 'polygon(0 0, 100% 0, 100% 28%, 50% 62%, 0 28%)';
      case 'javanese':
        return 'polygon(0 0, 100% 0, 76% 34%, 50% 100%, 24% 34%)';
      case 'boho':
        return 'polygon(0 0, 100% 0, 70% 72%, 53% 100%, 36% 82%)';
      case 'watercolor':
        return 'ellipse(82% 100% at 50% 0%)';
      case 'mihrab':
        return 'polygon(0 0, 100% 0, 100% 24%, 82% 24%, 72% 58%, 50% 100%, 28% 58%, 18% 24%, 0 24%)';
      case 'terracotta':
        return 'polygon(0 0, 100% 0, 100% 18%, 66% 58%, 45% 100%, 0 40%)';
      case 'pearl':
        return 'polygon(0 0, 100% 0, 88% 36%, 50% 84%, 12% 36%)';
      case 'indigo':
        return 'polygon(0 0, 100% 0, 88% 30%, 70% 54%, 50% 78%, 30% 54%, 12% 30%)';
      case 'sundanese':
        return 'polygon(0 0, 100% 0, 92% 24%, 72% 58%, 50% 94%, 28% 58%, 8% 24%)';
      case 'minangkabau':
        return 'polygon(0 0, 100% 0, 88% 24%, 75% 8%, 62% 34%, 50% 12%, 38% 34%, 25% 8%, 12% 24%)';
      case 'dayak':
        return 'polygon(0 0, 100% 0, 86% 32%, 66% 54%, 56% 88%, 44% 100%, 30% 58%, 8% 28%)';
      case 'balinese':
        return 'polygon(0 0, 100% 0, 86% 26%, 72% 20%, 62% 54%, 50% 96%, 38% 54%, 28% 20%, 14% 26%)';
      case 'bugis':
        return 'polygon(0 0, 100% 0, 78% 32%, 58% 78%, 48% 100%, 34% 66%, 12% 30%)';
      case 'betawi':
        return 'polygon(0 0, 100% 0, 100% 20%, 82% 32%, 68% 62%, 50% 92%, 32% 62%, 18% 32%, 0 20%)';
      default:
        return 'polygon(0 0, 100% 0, 50% 100%)';
    }
  }

  envelopePocketClipPath(): string {
    switch (this.activeThemeId()) {
      case 'maroon':
        return 'polygon(0 12%, 50% 52%, 100% 12%, 100% 100%, 0 100%)';
      case 'midnight':
        return 'polygon(0 4%, 50% 42%, 100% 4%, 100% 100%, 0 100%)';
      case 'mocha':
        return 'polygon(0 0, 42% 42%, 58% 42%, 100% 0, 100% 100%, 0 100%)';
      case 'ivory':
        return 'polygon(0 18%, 50% 34%, 100% 18%, 100% 100%, 0 100%)';
      case 'javanese':
        return 'polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%)';
      case 'boho':
        return 'polygon(0 18%, 44% 48%, 100% 0, 100% 100%, 0 100%)';
      case 'watercolor':
        return 'polygon(0 8%, 50% 44%, 100% 8%, 100% 100%, 0 100%)';
      case 'mihrab':
        return 'polygon(0 4%, 24% 30%, 50% 58%, 76% 30%, 100% 4%, 100% 100%, 0 100%)';
      case 'terracotta':
        return 'polygon(0 14%, 44% 48%, 100% 0, 100% 100%, 0 100%)';
      case 'pearl':
        return 'polygon(0 2%, 50% 50%, 100% 2%, 100% 100%, 0 100%)';
      case 'indigo':
        return 'polygon(0 0, 50% 40%, 100% 0, 100% 100%, 0 100%)';
      case 'sundanese':
        return 'polygon(0 8%, 50% 50%, 100% 8%, 100% 100%, 0 100%)';
      case 'minangkabau':
        return 'polygon(0 10%, 22% 0, 50% 52%, 78% 0, 100% 10%, 100% 100%, 0 100%)';
      case 'dayak':
        return 'polygon(0 0, 44% 46%, 56% 54%, 100% 8%, 100% 100%, 0 100%)';
      case 'balinese':
        return 'polygon(0 4%, 18% 20%, 32% 18%, 50% 56%, 68% 18%, 82% 20%, 100% 4%, 100% 100%, 0 100%)';
      case 'bugis':
        return 'polygon(0 14%, 42% 46%, 52% 58%, 100% 0, 100% 100%, 0 100%)';
      case 'betawi':
        return 'polygon(0 8%, 18% 24%, 50% 54%, 82% 24%, 100% 8%, 100% 100%, 0 100%)';
      default:
        return 'polygon(0 0, 50% 46%, 100% 0, 100% 100%, 0 100%)';
    }
  }

  envelopeSealTransform(): string {
    const restingRotation = this.activeThemeId() === 'mocha' ? 45 : 0;
    if (this.isOpening()) {
      return `translateY(0) scale(1.5) rotate(${restingRotation + 16}deg)`;
    }
    if (this.isEnvelopeReady()) {
      return `translateY(0) scale(1) rotate(${restingRotation}deg)`;
    }
    return `translateY(-48px) scale(1.65) rotate(${restingRotation - 18}deg)`;
  }

  envelopeLetterTransform(): string {
    const openingTransforms: Record<ThemeId, string> = {
      emerald: 'translate3d(0,-7.25rem,0) scale(1)',
      maroon: 'translate3d(0,-7.6rem,0) rotate(-1.5deg) scale(1.03)',
      midnight: 'translate3d(0,-6.9rem,0) scale(1.08)',
      mocha: 'translate3d(-1rem,-6.7rem,0) rotate(-4deg) scale(1.02)',
      ivory: 'translate3d(0,-7.1rem,0) scaleY(1.08)',
      javanese: 'translate3d(0,-7.4rem,0) scale(1.02)',
      boho: 'translate3d(1.2rem,-7rem,0) rotate(3deg) scale(1.03)',
      watercolor: 'translate3d(0,-7.8rem,0) rotate(-1deg) scale(1.06)',
      mihrab: 'translate3d(0,-7.35rem,0) scaleY(1.04)',
      terracotta: 'translate3d(-1.1rem,-6.8rem,0) rotate(-3.5deg) scale(1.02)',
      pearl: 'translate3d(0,-7.1rem,0) scale(1.07)',
      indigo: 'translate3d(0,-7.25rem,0) rotate(1.5deg) scale(1.02)',
      sundanese: 'translate3d(-.4rem,-7.35rem,0) rotate(-1deg) scale(1.03)',
      minangkabau: 'translate3d(0,-7.55rem,0) scaleY(1.06)',
      dayak: 'translate3d(.8rem,-7rem,0) rotate(2.5deg) scale(1.02)',
      balinese: 'translate3d(0,-7.4rem,0) scale(.98)',
      bugis: 'translate3d(1rem,-7.1rem,0) rotate(2deg) scale(1.04)',
      betawi: 'translate3d(-.7rem,-7.6rem,0) rotate(-2deg) scale(1.05)',
    };
    const restingTransforms: Record<ThemeId, string> = {
      emerald: 'translate3d(0,2.5rem,0) scale(0.82)',
      maroon: 'translate3d(0,3.2rem,0) rotate(-7deg) scale(0.86)',
      midnight: 'translate3d(0,1.5rem,0) scale(0.58)',
      mocha: 'translate3d(-2.5rem,3rem,0) rotate(-12deg) scale(0.88)',
      ivory: 'translate3d(0,3.5rem,0) scaleY(0.12)',
      javanese: 'translate3d(0,3.4rem,0) scale(0.76)',
      boho: 'translate3d(3.5rem,3rem,0) rotate(12deg) scale(0.82)',
      watercolor: 'translate3d(0,4rem,0) rotate(-6deg) scale(0.72)',
      mihrab: 'translate3d(0,3.6rem,0) scaleY(0.38)',
      terracotta: 'translate3d(-3.5rem,3rem,0) rotate(-13deg) scale(0.86)',
      pearl: 'translate3d(0,2.5rem,0) scale(0.35)',
      indigo: 'translate3d(0,3rem,0) rotate(18deg) scale(0.72)',
      sundanese: 'translate3d(-1.4rem,3.1rem,0) rotate(-5deg) scale(.8)',
      minangkabau: 'translate3d(0,3.4rem,0) scaleY(.5)',
      dayak: 'translate3d(2.2rem,3rem,0) rotate(9deg) scale(.78)',
      balinese: 'translate3d(0,3.5rem,0) scale(.68)',
      bugis: 'translate3d(3rem,2.8rem,0) rotate(7deg) scale(.8)',
      betawi: 'translate3d(-2rem,3.7rem,0) rotate(-8deg) scale(.76)',
    };

    return this.isOpening()
      ? openingTransforms[this.activeThemeId()]
      : restingTransforms[this.activeThemeId()];
  }

  envelopeLetterDurationMs(): number {
    const durations: Record<ThemeId, number> = {
      emerald: 1000,
      maroon: 1250,
      midnight: 1450,
      mocha: 950,
      ivory: 850,
      javanese: 1150,
      boho: 1200,
      watercolor: 1400,
      mihrab: 1100,
      terracotta: 950,
      pearl: 1250,
      indigo: 1100,
      sundanese: 1080,
      minangkabau: 1280,
      dayak: 1160,
      balinese: 1320,
      bugis: 1020,
      betawi: 1220,
    };
    return durations[this.activeThemeId()];
  }

  envelopeLetterDelayMs(): number {
    const delays: Record<ThemeId, number> = {
      emerald: 420,
      maroon: 520,
      midnight: 350,
      mocha: 460,
      ivory: 260,
      javanese: 520,
      boho: 400,
      watercolor: 500,
      mihrab: 450,
      terracotta: 380,
      pearl: 300,
      indigo: 420,
      sundanese: 430,
      minangkabau: 540,
      dayak: 390,
      balinese: 500,
      bugis: 360,
      betawi: 470,
    };
    return delays[this.activeThemeId()];
  }

  envelopeLetterReleaseDelayMs(): number {
    return Math.max(160, this.envelopeLetterDelayMs() - 90);
  }

  envelopeLetterEasing(): string {
    switch (this.activeThemeId()) {
      case 'midnight':
      case 'watercolor':
        return 'cubic-bezier(0.16,1,0.3,1)';
      case 'mocha':
      case 'terracotta':
        return 'cubic-bezier(0.34,1.56,0.64,1)';
      case 'ivory':
        return 'cubic-bezier(0.76,0,0.24,1)';
      case 'pearl':
        return 'cubic-bezier(0.22,1.25,0.36,1)';
      default:
        return 'cubic-bezier(0.22,1,0.36,1)';
    }
  }

  envelopeOpeningDurationMs(): number {
    const durations: Record<ThemeId, number> = {
      emerald: 1800,
      maroon: 2150,
      midnight: 2200,
      mocha: 1800,
      ivory: 1550,
      javanese: 2100,
      boho: 2000,
      watercolor: 2250,
      mihrab: 1950,
      terracotta: 1750,
      pearl: 1950,
      indigo: 1950,
      sundanese: 1900,
      minangkabau: 2150,
      dayak: 2000,
      balinese: 2200,
      bugis: 1850,
      betawi: 2050,
    };
    return durations[this.activeThemeId()];
  }

  envelopeSealClipPath(): string | null {
    switch (this.activeThemeId()) {
      case 'javanese':
        return 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)';
      case 'boho':
        return 'polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0 50%)';
      case 'pearl':
        return 'polygon(50% 0, 88% 18%, 100% 58%, 74% 100%, 26% 100%, 0 58%, 12% 18%)';
      case 'indigo':
        return 'polygon(50% 0, 62% 34%, 100% 50%, 62% 66%, 50% 100%, 38% 66%, 0 50%, 38% 34%)';
      case 'sundanese':
        return 'polygon(50% 0, 86% 22%, 100% 62%, 68% 100%, 22% 90%, 0 48%, 20% 12%)';
      case 'minangkabau':
        return 'polygon(50% 0, 100% 38%, 82% 100%, 18% 100%, 0 38%)';
      case 'dayak':
        return 'polygon(50% 0, 84% 14%, 100% 50%, 82% 88%, 50% 100%, 16% 84%, 0 48%, 18% 14%)';
      case 'balinese':
        return 'polygon(50% 0, 88% 28%, 82% 100%, 18% 100%, 12% 28%)';
      case 'bugis':
        return 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)';
      case 'betawi':
        return 'polygon(50% 0, 64% 34%, 100% 50%, 64% 66%, 50% 100%, 36% 66%, 0 50%, 36% 34%)';
      default:
        return null;
    }
  }

  envelopeSealWidth(): number {
    return ['ivory', 'watercolor', 'terracotta'].includes(this.activeThemeId()) ? 64 : 40;
  }

  envelopeBorderRadius(): string {
    switch (this.activeThemeId()) {
      case 'maroon':
        return '0 0 1rem 1rem';
      case 'midnight':
        return '1.5rem';
      case 'mocha':
        return '0.75rem';
      case 'ivory':
        return '0';
      case 'javanese':
      case 'indigo':
        return '0.5rem';
      case 'boho':
        return '0 4rem 0 3rem';
      case 'watercolor':
        return '8rem 8rem 1.5rem 1.5rem';
      case 'mihrab':
        return '7rem 7rem 0.75rem 0.75rem';
      case 'terracotta':
        return '4rem 0 3rem 0';
      case 'pearl':
        return '2.5rem';
      case 'sundanese':
        return '3.5rem 3.5rem 1rem 1rem';
      case 'minangkabau':
        return '0.75rem';
      case 'dayak':
        return '1rem 3rem 1rem 3rem';
      case 'balinese':
        return '0.5rem 0.5rem 2rem 2rem';
      case 'bugis':
        return '0 3.5rem 0 2rem';
      case 'betawi':
        return '2.5rem 0.75rem 2.5rem 0.75rem';
      default:
        return '0.125rem';
    }
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.recordUserActivity();
    this.scheduleScrollEffectsUpdate();
  }

  @HostListener('window:pointerdown')
  @HostListener('window:keydown')
  onUserActivity(): void {
    this.recordUserActivity();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeGallery();
  }

  @HostListener('document:visibilitychange')
  onVisibilityChange(): void {
    if (document.visibilityState !== 'visible' || !this.isOpen()) return;
    let lastActivityAt = this.lastActivityRecordedAt;
    try {
      lastActivityAt = Number(localStorage.getItem(this.openedAtStorageKey)) || lastActivityAt;
    } catch {
      // Gunakan waktu aktivitas di memori jika penyimpanan browser tidak tersedia.
    }
    if (!lastActivityAt || Date.now() - lastActivityAt >= this.inactivityDurationMs) {
      this.resetInvitationAfterInactivity();
      return;
    }
    this.scheduleInactivityReset(lastActivityAt);
  }

  openInvitation(): void {
    if (this.isOpening()) return;

    const name = this.nameInput.trim().replace(/\s+/g, ' ').slice(0, 120);
    if (!name) {
      this.nameError.set('Silakan tuliskan nama Anda.');
      return;
    }
    this.nameError.set('');
    this.guestName.set(name);
    this.title.setTitle(`Undangan untuk ${name} | ${this.coupleName()}`);
    this.isEnvelopeBackVisible.set(false);
    this.isEnvelopeLetterReleased.set(false);
    this.isOpening.set(true);
    this.isOpen.set(true);
    this.rememberOpenedInvitation(name);
    window.scrollTo({ top: 0 });
    this.revealTimer = setTimeout(() => this.startRevealAnimations(), 50);
    this.playOpeningSurprise();
    this.playFlowerRain();

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const openingDuration = reduceMotion
      ? 0
      : this.envelopeOpeningDurationMs();
    const letterReleaseDelay = reduceMotion ? 0 : this.envelopeLetterReleaseDelayMs();
    this.envelopeLetterReleaseTimer = setTimeout(
      () => this.isEnvelopeLetterReleased.set(true),
      letterReleaseDelay,
    );
    this.openingTimer = setTimeout(() => {
      this.isCoverHidden.set(true);
      document.body.classList.remove('overflow-hidden');
    }, openingDuration);
  }

  private rememberOpenedInvitation(name: string): void {
    const now = Date.now();
    try {
      localStorage.setItem(this.openedAtStorageKey, now.toString());
      localStorage.setItem(this.guestNameStorageKey, name);
    } catch {
      // Undangan tetap dapat dibuka jika penyimpanan browser tidak tersedia.
    }
    this.lastActivityRecordedAt = now;
    this.scheduleInactivityReset(now);
  }

  private recordUserActivity(): void {
    if (!this.isOpen()) return;
    const now = Date.now();
    if (now - this.lastActivityRecordedAt < 1000) return;

    this.lastActivityRecordedAt = now;
    try {
      localStorage.setItem(this.openedAtStorageKey, now.toString());
    } catch {
      // Timer lokal tetap berjalan jika penyimpanan browser tidak tersedia.
    }
    this.scheduleInactivityReset(now);
  }

  private scheduleInactivityReset(lastActivityAt: number): void {
    if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
    const remainingTime = Math.max(0, this.inactivityDurationMs - (Date.now() - lastActivityAt));
    this.inactivityTimer = setTimeout(() => this.resetInvitationAfterInactivity(), remainingTime);
  }

  private resetInvitationAfterInactivity(): void {
    if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
    if (this.openingTimer) clearTimeout(this.openingTimer);
    if (this.envelopeLetterReleaseTimer) clearTimeout(this.envelopeLetterReleaseTimer);
    if (this.revealTimer) clearTimeout(this.revealTimer);
    this.inactivityTimer = undefined;
    this.openingTimer = undefined;
    this.envelopeLetterReleaseTimer = undefined;
    this.revealTimer = undefined;
    this.stopOpeningSurprise();
    this.stopFlowerRain();
    this.lastActivityRecordedAt = 0;

    try {
      localStorage.removeItem(this.openedAtStorageKey);
      localStorage.removeItem(this.guestNameStorageKey);
    } catch {
      // Reset tampilan tetap dilanjutkan jika penyimpanan browser tidak tersedia.
    }

    this.isOpen.set(false);
    this.isOpening.set(false);
    this.isCoverHidden.set(false);
    this.isEnvelopeBackVisible.set(false);
    this.isEnvelopeReady.set(false);
    this.isEnvelopeLetterReleased.set(false);
    this.isCoupleJoined.set(false);
    this.isAlternateOutfit.set(false);
    this.storyScrollProgress.set(0);
    this.galleryScrollProgress.set(0);
    this.verseScrollProgress.set(0);
    this.coupleScrollProgress.set(0);
    this.journeyScrollProgress.set(0);
    this.eventScrollProgress.set(0);
    this.closingScrollProgress.set(0);
    this.selectedGalleryItem.set(null);
    this.activeMobileSection.set('home-section');
    this.guestName.set('Tamu Undangan');
    this.nameInput = '';
    this.nameError.set('');
    this.title.setTitle(`Undangan Pernikahan ${this.coupleName()}`);

    window.scrollTo({ top: 0, behavior: 'auto' });
    document.body.classList.add('overflow-hidden');
    this.playEnvelopeEntrance();
  }

  private playOpeningSurprise(): void {
    this.stopOpeningSurprise();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.surpriseStartTimer = setTimeout(() => {
      this.isSurpriseRendered.set(true);
      this.surpriseFrame = requestAnimationFrame(() => this.isSurpriseActive.set(true));
    }, 980);

    this.surpriseEndTimer = setTimeout(() => this.isSurpriseActive.set(false), 2600);
    this.surpriseRemoveTimer = setTimeout(() => this.isSurpriseRendered.set(false), 3150);
  }

  private stopOpeningSurprise(): void {
    if (this.surpriseStartTimer) clearTimeout(this.surpriseStartTimer);
    if (this.surpriseEndTimer) clearTimeout(this.surpriseEndTimer);
    if (this.surpriseRemoveTimer) clearTimeout(this.surpriseRemoveTimer);
    if (this.surpriseFrame !== undefined) cancelAnimationFrame(this.surpriseFrame);
    this.surpriseStartTimer = undefined;
    this.surpriseEndTimer = undefined;
    this.surpriseRemoveTimer = undefined;
    this.surpriseFrame = undefined;
    this.isSurpriseActive.set(false);
    this.isSurpriseRendered.set(false);
  }

  private playFlowerRain(): void {
    this.stopFlowerRain();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.flowerRainStartTimer = setTimeout(() => {
      this.isFlowerRainRendered.set(true);
      this.flowerRainFrame = requestAnimationFrame(() => this.isFlowerRainFalling.set(true));
    }, 1450);
    this.flowerRainRemoveTimer = setTimeout(() => this.stopFlowerRain(), 7600);
  }

  private stopFlowerRain(): void {
    if (this.flowerRainStartTimer) clearTimeout(this.flowerRainStartTimer);
    if (this.flowerRainRemoveTimer) clearTimeout(this.flowerRainRemoveTimer);
    if (this.flowerRainFrame !== undefined) cancelAnimationFrame(this.flowerRainFrame);
    this.flowerRainStartTimer = undefined;
    this.flowerRainRemoveTimer = undefined;
    this.flowerRainFrame = undefined;
    this.isFlowerRainFalling.set(false);
    this.isFlowerRainRendered.set(false);
  }

  private playEnvelopeEntrance(): void {
    if (this.envelopeEntranceFrame !== undefined) cancelAnimationFrame(this.envelopeEntranceFrame);
    if (this.envelopeEntranceStartFrame !== undefined) cancelAnimationFrame(this.envelopeEntranceStartFrame);
    this.isEnvelopeReady.set(false);

    this.envelopeEntranceFrame = requestAnimationFrame(() => {
      this.envelopeEntranceStartFrame = requestAnimationFrame(() => this.isEnvelopeReady.set(true));
    });
  }

  private scheduleScrollEffectsUpdate(): void {
    if (!this.isOpen() || this.scrollAnimationFrame !== undefined) return;

    this.scrollAnimationFrame = requestAnimationFrame(() => {
      this.scrollAnimationFrame = undefined;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.updateActiveMobileSection();

      const storyScene = document.getElementById('stories-section');
      if (storyScene) {
        const storyBounds = storyScene.getBoundingClientRect();
        const storyScrollableDistance = Math.max(1, storyScene.offsetHeight - window.innerHeight);
        const progress = Math.min(1, Math.max(0, -storyBounds.top / storyScrollableDistance));
        this.storyScrollProgress.set(progress);
      }

      const sectionRevealProgress = (sectionId: string): number => {
        const section = document.getElementById(sectionId);
        if (!section) return 0;
        const bounds = section.getBoundingClientRect();
        const animationStart = window.innerHeight * 0.92;
        const animationEnd = window.innerHeight * 0.28;
        return reduceMotion
          ? (bounds.top <= animationStart ? 1 : 0)
          : Math.min(1, Math.max(0, (animationStart - bounds.top) / (animationStart - animationEnd)));
      };

      this.galleryScrollProgress.set(sectionRevealProgress('gallery-section'));
      this.verseScrollProgress.set(sectionRevealProgress('verse-section'));
      this.coupleScrollProgress.set(sectionRevealProgress('couple-section'));
      this.closingScrollProgress.set(sectionRevealProgress('closing-section'));

      const journeyScene = document.getElementById('journey-scroll-scene');
      if (journeyScene) {
        const sceneBounds = journeyScene.getBoundingClientRect();
        const scrollableDistance = Math.max(1, journeyScene.offsetHeight - window.innerHeight);
        const progress = reduceMotion
          ? (sceneBounds.top <= window.innerHeight * 0.5 ? 1 : 0)
          : Math.min(1, Math.max(0, -sceneBounds.top / scrollableDistance));
        this.journeyScrollProgress.set(progress);
      }

      const eventScene = document.getElementById('event-scroll-scene');
      if (eventScene) {
        const eventBounds = eventScene.getBoundingClientRect();
        const animationStart = window.innerHeight * 0.9;
        const animationEnd = window.innerHeight * 0.18;
        const progress = reduceMotion
          ? (eventBounds.top <= animationStart ? 1 : 0)
          : Math.min(1, Math.max(0, (animationStart - eventBounds.top) / (animationStart - animationEnd)));
        this.eventScrollProgress.set(progress);
      }
    });
  }

  private updateActiveMobileSection(): void {
    const sectionIds = [
      'home-section',
      'stories-section',
      'gallery-section',
      'couple-section',
      'event-scroll-scene',
      'closing-section',
    ];
    const focusLine = window.innerHeight * 0.36;
    let nearestId = sectionIds[0];
    let nearestDistance = Number.POSITIVE_INFINITY;

    sectionIds.forEach((sectionId) => {
      const section = document.getElementById(sectionId);
      if (!section) return;
      const bounds = section.getBoundingClientRect();
      const distance = bounds.top <= focusLine && bounds.bottom >= focusLine
        ? 0
        : Math.min(Math.abs(bounds.top - focusLine), Math.abs(bounds.bottom - focusLine));
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestId = sectionId;
      }
    });
    this.activeMobileSection.set(nearestId);
  }

  journeyPanelProgress(index: number): number {
    const stepDuration = 1 / this.journeySteps.length;
    const start = index * stepDuration * 0.94;
    return Math.min(1, Math.max(0, (this.journeyScrollProgress() - start) / (stepDuration * 0.7)));
  }

  storyCardTransform(index: number): string {
    const position = index - this.activeStoryIndex();
    const clampedPosition = Math.max(-1.18, Math.min(1.18, position));
    const distance = Math.min(1, Math.abs(clampedPosition));
    const scale = 1 - distance;

    switch (this.activeThemeId()) {
      case 'maroon':
        return `translate3d(${clampedPosition * 54}%, ${distance * 88}px, 0) rotate(${clampedPosition * 11}deg) scale(${0.88 + scale * 0.12})`;
      case 'midnight':
        return `translate3d(0, ${clampedPosition * 38}px, 0) rotate(${clampedPosition * -2}deg) scale(${0.72 + scale * 0.28})`;
      case 'mocha':
        return `translate3d(${clampedPosition * 94}%, ${distance * 42}px, 0) rotate(${clampedPosition * -7}deg) scale(${0.91 + scale * 0.09})`;
      case 'ivory':
        return `translate3d(${clampedPosition * 118}%, 0, 0) scale(${0.97 + scale * 0.03})`;
      case 'javanese':
        return `translate3d(0, ${clampedPosition * 104}%, 0) scale(${0.92 + scale * 0.08})`;
      case 'boho':
        return `translate3d(${clampedPosition * 96}%, ${distance * 34}px, 0) rotate(${clampedPosition * 9}deg) scale(${0.9 + scale * 0.1})`;
      case 'watercolor':
        return `translate3d(${clampedPosition * 42}%, ${clampedPosition * 74}px, 0) rotate(${clampedPosition * -3}deg) scale(${0.84 + scale * 0.16})`;
      case 'mihrab':
        return `translate3d(0, ${clampedPosition * 86}%, 0) scaleX(${0.9 + scale * 0.1})`;
      case 'terracotta':
        return `translate3d(${clampedPosition * 82}%, ${distance * 36}px, 0) rotate(${clampedPosition * 13}deg) scale(${0.9 + scale * 0.1})`;
      case 'pearl':
        return `translate3d(0, ${clampedPosition * 18}px, 0) scale(${0.58 + scale * 0.42}) rotate(${clampedPosition * 3}deg)`;
      case 'indigo':
        return `translate3d(${clampedPosition * 62}%, ${distance * 26}px, 0) rotate(${clampedPosition * 24}deg) scale(${0.82 + scale * 0.18})`;
      case 'sundanese':
        return `translate3d(${clampedPosition * 76}%, ${distance * 34}px, 0) rotate(${clampedPosition * -5}deg) scale(${0.9 + scale * 0.1})`;
      case 'minangkabau':
        return `translate3d(0, ${clampedPosition * 96}%, 0) scaleY(${0.76 + scale * 0.24})`;
      case 'dayak':
        return `translate3d(${clampedPosition * 68}%, ${distance * 58}px, 0) rotate(${clampedPosition * 16}deg) scale(${0.84 + scale * 0.16})`;
      case 'balinese':
        return `translate3d(0, ${clampedPosition * 84}%, 0) rotate(${clampedPosition * -7}deg) scale(${0.86 + scale * 0.14})`;
      case 'bugis':
        return `translate3d(${clampedPosition * 124}%, ${clampedPosition * -12}px, 0) rotate(${clampedPosition * 3}deg) scale(${0.95 + scale * 0.05})`;
      case 'betawi':
        return `translate3d(${clampedPosition * 46}%, ${distance * 82}px, 0) rotate(${clampedPosition * -13}deg) scale(${0.82 + scale * 0.18})`;
      default:
        return `translate3d(${clampedPosition * 112}%, ${distance * 24}px, 0) rotate(${clampedPosition * 2.4}deg) scale(${0.945 + scale * 0.055})`;
    }
  }

  galleryItemProgress(index: number): number {
    const start = index * 0.055;
    return Math.min(1, Math.max(0, (this.galleryScrollProgress() - start) / 0.58));
  }

  galleryItemTransform(index: number): string {
    const progress = this.galleryItemProgress(index);
    const hidden = 1 - progress;
    const side = index % 2 === 0 ? -1 : 1;

    switch (this.activeThemeId()) {
      case 'maroon':
        return `translate3d(${side * hidden * 32}px, ${hidden * 72}px, 0) rotate(${side * hidden * 7}deg) scale(${0.9 + progress * 0.1})`;
      case 'midnight':
        return `translate3d(0, ${hidden * 28}px, 0) scale(${0.7 + progress * 0.3})`;
      case 'mocha':
        return `translate3d(${side * hidden * 54}px, ${hidden * 46}px, 0) rotate(${side * (2.2 + hidden * 5)}deg) scale(${0.92 + progress * 0.08})`;
      case 'ivory':
        return `translate3d(${side * hidden * 110}px, 0, 0) scale(${0.98 + progress * 0.02})`;
      case 'javanese':
        return `translate3d(0, ${hidden * 86}px, 0) scaleY(${0.78 + progress * 0.22})`;
      case 'boho':
        return `translate3d(${side * hidden * 62}px, ${hidden * 52}px, 0) rotate(${side * hidden * 10}deg) scale(${0.86 + progress * 0.14})`;
      case 'watercolor':
        return `translate3d(${side * hidden * 24}px, ${hidden * 70}px, 0) rotate(${side * hidden * 3}deg) scale(${0.82 + progress * 0.18})`;
      case 'mihrab':
        return `translate3d(0, ${hidden * 82}px, 0) scaleX(${0.84 + progress * 0.16})`;
      case 'terracotta':
        return `translate3d(${side * hidden * 76}px, ${hidden * 38}px, 0) rotate(${side * (1.2 + hidden * 8)}deg) scale(${0.9 + progress * 0.1})`;
      case 'pearl':
        return `translate3d(0, ${hidden * 36}px, 0) scale(${0.62 + progress * 0.38})`;
      case 'indigo':
        return `translate3d(${side * hidden * 48}px, ${hidden * 42}px, 0) rotate(${side * hidden * 18}deg) scale(${0.8 + progress * 0.2})`;
      case 'sundanese':
        return `translate3d(${side * hidden * 72}px, ${hidden * 34}px, 0) rotate(${side * hidden * -5}deg) scale(${0.9 + progress * 0.1})`;
      case 'minangkabau':
        return `translate3d(0, ${hidden * 94}px, 0) scaleY(${0.72 + progress * 0.28})`;
      case 'dayak':
        return `translate3d(${side * hidden * 58}px, ${hidden * 64}px, 0) rotate(${side * hidden * 16}deg) scale(${0.82 + progress * 0.18})`;
      case 'balinese':
        return `translate3d(0, ${hidden * 82}px, 0) rotate(${side * hidden * -6}deg) scale(${0.84 + progress * 0.16})`;
      case 'bugis':
        return `translate3d(${side * hidden * 132}px, ${hidden * -10}px, 0) rotate(${side * hidden * 3}deg) scale(${0.96 + progress * 0.04})`;
      case 'betawi':
        return `translate3d(${side * hidden * 42}px, ${hidden * 76}px, 0) rotate(${side * hidden * -14}deg) scale(${0.8 + progress * 0.2})`;
      default:
        return `translate3d(0, ${hidden * 64}px, 0) scale(${0.9 + progress * 0.1})`;
    }
  }

  journeySceneUrl(index: number): string {
    const scene = this.journeyScenes[index] ?? this.journeyScenes[0];
    return this.isAlternateOutfit() ? scene.alternate : scene.base;
  }

  galleryImageUrl(item: GalleryItem): string {
    return this.isAlternateOutfit() ? item.alternate : item.src;
  }

  journeySceneOpacity(index: number): number {
    return index === this.activeJourneyStep() ? 1 : 0;
  }

  journeySceneTransform(index: number): string {
    const position = Math.max(-1, Math.min(1, index - this.activeJourneyStep()));
    const inactive = Math.abs(position);
    switch (this.activeThemeId()) {
      case 'maroon':
        return `translate3d(${position * 34}px, ${inactive * 18}px, 0) rotate(${position * 2.8}deg) scale(${1 + inactive * 0.08})`;
      case 'midnight':
        return `translate3d(0, ${position * 12}px, 0) scale(${1 + inactive * 0.16})`;
      case 'mocha':
        return `translate3d(${position * 52}px, 0, 0) rotate(${position * -3.5}deg) scale(${1 + inactive * 0.04})`;
      case 'ivory':
        return `translate3d(0, ${position * 42}px, 0) scale(${1 + inactive * 0.025})`;
      case 'javanese':
        return `translate3d(0, ${position * 18}px, 0) scale(${1 + inactive * 0.12})`;
      case 'boho':
        return `translate3d(${position * 48}px, ${inactive * 12}px, 0) rotate(${position * 4.5}deg) scale(${1 + inactive * 0.06})`;
      case 'watercolor':
        return `translate3d(${position * 18}px, ${position * 28}px, 0) scale(${1 + inactive * 0.13})`;
      case 'mihrab':
        return `translate3d(0, ${position * 48}px, 0) scaleX(${1 + inactive * 0.06})`;
      case 'terracotta':
        return `translate3d(${position * 58}px, ${inactive * 16}px, 0) rotate(${position * 5}deg) scale(${1 + inactive * 0.05})`;
      case 'pearl':
        return `translate3d(0, ${position * 10}px, 0) scale(${1 + inactive * 0.2})`;
      case 'indigo':
        return `translate3d(${position * 34}px, 0, 0) rotate(${position * 8}deg) scale(${1 + inactive * 0.09})`;
      case 'sundanese':
        return `translate3d(${position * 44}px, ${inactive * 10}px, 0) rotate(${position * -2}deg) scale(${1 + inactive * 0.05})`;
      case 'minangkabau':
        return `translate3d(0, ${position * 36}px, 0) scaleY(${1 + inactive * 0.08})`;
      case 'dayak':
        return `translate3d(${position * 56}px, ${inactive * 14}px, 0) rotate(${position * 6}deg) scale(${1 + inactive * 0.1})`;
      case 'balinese':
        return `translate3d(0, ${position * 46}px, 0) rotate(${position * -4}deg) scale(${1 + inactive * 0.08})`;
      case 'bugis':
        return `translate3d(${position * 72}px, ${position * -8}px, 0) rotate(${position * 2}deg) scale(${1 + inactive * 0.03})`;
      case 'betawi':
        return `translate3d(${position * 28}px, ${position * 32}px, 0) rotate(${position * -7}deg) scale(${1 + inactive * 0.12})`;
      default:
        return `translate3d(${position * 24}px, 0, 0) scale(${position === 0 ? 1 : 1.025})`;
    }
  }

  eventCardProgress(index: number): number {
    const start = 0.04 + index * 0.08;
    return Math.min(1, Math.max(0, (this.eventScrollProgress() - start) / 0.46));
  }

  eventCardTransform(direction: -1 | 1, index: number): string {
    const progress = this.eventCardProgress(index);
    const hidden = 1 - progress;
    switch (this.activeThemeId()) {
      case 'maroon':
        return `translate3d(${direction * hidden * 52}px, ${hidden * 72}px, 0) rotate(${direction * hidden * 7}deg) scale(${0.88 + progress * 0.12})`;
      case 'midnight':
        return `translate3d(0, ${hidden * 34}px, 0) scale(${0.68 + progress * 0.32})`;
      case 'mocha':
        return `translate3d(${direction * hidden * 112}px, ${hidden * 20}px, 0) rotate(${direction * hidden * 9}deg) scale(${0.93 + progress * 0.07})`;
      case 'ivory':
        return `translate3d(${direction * hidden * 145}px, 0, 0) scale(${0.98 + progress * 0.02})`;
      case 'javanese':
        return `translate3d(0, ${hidden * 96}px, 0) scaleY(${0.76 + progress * 0.24})`;
      case 'boho':
        return `translate3d(${direction * hidden * 86}px, ${hidden * 44}px, 0) rotate(${direction * hidden * 12}deg) scale(${0.86 + progress * 0.14})`;
      case 'watercolor':
        return `translate3d(${direction * hidden * 32}px, ${hidden * 78}px, 0) scale(${0.75 + progress * 0.25})`;
      case 'mihrab':
        return `translate3d(0, ${hidden * 92}px, 0) scaleX(${0.82 + progress * 0.18})`;
      case 'terracotta':
        return `translate3d(${direction * hidden * 118}px, ${hidden * 26}px, 0) rotate(${direction * hidden * 10}deg) scale(${0.9 + progress * 0.1})`;
      case 'pearl':
        return `translate3d(0, ${hidden * 42}px, 0) scale(${0.58 + progress * 0.42})`;
      case 'indigo':
        return `translate3d(${direction * hidden * 78}px, ${hidden * 38}px, 0) rotate(${direction * hidden * 20}deg) scale(${0.78 + progress * 0.22})`;
      case 'sundanese':
        return `translate3d(${direction * hidden * 84}px, ${hidden * 30}px, 0) rotate(${direction * hidden * -5}deg) scale(${0.9 + progress * 0.1})`;
      case 'minangkabau':
        return `translate3d(0, ${hidden * 104}px, 0) scaleY(${0.7 + progress * 0.3})`;
      case 'dayak':
        return `translate3d(${direction * hidden * 96}px, ${hidden * 52}px, 0) rotate(${direction * hidden * 15}deg) scale(${0.82 + progress * 0.18})`;
      case 'balinese':
        return `translate3d(0, ${hidden * 112}px, 0) rotate(${direction * hidden * -5}deg) scale(${0.78 + progress * 0.22})`;
      case 'bugis':
        return `translate3d(${direction * hidden * 155}px, ${hidden * -8}px, 0) rotate(${direction * hidden * 3}deg) scale(${0.97 + progress * 0.03})`;
      case 'betawi':
        return `translate3d(${direction * hidden * 52}px, ${hidden * 78}px, 0) rotate(${direction * hidden * -12}deg) scale(${0.8 + progress * 0.2})`;
      default:
        return `translate3d(${direction * hidden * 90}px, ${hidden * 24}px, 0) scale(${0.96 + progress * 0.04})`;
    }
  }

  themedSectionTransform(progress: number, section: 'couple' | 'closing'): string {
    const hidden = 1 - progress;
    const closingDirection = section === 'closing' ? -1 : 1;
    switch (this.activeThemeId()) {
      case 'maroon':
        return `translate3d(0, ${hidden * 70}px, 0) rotate(${closingDirection * hidden * 2.5}deg) scale(${0.9 + progress * 0.1})`;
      case 'midnight':
        return `translate3d(0, ${hidden * 20}px, 0) scale(${0.72 + progress * 0.28})`;
      case 'mocha':
        return `translate3d(${closingDirection * hidden * 64}px, ${hidden * 34}px, 0) rotate(${closingDirection * hidden * 6}deg) scale(${0.92 + progress * 0.08})`;
      case 'ivory':
        return `translate3d(${closingDirection * hidden * 120}px, 0, 0)`;
      case 'javanese':
        return `translate3d(0, ${hidden * 92}px, 0) scaleY(${0.78 + progress * 0.22})`;
      case 'boho':
        return `translate3d(${closingDirection * hidden * 52}px, ${hidden * 52}px, 0) rotate(${closingDirection * hidden * 9}deg) scale(${0.86 + progress * 0.14})`;
      case 'watercolor':
        return `translate3d(0, ${hidden * 76}px, 0) scale(${0.78 + progress * 0.22})`;
      case 'mihrab':
        return `translate3d(0, ${hidden * 88}px, 0) scaleX(${0.84 + progress * 0.16})`;
      case 'terracotta':
        return `translate3d(${closingDirection * hidden * 78}px, ${hidden * 32}px, 0) rotate(${closingDirection * hidden * 8}deg) scale(${0.9 + progress * 0.1})`;
      case 'pearl':
        return `translate3d(0, ${hidden * 28}px, 0) scale(${0.62 + progress * 0.38})`;
      case 'indigo':
        return `translate3d(${closingDirection * hidden * 46}px, ${hidden * 40}px, 0) rotate(${closingDirection * hidden * 16}deg) scale(${0.8 + progress * 0.2})`;
      case 'sundanese':
        return `translate3d(${closingDirection * hidden * 62}px, ${hidden * 34}px, 0) rotate(${closingDirection * hidden * -4}deg) scale(${0.9 + progress * 0.1})`;
      case 'minangkabau':
        return `translate3d(0, ${hidden * 104}px, 0) scaleY(${0.72 + progress * 0.28})`;
      case 'dayak':
        return `translate3d(${closingDirection * hidden * 72}px, ${hidden * 54}px, 0) rotate(${closingDirection * hidden * 14}deg) scale(${0.82 + progress * 0.18})`;
      case 'balinese':
        return `translate3d(0, ${hidden * 96}px, 0) rotate(${closingDirection * hidden * -5}deg) scale(${0.8 + progress * 0.2})`;
      case 'bugis':
        return `translate3d(${closingDirection * hidden * 138}px, ${hidden * -6}px, 0) rotate(${closingDirection * hidden * 3}deg) scale(${0.97 + progress * 0.03})`;
      case 'betawi':
        return `translate3d(${closingDirection * hidden * 46}px, ${hidden * 82}px, 0) rotate(${closingDirection * hidden * -11}deg) scale(${0.8 + progress * 0.2})`;
      default:
        return `translate3d(0, ${hidden * 64}px, 0) scale(${0.92 + progress * 0.08})`;
    }
  }

  themeContentTransitionDurationMs(): number {
    const durations: Record<ThemeId, number> = {
      emerald: 680,
      maroon: 920,
      midnight: 1100,
      mocha: 720,
      ivory: 560,
      javanese: 820,
      boho: 900,
      watercolor: 1050,
      mihrab: 860,
      terracotta: 700,
      pearl: 980,
      indigo: 780,
      sundanese: 740,
      minangkabau: 880,
      dayak: 940,
      balinese: 820,
      bugis: 620,
      betawi: 860,
    };
    return durations[this.activeThemeId()];
  }

  homeContentTransform(): string {
    if (this.isCoverHidden()) return 'translate3d(0,0,0) rotate(0deg) scale(1)';
    const entrances: Record<ThemeId, string> = {
      emerald: 'translate3d(0,46px,0) rotate(3deg) scale(0.78)',
      maroon: 'translate3d(0,86px,0) rotate(-2deg) scale(0.88)',
      midnight: 'translate3d(0,0,0) rotate(10deg) scale(0.42)',
      mocha: 'translate3d(-92px,38px,0) rotate(-7deg) scale(0.92)',
      ivory: 'translate3d(140px,0,0) rotate(0deg) scale(0.98)',
      javanese: 'translate3d(0,108px,0) rotate(0deg) scale(0.72)',
      boho: 'translate3d(72px,64px,0) rotate(9deg) scale(0.84)',
      watercolor: 'translate3d(0,76px,0) rotate(-1deg) scale(0.68)',
      mihrab: 'translate3d(0,128px,0) rotate(0deg) scale(0.86)',
      terracotta: 'translate3d(-108px,42px,0) rotate(-8deg) scale(0.9)',
      pearl: 'translate3d(0,18px,0) rotate(0deg) scale(0.36)',
      indigo: 'translate3d(0,64px,0) rotate(18deg) scale(0.62)',
      sundanese: 'translate3d(-72px,48px,0) rotate(-4deg) scale(.84)',
      minangkabau: 'translate3d(0,110px,0) scaleY(.62)',
      dayak: 'translate3d(84px,52px,0) rotate(11deg) scale(.76)',
      balinese: 'translate3d(0,96px,0) rotate(-5deg) scale(.7)',
      bugis: 'translate3d(132px,18px,0) rotate(4deg) scale(.9)',
      betawi: 'translate3d(-64px,82px,0) rotate(-10deg) scale(.78)',
    };
    return entrances[this.activeThemeId()];
  }

  couplePortraitTransform(side: -1 | 1): string {
    if (!this.isCoupleJoined()) {
      const restingRotations: Record<ThemeId, number> = {
        emerald: side * -1.5,
        maroon: side * -2.5,
        midnight: side * 1.2,
        mocha: side * -4,
        ivory: 0,
        javanese: side * -1,
        boho: side * 4.5,
        watercolor: side * -2,
        mihrab: 0,
        terracotta: side * 5,
        pearl: side * -1,
        indigo: side * 6,
        sundanese: side * -2,
        minangkabau: side * 1.5,
        dayak: side * 5,
        balinese: side * -1,
        bugis: side * 3,
        betawi: side * -4,
      };
      return `translate3d(0,0,0) rotate(${restingRotations[this.activeThemeId()]}deg) scale(1)`;
    }

    const exits: Record<ThemeId, string> = {
      emerald: `translate3d(${side * -48}%,32px,0) rotate(${side * 16}deg) scale(.76)`,
      maroon: `translate3d(${side * -34}%,64px,0) rotate(${side * -28}deg) scale(.7)`,
      midnight: `translate3d(0,-26px,0) rotate(${side * 24}deg) scale(.28)`,
      mocha: `translate3d(${side * -64}%,58px,0) rotate(${side * 22}deg) scale(.82)`,
      ivory: `translate3d(${side * 125}%,0,0) rotate(0deg) scale(.96)`,
      javanese: `translate3d(${side * -22}%,92px,0) rotate(${side * 8}deg) scaleY(.45)`,
      boho: `translate3d(${side * -72}%,44px,0) rotate(${side * -36}deg) scale(.68)`,
      watercolor: `translate3d(${side * -18}%,24px,0) rotate(${side * 8}deg) scale(1.24)`,
      mihrab: `translate3d(${side * -28}%,104px,0) rotate(0deg) scaleX(.55)`,
      terracotta: `translate3d(${side * 82}%,52px,0) rotate(${side * 32}deg) scale(.72)`,
      pearl: `translate3d(0,18px,0) rotate(${side * 10}deg) scale(.18)`,
      indigo: `translate3d(${side * -52}%,38px,0) rotate(${side * 58}deg) scale(.6)`,
      sundanese: `translate3d(${side * -58}%,40px,0) rotate(${side * 18}deg) scale(.74)`,
      minangkabau: `translate3d(${side * -28}%,88px,0) rotate(${side * 8}deg) scaleY(.52)`,
      dayak: `translate3d(${side * -76}%,48px,0) rotate(${side * 34}deg) scale(.68)`,
      balinese: `translate3d(${side * -24}%,96px,0) rotate(${side * 12}deg) scale(.58)`,
      bugis: `translate3d(${side * 118}%,12px,0) rotate(${side * 5}deg) scale(.88)`,
      betawi: `translate3d(${side * 62}%,58px,0) rotate(${side * 26}deg) scale(.7)`,
    };
    return exits[this.activeThemeId()];
  }

  coupleJoinedTransform(): string {
    if (this.isCoupleJoined()) return 'translate3d(0,0,0) rotate(0deg) scale(1)';
    const entrances: Record<ThemeId, string> = {
      emerald: 'translate3d(0,52px,0) rotate(12deg) scale(.58)',
      maroon: 'translate3d(0,72px,0) rotate(-8deg) scale(.72)',
      midnight: 'translate3d(0,0,0) rotate(-24deg) scale(.18)',
      mocha: 'translate3d(-62px,48px,0) rotate(-12deg) scale(.76)',
      ivory: 'translate3d(130px,0,0) rotate(0deg) scale(.94)',
      javanese: 'translate3d(0,96px,0) rotate(0deg) scaleY(.38)',
      boho: 'translate3d(76px,54px,0) rotate(18deg) scale(.64)',
      watercolor: 'translate3d(0,60px,0) rotate(-3deg) scale(1.28)',
      mihrab: 'translate3d(0,112px,0) rotate(0deg) scaleX(.58)',
      terracotta: 'translate3d(-92px,42px,0) rotate(-16deg) scale(.72)',
      pearl: 'translate3d(0,16px,0) rotate(0deg) scale(.12)',
      indigo: 'translate3d(0,62px,0) rotate(45deg) scale(.48)',
      sundanese: 'translate3d(-58px,52px,0) rotate(-8deg) scale(.66)',
      minangkabau: 'translate3d(0,108px,0) scaleY(.44)',
      dayak: 'translate3d(78px,44px,0) rotate(24deg) scale(.58)',
      balinese: 'translate3d(0,112px,0) rotate(-10deg) scale(.5)',
      bugis: 'translate3d(142px,10px,0) rotate(6deg) scale(.82)',
      betawi: 'translate3d(-74px,62px,0) rotate(-22deg) scale(.62)',
    };
    return entrances[this.activeThemeId()];
  }

  themeContentEasing(): string {
    switch (this.activeThemeId()) {
      case 'emerald':
        return 'cubic-bezier(0.22,1,0.36,1)';
      case 'maroon':
        return 'cubic-bezier(0.18,0.9,0.3,1.12)';
      case 'midnight':
        return 'cubic-bezier(0.12,0.82,0.18,1)';
      case 'mocha':
        return 'cubic-bezier(0.34,1.25,0.64,1)';
      case 'ivory':
        return 'cubic-bezier(0.76,0,0.24,1)';
      case 'javanese':
        return 'cubic-bezier(0.3,0.7,0.2,1)';
      case 'boho':
        return 'cubic-bezier(0.2,1.18,0.42,1)';
      case 'watercolor':
        return 'cubic-bezier(0.16,1,0.3,1)';
      case 'mihrab':
        return 'cubic-bezier(0.25,0.78,0.28,1)';
      case 'terracotta':
        return 'cubic-bezier(0.38,1.32,0.58,1)';
      case 'pearl':
        return 'cubic-bezier(0.1,0.88,0.22,1.08)';
      case 'indigo':
        return 'cubic-bezier(0.4,0,0.12,1)';
      case 'sundanese':
        return 'cubic-bezier(0.24,0.92,0.3,1)';
      case 'minangkabau':
        return 'cubic-bezier(0.28,0.72,0.18,1)';
      case 'dayak':
        return 'cubic-bezier(0.18,1.16,0.4,1)';
      case 'balinese':
        return 'cubic-bezier(0.32,0.78,0.2,1)';
      case 'bugis':
        return 'cubic-bezier(0.62,0,0.24,1)';
      case 'betawi':
        return 'cubic-bezier(0.2,1.22,0.42,1)';
      default:
        return 'cubic-bezier(0.22,1,0.36,1)';
    }
  }

  eventQrProgress(index: number): number {
    const start = 0.52 + index * 0.07;
    return Math.min(1, Math.max(0, (this.eventScrollProgress() - start) / 0.28));
  }

  eventQrTransform(index: number): string {
    const progress = this.eventQrProgress(index);
    return `scale(${0.82 + progress * 0.18})`;
  }

  eventNoteProgress(): number {
    return Math.min(1, Math.max(0, (this.eventScrollProgress() - 0.72) / 0.22));
  }

  private startRevealAnimations(): void {
    this.scheduleScrollEffectsUpdate();
  }

  private updateCountdown(): void {
    const distance = Math.max(0, new Date('2026-10-20T10:00:00+07:00').getTime() - Date.now());
    this.countdown.set({ days: Math.floor(distance / 86_400_000), hours: Math.floor((distance % 86_400_000) / 3_600_000), minutes: Math.floor((distance % 3_600_000) / 60_000), seconds: Math.floor((distance % 60_000) / 1000) });
  }
}
