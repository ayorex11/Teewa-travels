// Teewa Travels & Tour — shared site behavior
const TEEWA_WA_NUMBER = '2347086507807';

// The header is `fixed` and its height differs slightly page to page (the
// top info bar only shows at lg+), so measure it and push <main> down by
// exactly that much rather than trusting a hardcoded pt-* class.
(function () {
  const header = document.querySelector('header');
  const main = document.querySelector('main');
  if (!header || !main) return;

  function syncHeaderOffset() {
    main.style.paddingTop = header.offsetHeight + 'px';
  }

  syncHeaderOffset();
  window.addEventListener('load', syncHeaderOffset);
  window.addEventListener('resize', syncHeaderOffset);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncHeaderOffset);
  }
})();

// Mobile nav drawer toggle
(function () {
  const menuBtn = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (!menuBtn || !mobileNav) return;

  menuBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    const expanded = mobileNav.classList.contains('open');
    menuBtn.setAttribute('aria-expanded', String(expanded));
    menuBtn.querySelector('.material-symbols-outlined').textContent = expanded ? 'close' : 'menu';
    window.dispatchEvent(new Event('resize')); // drawer changes header height
  });
})();

// Hero "quick dispatch" tabs (Flights / Visa / Vacation / Airport) + the
// quick-inquiry form beneath them. Selecting a tab now actually changes what
// gets sent to WhatsApp — it used to just toggle the active-tab styling
// while the message always said "flight & visa quote" no matter what.
(function () {
  const tabs = document.querySelectorAll('.dispatch-tab');
  const form = document.getElementById('quick-inquiry-form');
  if (!tabs.length || !form) return;

  let selectedService = tabs[0].dataset.service || 'a flight';

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.remove('bg-surface-container-lowest/20', 'text-tertiary-fixed', 'font-bold');
        t.classList.add('text-primary-fixed-dim');
      });
      tab.classList.add('bg-surface-container-lowest/20', 'text-tertiary-fixed', 'font-bold');
      tab.classList.remove('text-primary-fixed-dim');
      selectedService = tab.dataset.service || selectedService;
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const dest = document.getElementById('quick-dest');
    const date = document.getElementById('quick-date');
    const destText = (dest && dest.value) || 'my journey';
    const dateText = (date && date.value) || 'an upcoming date';
    const message = `Hi Teewa Travels, I need ${selectedService} for ${destText}, traveling on ${dateText}.`;
    window.open(`https://wa.me/${TEEWA_WA_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  });
})();

// Contact page "Request Expedited Callback" form — this used to just show an
// alert() and go nowhere. Since the site has no backend, compose the details
// into a WhatsApp message instead so it actually reaches the team.
(function () {
  const form = document.getElementById('callback-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = form.querySelectorAll('input, select, textarea');
    const [name, phone, destination] = fields;
    const service = form.querySelector('select');
    const notes = form.querySelector('textarea');

    const lines = [
      'Hello Teewa Travels, I would like to request a callback.',
      `Name: ${name && name.value ? name.value : '-'}`,
      `WhatsApp/Phone: ${phone && phone.value ? phone.value : '-'}`,
      `Destination: ${destination && destination.value ? destination.value : '-'}`,
      `Service: ${service ? service.options[service.selectedIndex].text : '-'}`,
      `Notes: ${notes && notes.value ? notes.value : '-'}`,
    ];
    const text = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/${TEEWA_WA_NUMBER}?text=${text}`, '_blank');
    form.reset();
  });
})();

// Footer "Curated Private Gazette" newsletter form — static site, no email
// backend configured, so route it to a pre-filled mailto instead of doing
// nothing silently. Swap this for a real email-list service when you have one.
(function () {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const email = input && input.value ? input.value : '';
    const subject = encodeURIComponent('Add me to the Teewa Travels list');
    const body = encodeURIComponent(`Please add this email to your updates list: ${email}`);
    window.location.href = `mailto:teewatravels17@gmail.com?subject=${subject}&body=${body}`;
    form.reset();
  });
})();
