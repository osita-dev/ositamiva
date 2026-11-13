/* ============================================
   Christopher Osita - Portfolio
   External script (script.js)

   Features (in order):
   1. Mobile menu toggle
   2. Active nav link while scrolling
   3. Dark / light mode (saved with localStorage)
   4. Scroll reveal animations
   5. Contact form validation
   6. Hero video controls
   7. Typing effect on the hero name
   8. Video modal ("Watch how I built this")
   ============================================ */


/* ---------- 1. MOBILE MENU TOGGLE ---------- */
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

navToggle.addEventListener("click", function () {
  // show or hide the menu
  navMenu.classList.toggle("open");

  // keep the aria attribute correct for screen readers
  if (navMenu.classList.contains("open")) {
    navToggle.setAttribute("aria-expanded", "true");
  } else {
    navToggle.setAttribute("aria-expanded", "false");
  }
});

// When any nav link is clicked, close the menu (mobile)
const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});


/* ---------- 2. ACTIVE NAV LINK WHILE SCROLLING ---------- */
// Watch each section - whichever one is on screen, highlight its link.
// (Smooth scrolling itself comes from CSS: scroll-behavior: smooth)
const sections = document.querySelectorAll("section");

const sectionObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      // get the id of the section in view (home, about, skills...)
      const currentId = entry.target.getAttribute("id");

      // remove .active from all links, add it to the matching one
      navLinks.forEach(function (link) {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + currentId) {
          link.classList.add("active");
        }
      });
    }
  });
}, { threshold: 0.5 });   // trigger when 50% of the section is visible

sections.forEach(function (section) {
  sectionObserver.observe(section);
});


/* ---------- 3. DARK / LIGHT MODE ---------- */
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

// On page load: read the saved theme from localStorage
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  body.classList.add("light-theme");
}

// When button is clicked: swap theme and save the choice
themeToggle.addEventListener("click", function () {
  body.classList.toggle("light-theme");

  if (body.classList.contains("light-theme")) {
    localStorage.setItem("theme", "light");
  } else {
    localStorage.setItem("theme", "dark");
  }
});


/* ---------- 4. SCROLL REVEAL ANIMATIONS ---------- */
// Elements with class "reveal" start invisible (CSS).
// When they enter the screen, we add "visible" - CSS fades them in.
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);   // only animate once
    }
  });
}, { threshold: 0.15 });   // trigger when 15% is visible

revealElements.forEach(function (element) {
  revealObserver.observe(element);
});


/* ---------- 5. CONTACT FORM VALIDATION ---------- */
const contactForm = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const messageError = document.getElementById("messageError");
const successMessage = document.getElementById("successMessage");

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();   // stop the page from reloading

  // clear old messages first
  nameError.textContent = "";
  emailError.textContent = "";
  messageError.textContent = "";
  successMessage.textContent = "";
  nameInput.classList.remove("invalid");
  emailInput.classList.remove("invalid");
  messageInput.classList.remove("invalid");

  let isValid = true;   // assume the form is correct until proven wrong

  // Name must not be empty
  if (nameInput.value.trim() === "") {
    nameError.textContent = "Please enter your name.";
    nameInput.classList.add("invalid");
    isValid = false;
  }

  // Email must not be empty AND must contain @ and .
  const email = emailInput.value.trim();
  if (email === "") {
    emailError.textContent = "Please enter your email.";
    emailInput.classList.add("invalid");
    isValid = false;
  } else if (!email.includes("@") || !email.includes(".")) {
    emailError.textContent = "Please enter a valid email address.";
    emailInput.classList.add("invalid");
    isValid = false;
  }

  // Message must not be empty
  if (messageInput.value.trim() === "") {
    messageError.textContent = "Please enter a message.";
    messageInput.classList.add("invalid");
    isValid = false;
  }

  // Everything passed? Send it through WhatsApp and clear the form
  if (isValid) {
    // pack what the visitor typed into one readable message
    const whatsappMessage =
      "Name: " + nameInput.value.trim() +
      "\nEmail: " + emailInput.value.trim() +
      "\nMessage: " + messageInput.value.trim();

    // build the WhatsApp link and open it in a new tab
    const whatsappLink = "https://wa.me/2347016361129?text=" +
      encodeURIComponent(whatsappMessage);
    window.open(whatsappLink, "_blank");

    successMessage.textContent = "Thanks! Opening WhatsApp to send your message.";
    contactForm.reset();
  }
});


/* ---------- 6. HERO VIDEO CONTROLS ---------- */
const heroVideo = document.getElementById("heroVideo");
const playPauseBtn = document.getElementById("playPauseBtn");
const muteBtn = document.getElementById("muteBtn");

// Play / Pause button
playPauseBtn.addEventListener("click", function () {
  if (heroVideo.paused) {
    heroVideo.play().catch(function () {
      // if the video file is missing, do nothing
    });
    playPauseBtn.innerHTML = "&#10074;&#10074;";   // pause icon
  } else {
    heroVideo.pause();
    playPauseBtn.innerHTML = "&#9654;";            // play icon
  }
});

// Mute / Unmute button (video starts muted by default)
muteBtn.addEventListener("click", function () {
  heroVideo.muted = !heroVideo.muted;   // flip true <-> false

  if (heroVideo.muted) {
    muteBtn.innerHTML = "&#128263;";    // muted icon
  } else {
    muteBtn.innerHTML = "&#128266;";    // sound on icon
  }
});


/* ---------- 7. TYPING EFFECT ON HERO NAME ---------- */
const heroName = document.getElementById("heroName");
const nameText = heroName.textContent;   // read the real name first
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduceMotion) {
  // visitor asked their system for less motion: show the name instantly
  heroName.textContent = nameText;
} else {
  heroName.textContent = "";            // clear it, then type it back

  let letterIndex = 0;
  const typeTimer = setInterval(function () {
    heroName.textContent += nameText.charAt(letterIndex);
    letterIndex++;

    if (letterIndex >= nameText.length) {
      clearInterval(typeTimer);         // stop when finished
    }
  }, 110);                              // one letter every 110ms
}


/* ---------- 8. VIDEO MODAL ("Watch how I built this") ---------- */
const openVideoBtn = document.getElementById("openVideoBtn");
const videoModal = document.getElementById("videoModal");
const closeVideoBtn = document.getElementById("closeVideoBtn");
const buildStoryVideo = document.getElementById("buildStoryVideo");

function openModal() {
  videoModal.classList.add("open");
  videoModal.setAttribute("aria-hidden", "false");
  buildStoryVideo.play().catch(function () {
    // if the video file is missing, the modal still opens
  });
  closeVideoBtn.focus();               // keyboard can reach the close button
}

function closeModal() {
  videoModal.classList.remove("open");
  videoModal.setAttribute("aria-hidden", "true");
  buildStoryVideo.pause();             // stop the sound too
  openVideoBtn.focus();                // focus goes back to where it was
}

// 1. Click the About button -> open
openVideoBtn.addEventListener("click", openModal);

// 2. Click the X button -> close
closeVideoBtn.addEventListener("click", closeModal);

// 3. Click the dark area AROUND the video -> close
videoModal.addEventListener("click", function (event) {
  if (event.target === videoModal) {
    closeModal();
  }
});

// 4. Press the Escape key -> close
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && videoModal.classList.contains("open")) {
    closeModal();
  }
});
