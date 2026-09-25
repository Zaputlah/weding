import { Component, Input, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-unavailable-page',
  standalone: true,
  templateUrl: './unavailable-page.html',
})
export class UnavailablePage implements OnInit {
  private readonly title = inject(Title);
  private readonly route = inject(ActivatedRoute);
  @Input() status: 'selesai' | 'tidak-ditemukan' | null = null;
  eyebrow = 'Halaman tidak tersedia';
  heading = 'Undangan Tidak Tersedia';
  description =
    'Alamat undangan yang Anda buka belum lengkap, tidak terdaftar, atau sudah tidak tersedia. Pastikan Anda menggunakan tautan undangan yang diberikan.';

  ngOnInit(): void {
    const pageStatus = this.status ?? this.route.snapshot.queryParamMap.get('status');

    if (pageStatus === 'selesai') {
      this.eyebrow = 'Masa tayang selesai';
      this.heading = 'Undangan Telah Selesai';
      this.description =
        'Masa tayang undangan ini telah berakhir. Jazakumullāhu khairan atas doa dan perhatian yang telah diberikan.';
    }

    this.title.setTitle(this.heading);
    document.body.classList.remove('overflow-hidden');
  }
}
