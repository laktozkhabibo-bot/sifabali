/**
 * Intro screen: a hexagon cell fills with honey, then fades away — pure CSS, 0.9s in total,
 * shown only on the first page view of a browser session. It never blocks the page:
 * the site renders underneath and the overlay ignores clicks while fading.
 */
const HEX = "M100 6 L181 53 L181 147 L100 194 L19 147 L19 53 Z";

// Runs before paint: hides the intro if it was already shown in this session
const script = `try{if(sessionStorage.getItem("sb-intro")){document.documentElement.classList.add("sb-intro-seen")}else{sessionStorage.setItem("sb-intro","1")}}catch(e){}`;

export function Preloader() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: script }} />
      <div id="sb-preloader" aria-hidden className="sb-preloader fixed inset-0 z-[100] grid place-items-center bg-charcoal">
        <svg viewBox="0 0 200 200" className="h-28 w-28">
          <defs>
            <clipPath id="pre-hex">
              <path d={HEX} />
            </clipPath>
            <linearGradient id="pre-honey" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#F6C453" />
              <stop offset="1" stopColor="#C27612" />
            </linearGradient>
          </defs>
          <g clipPath="url(#pre-hex)">
            <rect width="200" height="200" fill="#27231E" />
            <rect className="sb-preloader-fill" x="0" y="0" width="200" height="200" fill="url(#pre-honey)" />
          </g>
          <path d={HEX} fill="none" stroke="#E0961A" strokeWidth="5" />
        </svg>
      </div>
    </>
  );
}
