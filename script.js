// Highlight the nav link matching the section currently in view.

(function () {
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".top-nav a"));
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute("href").slice(1);
      return document.getElementById(id);
    })
    .filter(Boolean);

  if (!sections.length) return;

  function setActive() {
    var scrollPos = window.scrollY + 80;
    var current = sections[0];

    sections.forEach(function (section) {
      if (section.offsetTop <= scrollPos) {
        current = section;
      }
    });

    navLinks.forEach(function (link) {
      var isActive = link.getAttribute("href") === "#" + current.id;
      link.style.borderBottom = isActive ? "1px solid #111111" : "1px solid transparent";
    });
  }

  window.addEventListener("scroll", setActive, { passive: true });
  setActive();
})();
