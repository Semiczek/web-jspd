// Insert inside .diri-portrait. Decorative only; no IDs or runtime listeners.
export const diriCinemaMarkup = `
  <div class="diri-cinema" aria-hidden="true">
    <div class="diri-cinema-floor"></div>
    <div class="diri-cinema-landing"></div>
    <svg class="diri-cinema-traces" viewBox="0 0 600 600" fill="none" focusable="false" aria-hidden="true">
      <g class="diri-cinema-track diri-cinema-track-main">
        <path pathLength="1" d="M 75 360 C 17 267 121 135 287 108 C 454 81 589 151 555 260 C 522 369 368 468 207 457 C 132 452 91 410 75 360 Z"/>
      </g>
      <g class="diri-cinema-track diri-cinema-track-cross">
        <path pathLength="1" d="M 161 92 C 247 28 424 120 491 273 C 558 426 489 561 371 528 C 253 495 128 342 116 214 C 110 154 129 116 161 92 Z"/>
      </g>
      <g class="diri-cinema-track diri-cinema-track-signal">
        <path pathLength="1" d="M 46 454 L 132 454 L 177 499 L 276 499 M 554 167 L 494 167 L 450 123 L 358 123"/>
      </g>
      <g class="diri-cinema-nodes">
        <circle cx="46" cy="454" r="4"/>
        <circle cx="276" cy="499" r="4"/>
        <circle cx="554" cy="167" r="4"/>
        <circle cx="358" cy="123" r="4"/>
      </g>
    </svg>
  </div>`;
