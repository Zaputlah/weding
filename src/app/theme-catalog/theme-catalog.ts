import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

interface CatalogTheme {
  slug: string;
  name: string;
  concept: string;
  description: string;
  deep: string;
  dark: string;
  primary: string;
  accent: string;
  cream: string;
  asset?: string;
}

@Component({
  selector: 'app-theme-catalog',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './theme-catalog.html',
})
export class ThemeCatalog implements OnInit {
  private readonly title = inject(Title);

  readonly themes: readonly CatalogTheme[] = [
    {
      slug: 'klasik-zamrud',
      name: 'Klasik Zamrud',
      concept: 'Geometris elegan',
      description: 'Nuansa zamrud yang tenang dengan aksen emas klasik.',
      deep: '#183128',
      dark: '#28493b',
      primary: '#315c4a',
      accent: '#d8b66f',
      cream: '#f5e6c5',
    },
    {
      slug: 'mawar-andalusia',
      name: 'Mawar Andalusia',
      concept: 'Floral romantis',
      description: 'Maroon hangat, lengkung Andalusia, dan detail bunga lembut.',
      deep: '#35171d',
      dark: '#55252f',
      primary: '#6f3542',
      accent: '#d9b778',
      cream: '#f6e5cf',
    },
    {
      slug: 'langit-qamar',
      name: 'Langit Qamar',
      concept: 'Celestial Islami',
      description: 'Biru malam yang teduh dengan bulan dan kilau keemasan.',
      deep: '#111f33',
      dark: '#1d3553',
      primary: '#294a6c',
      accent: '#d6b873',
      cream: '#f2e7cd',
    },
    {
      slug: 'kebun-senja',
      name: 'Kebun Senja',
      concept: 'Rustic botanikal',
      description: 'Palet mocha bersahaja dengan sentuhan tanaman natural.',
      deep: '#2d251f',
      dark: '#493b31',
      primary: '#625142',
      accent: '#d0a660',
      cream: '#f2e3c8',
    },
    {
      slug: 'ivory-editorial',
      name: 'Ivory Editorial',
      concept: 'Minimalis modern',
      description: 'Tata letak editorial yang bersih, lembut, dan lapang.',
      deep: '#2d2a27',
      dark: '#514a43',
      primary: '#766d63',
      accent: '#c8a96d',
      cream: '#f8f3ea',
    },
    {
      slug: 'pusaka-jawa',
      name: 'Pusaka Jawa',
      concept: 'Tradisional klasik',
      description: 'Warna sogan dan ornamen tradisional dalam nuansa hangat.',
      deep: '#2b1712',
      dark: '#4b261b',
      primary: '#70442d',
      accent: '#d9b45d',
      cream: '#f2dfb5',
    },
    {
      slug: 'dark-boho',
      name: 'Dark Boho',
      concept: 'Moody kontemporer',
      description: 'Gelap, modern, dan organik dengan garis yang ekspresif.',
      deep: '#10100f',
      dark: '#20211f',
      primary: '#343733',
      accent: '#c4a262',
      cream: '#e8dfcc',
    },
    {
      slug: 'chateau-watercolor',
      name: 'Château Watercolor',
      concept: 'Lukisan taman klasik',
      description: 'Sapuan watercolor lembut dengan karakter taman château.',
      deep: '#32464a',
      dark: '#4d686a',
      primary: '#829a96',
      accent: '#d7a99e',
      cream: '#f7eee5',
    },
    {
      slug: 'mihrab-sage',
      name: 'Mihrab Sage',
      concept: 'Arsitektur Islami',
      description: 'Sage yang menenangkan dengan siluet mihrab berlapis.',
      deep: '#183b35',
      dark: '#28534a',
      primary: '#53776c',
      accent: '#d1b878',
      cream: '#f3e8cc',
    },
    {
      slug: 'surat-terracotta',
      name: 'Surat Terracotta',
      concept: 'Handmade hangat',
      description: 'Rasa buatan tangan dengan warna tanah yang akrab.',
      deep: '#40251f',
      dark: '#654036',
      primary: '#956453',
      accent: '#d6aa69',
      cream: '#f4e1c5',
    },
    {
      slug: 'mutiara-nikah',
      name: 'Mutiara Nikah',
      concept: 'Elegan lembut',
      description: 'Abu kebiruan dan kilau mutiara untuk kesan anggun.',
      deep: '#303c45',
      dark: '#4c5b64',
      primary: '#7c8b91',
      accent: '#dbc08c',
      cream: '#f6ead4',
    },
    {
      slug: 'naskah-nusantara',
      name: 'Naskah Nusantara',
      concept: 'Nusantara Islami',
      description: 'Indigo, motif geometris, dan rasa naskah klasik.',
      deep: '#18263a',
      dark: '#293e59',
      primary: '#405b78',
      accent: '#d5ad65',
      cream: '#f1dfbd',
    },
    {
      slug: 'priangan-sunda',
      name: 'Priangan Sunda',
      concept: 'Sunda botanikal',
      description: 'Hijau Priangan, anyaman geometris, dan sulur daun yang teduh.',
      deep: '#183b34',
      dark: '#2a574b',
      primary: '#557f6f',
      accent: '#d8b66b',
      cream: '#f5e8c8',
      asset: '/assets/scrapbook-priangan-sunda.svg',
    },
    {
      slug: 'ranah-minang',
      name: 'Ranah Minang',
      concept: 'Songket dan gonjong',
      description: 'Merah ranah, kilau songket, dan garis gonjong yang berwibawa.',
      deep: '#241719',
      dark: '#4a2025',
      primary: '#7e3035',
      accent: '#dfb84f',
      cream: '#f6e8c5',
      asset: '/assets/scrapbook-ranah-minang.svg',
    },
    {
      slug: 'rimba-dayak',
      name: 'Rimba Dayak',
      concept: 'Ukir Borneo',
      description: 'Hijau rimba, warna tembaga, dan pola ukir organik Kalimantan.',
      deep: '#172b27',
      dark: '#29453d',
      primary: '#496958',
      accent: '#dda85a',
      cream: '#f4e4c5',
      asset: '/assets/scrapbook-rimba-dayak.svg',
    },
    {
      slug: 'bali-agung',
      name: 'Bali Agung',
      concept: 'Gerbang dan ukiran Bali',
      description: 'Palet tanah hangat dengan ritme gerbang dan relief berlapis.',
      deep: '#281b18',
      dark: '#4b3028',
      primary: '#795044',
      accent: '#dcb259',
      cream: '#f4e4c1',
      asset: '/assets/scrapbook-bali-agung.svg',
    },
    {
      slug: 'pinisi-bugis',
      name: 'Pinisi Bugis',
      concept: 'Maritim Sulawesi',
      description: 'Biru laut, garis layar pinisi, dan gelombang yang dinamis.',
      deep: '#102d3a',
      dark: '#17485b',
      primary: '#2f6b79',
      accent: '#e0b765',
      cream: '#f3e8ce',
      asset: '/assets/scrapbook-pinisi-bugis.svg',
    },
    {
      slug: 'kembang-betawi',
      name: 'Kembang Betawi',
      concept: 'Semarak Betawi',
      description: 'Hijau, koral, dan kuning dalam susunan kembang yang ceria.',
      deep: '#173b3a',
      dark: '#215c58',
      primary: '#2f8176',
      accent: '#e7b955',
      cream: '#f8e9ca',
      asset: '/assets/scrapbook-kembang-betawi.svg',
    },
  ];

  ngOnInit(): void {
    this.title.setTitle('Katalog Tema Undangan Dinda & Arga');
    document.body.classList.remove('overflow-hidden');
  }

  scrapbookBackground(theme: CatalogTheme): string {
    return theme.asset ?? `/assets/scrapbook-${theme.slug}.jpg`;
  }
}
