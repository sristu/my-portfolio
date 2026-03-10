// Typing animation
const typedText = document.getElementById("typed-text");
const roles = ["Freelance Web Developer", "AI Builder", "Problem Solver"];
let roleIndex = 0;
let charIndex = 0;
let typingForward = true;

function type() {
  const current = roles[roleIndex];
  if (typingForward) {
    typedText.textContent = current.slice(0, charIndex++);
    if (charIndex === current.length + 1) {
      typingForward = false;
      setTimeout(type, 1000);
      return;
    }
  } else {
    typedText.textContent = current.slice(0, charIndex--);
    if (charIndex === 0) {
      typingForward = true;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(type, typingForward ? 80 : 40);
}

// Dark / light mode
const modeToggle = document.getElementById("modeToggle");
const storedTheme = localStorage.getItem("theme");
if (storedTheme) document.documentElement.dataset.theme = storedTheme;

modeToggle.addEventListener("click", () => {
  const current = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  if (current === "light") {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = "dark";
  }
  localStorage.setItem("theme", current === "light" ? "" : "dark");
});

// Mobile nav
const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("nav");
hamburger.addEventListener("click", () => nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => nav.classList.remove("open"))
);

// Smooth scroll (better timing than CSS)
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
  });
});

// Scroll reveal
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".section, .card, .service-card, .skill-card, .project-card, .testimonial-card, .contact-card, .resume-card").forEach((el) => {
  el.classList.add("reveal");
  observer.observe(el);
});

// Projects with localStorage
const projectGrid = document.getElementById("projectGrid");
const projectForm = document.getElementById("projectForm");
const projectName = document.getElementById("projectName");
const projectLink = document.getElementById("projectLink");
const projectCategory = document.getElementById("projectCategory");
const filterButtons = document.querySelectorAll(".filter-btn");

const seedProjects = [
  { name: "NovaPay Landing", link: "https://example.com/novapay", category: "Landing Pages" },
  { name: "Aster Clinics", link: "https://example.com/aster", category: "Business Sites" },
  { name: "Minimal Portfolio", link: "https://example.com/portfolio", category: "Portfolio Sites" },
];

function loadProjects() {
  const saved = localStorage.getItem("projects");
  if (saved) return JSON.parse(saved);
  localStorage.setItem("projects", JSON.stringify(seedProjects));
  return seedProjects;
}

let projects = loadProjects();
let activeFilter = "All";

function saveProjects() {
  localStorage.setItem("projects", JSON.stringify(projects));
}

function projectCard(project) {
  const card = document.createElement("div");
  card.className = "project-card reveal";
  card.innerHTML = `
    <div class="project-meta">
      <h4>${project.name}</h4>
      <span class="project-tag">${project.category}</span>
    </div>
    <p class="muted">Crafted for performance and polish.</p>
    <div class="cta">
      <a class="btn ghost" href="${project.link}" target="_blank" rel="noopener">Live Website</a>
    </div>
  `;
  observer.observe(card);
  return card;
}

function renderProjects() {
  projectGrid.innerHTML = "";
  projects
    .filter((p) => activeFilter === "All" || p.category === activeFilter)
    .forEach((p) => projectGrid.appendChild(projectCard(p)));
}

projectForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = projectName.value.trim();
  const link = projectLink.value.trim();
  const category = projectCategory.value;
  if (!name || !link) return;
  projects.unshift({ name, link, category });
  saveProjects();
  renderProjects();
  projectForm.reset();
});

filterButtons.forEach((btn) =>
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.filter;
    renderProjects();
  })
);

// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Start
type();
renderProjects();
