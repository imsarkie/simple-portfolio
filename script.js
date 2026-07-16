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
      link.classList.toggle("active", isActive);
    });
  }

  window.addEventListener("scroll", setActive, { passive: true });
  setActive();
})();

// Dark mode toggle. The initial theme is already set by an inline
// script in <head> (before first paint) to avoid a flash — this just
// wires up the button and persists the user's explicit choice.

(function () {
  var root = document.documentElement;
  var toggleBtn = document.getElementById("theme-toggle");
  if (!toggleBtn) return;

  function render(theme) {
    toggleBtn.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );
  }

  render(root.getAttribute("data-theme") === "dark" ? "dark" : "light");

  toggleBtn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    render(next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
  });
})();

// Hide the header on scroll-down, reveal it on scroll-up.

(function () {
  var header = document.querySelector(".site-header");
  if (!header) return;

  var lastY = window.scrollY;
  var headerHeight = header.offsetHeight;

  function onScroll() {
    var y = window.scrollY;

    if (y <= headerHeight) {
      header.classList.remove("nav-hidden");
    } else if (y > lastY) {
      header.classList.add("nav-hidden");
    } else {
      header.classList.remove("nav-hidden");
    }

    lastY = y;
  }

  window.addEventListener("scroll", onScroll, { passive: true });
})();

// Shared by the hover panel and the mobile modal: builds a detail
// view for a project card — its content plus the longer technical
// blurb from data-detail, with the info button stripped out.

function buildProjectDetail(card) {
  var clone = card.cloneNode(true);
  clone.classList.remove("project");

  var infoBtn = clone.querySelector(".project-info-btn");
  if (infoBtn) infoBtn.remove();

  var extra = card.getAttribute("data-detail");
  if (extra) {
    var extraEl = document.createElement("p");
    extraEl.className = "project-detail-extra";
    extraEl.textContent = extra;
    var description = clone.querySelector("p");
    if (description) {
      description.insertAdjacentElement("afterend", extraEl);
    } else {
      clone.appendChild(extraEl);
    }
  }

  return clone;
}

// Project detail panel: hovering (or focusing) a project card mirrors
// its content into a floating panel pinned at a fixed spot on the
// right. Only visible on wide screens (see the CSS breakpoint) —
// narrower screens use the modal below instead.

(function () {
  var cards = Array.prototype.slice.call(document.querySelectorAll(".project"));
  var panel = document.getElementById("project-detail");
  if (!cards.length || !panel) return;

  var hintHTML = panel.innerHTML;
  var hideTimer = null;

  function showDetail(card) {
    clearTimeout(hideTimer);
    panel.innerHTML = "";
    panel.appendChild(buildProjectDetail(card));
    panel.classList.add("visible");
  }

  function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () {
      panel.classList.remove("visible");
      panel.innerHTML = hintHTML;
    }, 200);
  }

  cards.forEach(function (card) {
    card.addEventListener("mouseenter", function () {
      showDetail(card);
    });
    card.addEventListener("mouseleave", scheduleHide);
    card.addEventListener("focusin", function () {
      showDetail(card);
    });
    card.addEventListener("focusout", scheduleHide);
  });

  panel.addEventListener("mouseenter", function () {
    clearTimeout(hideTimer);
  });
  panel.addEventListener("mouseleave", scheduleHide);
})();

// Project detail modal: the [i] button (shown only when the hover
// panel is hidden by its CSS breakpoint) opens the same detail
// content as a popup, with a [ Close ] button.

(function () {
  var infoButtons = Array.prototype.slice.call(document.querySelectorAll(".project-info-btn"));
  var overlay = document.getElementById("project-modal");
  var content = document.getElementById("project-modal-content");
  if (!infoButtons.length || !overlay || !content) return;

  var lastTrigger = null;

  function closeModal() {
    overlay.hidden = true;
    content.innerHTML = "";
    document.body.style.overflow = "";
    if (lastTrigger) lastTrigger.focus();
  }

  function openModal(card, trigger) {
    lastTrigger = trigger;
    content.innerHTML = "";
    var detail = buildProjectDetail(card);
    content.appendChild(detail);

    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "btn";
    closeBtn.textContent = "[ Close ]";
    closeBtn.addEventListener("click", closeModal);

    // Share the [ Code ] row if this project has one, so Code sits at
    // one end and Close at the other. Otherwise give Close its own
    // right-aligned row.
    var codeRow = detail.querySelector(".btn-row");
    if (codeRow) {
      codeRow.classList.add("modal-actions");
      codeRow.appendChild(closeBtn);
    } else {
      var soloRow = document.createElement("p");
      soloRow.className = "modal-actions solo";
      soloRow.appendChild(closeBtn);
      content.appendChild(soloRow);
    }

    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  infoButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var card = btn.closest(".project");
      if (card) openModal(card, btn);
    });
  });

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !overlay.hidden) closeModal();
  });
})();
