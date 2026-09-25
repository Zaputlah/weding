import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Invitation } from '../invitation/invitation';
import { findCustomerInvitation } from '../invitation-access';
import { UnavailablePage } from '../unavailable-page/unavailable-page';

type CustomerPageState = 'loading' | 'active' | 'expired-notice' | 'expired' | 'not-found';

@Component({
  selector: 'app-customer-invitation-page',
  standalone: true,
  imports: [Invitation, UnavailablePage],
  template: `
    @if (state === 'active') {
      <app-invitation />
    } @else if (state === 'expired-notice') {
      <main
        class="relative grid min-h-screen place-items-center overflow-hidden bg-[#1f4135] px-5 py-10 text-center"
      >
        <div
          class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(213,177,109,0.24),transparent_30%),radial-gradient(circle_at_80%_85%,rgba(142,62,76,0.28),transparent_34%),linear-gradient(145deg,#17372d,#2b5143_52%,#183a30)]"
          aria-hidden="true"
        ></div>
        <div
          class="pointer-events-none absolute -top-32 -left-28 size-80 rounded-full border border-[#ead5aa]/15 sm:size-[28rem]"
          aria-hidden="true"
        ></div>
        <div
          class="pointer-events-none absolute -right-24 -bottom-32 size-72 rounded-full border border-[#ead5aa]/15 sm:size-96"
          aria-hidden="true"
        ></div>

        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="expired-notice-title"
          aria-describedby="expired-notice-description"
          class="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-[#dfc38c]/60 bg-[#fffaf0] px-6 py-10 shadow-[0_30px_100px_rgba(7,24,18,0.48)] sm:px-12 sm:py-12"
        >
          <svg
            class="pointer-events-none absolute -top-10 -left-10 size-36 text-[#b88b49]/10"
            viewBox="0 0 120 120"
            fill="none"
            stroke="currentColor"
            stroke-width="1.2"
            aria-hidden="true"
          >
            <path d="M15 105C29 76 48 54 84 19M31 80c-18-1-24-12-20-26 16 1 25 10 20 26Zm22-23c-7-17 0-29 14-34 7 14 3 26-14 34Zm7 20c16-7 29-2 35 11-13 9-27 5-35-11Z" />
          </svg>
          <svg
            class="pointer-events-none absolute -right-9 -bottom-10 size-36 rotate-180 text-[#b88b49]/10"
            viewBox="0 0 120 120"
            fill="none"
            stroke="currentColor"
            stroke-width="1.2"
            aria-hidden="true"
          >
            <path d="M15 105C29 76 48 54 84 19M31 80c-18-1-24-12-20-26 16 1 25 10 20 26Zm22-23c-7-17 0-29 14-34 7 14 3 26-14 34Zm7 20c16-7 29-2 35 11-13 9-27 5-35-11Z" />
          </svg>

          <div
            class="relative mx-auto mb-6 grid size-20 place-items-center rounded-full border border-[#e3c991] bg-[#24483b] text-[#f7e7c2] shadow-[0_12px_32px_rgba(36,72,59,0.28)]"
          >
            <span class="absolute inset-2 rounded-full border border-[#e3c991]/35"></span>
            <svg
              class="size-9"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.35"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 7.5 12 13l8-5.5M5.5 6h13A1.5 1.5 0 0 1 20 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5v-9A1.5 1.5 0 0 1 5.5 6Z" />
              <path stroke-linecap="round" d="m4.5 17 5.3-5M19.5 17l-5.3-5" />
            </svg>
          </div>

          <p class="relative mb-3 text-[10px] font-semibold tracking-[0.32em] text-[#9b753d] uppercase">
            Sebuah pesan untuk Anda
          </p>
          <h1
            id="expired-notice-title"
            class="relative [font-family:Cormorant_Garamond,serif] text-4xl leading-none font-semibold text-[#263d34] sm:text-5xl"
          >
            Jazakumullāhu Khairan
          </h1>

          <div class="relative mx-auto my-6 flex max-w-56 items-center gap-3 text-[#bd9659]/55" aria-hidden="true">
            <span class="h-px flex-1 bg-current"></span>
            <span class="size-2 rotate-45 border border-current"></span>
            <span class="h-px flex-1 bg-current"></span>
          </div>

          <p
            id="expired-notice-description"
            class="relative mx-auto max-w-md text-sm leading-7 text-[#71675c] sm:text-base sm:leading-8"
          >
            Terima kasih telah menghadiri dan memenuhi undangan kami. Saat ini masa tayang
            undangan digital telah selesai.
          </p>

          <button
            type="button"
            autofocus
            class="relative mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#24483b] px-7 py-3 text-xs font-semibold tracking-[0.14em] text-[#f8e8c6] uppercase shadow-[0_12px_30px_rgba(36,72,59,0.24)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#315c4a] hover:shadow-[0_16px_36px_rgba(36,72,59,0.3)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#bd9659]"
            (click)="showExpiredPage()"
          >
            Lihat Pesan Penutup
            <span aria-hidden="true">→</span>
          </button>
        </section>
      </main>
    } @else if (state === 'expired') {
      <app-unavailable-page status="selesai" />
    } @else if (state === 'not-found') {
      <app-unavailable-page status="tidak-ditemukan" />
    }
  `,
})
export class CustomerInvitationPage implements OnInit {
  private readonly route = inject(ActivatedRoute);

  state: CustomerPageState = 'loading';

  ngOnInit(): void {
    const invitation = findCustomerInvitation(
      this.route.snapshot.paramMap.get('themeId'),
      this.route.snapshot.paramMap.get('customerSlug'),
    );

    if (!invitation) {
      this.state = 'not-found';
      return;
    }

    if (Date.now() > Date.parse(invitation.expiresAt)) {
      document.body.classList.add('overflow-hidden');
      this.state = 'expired-notice';
      return;
    }

    this.state = 'active';
  }

  showExpiredPage(): void {
    this.state = 'expired';
  }
}
