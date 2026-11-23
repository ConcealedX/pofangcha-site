(() => {
  "use strict";

  document.documentElement.classList.add("js");

  const body = document.body;
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-site-nav]");

  const setNavOpen = (open) => {
    if (!navToggle || !nav) return;
    body.dataset.navOpen = String(open);
    body.classList.toggle("nav-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.querySelector(".sr-only").textContent = open ? "关闭菜单" : "打开菜单";
  };

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      setNavOpen(body.dataset.navOpen !== "true");
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) setNavOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && body.dataset.navOpen === "true") {
        setNavOpen(false);
        navToggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 820 && body.dataset.navOpen === "true") setNavOpen(false);
    });
  }

  const filterGroups = document.querySelectorAll("[data-filter-group]");

  filterGroups.forEach((group) => {
    const buttons = [...group.querySelectorAll("[data-filter]")];
    const cards = [...group.querySelectorAll("[data-category]")];
    const summary = group.querySelector("[data-filter-summary]");
    const emptyState = group.querySelector("[data-empty-state]");
    const list = group.querySelector("[data-filter-list]") || group;
    const singular = group.dataset.itemLabel || "条目";

    const applyFilter = (value) => {
      let visible = 0;

      cards.forEach((card) => {
        const matches = value === "all" || (card.dataset.category || "").split(" ").includes(value);
        card.hidden = !matches;
        if (matches) visible += 1;
      });

      buttons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.filter === value));
      });

      if (summary) {
        summary.textContent = `SHOWING / ${String(visible).padStart(2, "0")} ${singular.toUpperCase()}`;
      }

      if (emptyState) emptyState.hidden = visible > 0;

      list.setAttribute("aria-live", "polite");
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => applyFilter(button.dataset.filter || "all"));
    });

    applyFilter(buttons.find((button) => button.getAttribute("aria-pressed") === "true")?.dataset.filter || "all");
  });

  const dialog = document.querySelector("#project-dialog");

  if (dialog instanceof HTMLDialogElement) {
    const title = dialog.querySelector("[data-dialog-title]");
    const description = dialog.querySelector("[data-dialog-description]");
    const meta = dialog.querySelector("[data-dialog-meta]");
    const closeButton = dialog.querySelector("[data-dialog-close]");

    document.querySelectorAll("[data-project-title]").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        if (title) title.textContent = trigger.dataset.projectTitle || "项目";
        if (description) description.textContent = trigger.dataset.projectDescription || "项目详情正在整理。";
        if (meta) meta.textContent = trigger.dataset.projectMeta || "";
        dialog.showModal();
      });
    });

    closeButton?.addEventListener("click", () => dialog.close());

    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const outside =
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom;
      if (outside) dialog.close();
    });
  }

  const toast = document.querySelector("[data-toast-root]");
  let toastTimer;

  document.querySelectorAll("[data-toast]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      if (!toast) return;
      toast.textContent = trigger.dataset.toast;
      toast.classList.add("is-visible");
      clearTimeout(toastTimer);
      toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
    });
  });

  const revealItems = document.querySelectorAll(".reveal");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reducedMotion && "IntersectionObserver" in window) {
    revealItems.forEach((item) => item.classList.add("reveal-pending"));

    const revealAll = () => {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
    );

    revealItems.forEach((item) => observer.observe(item));

    // Never let content remain hidden if the observer is throttled or inert.
    window.setTimeout(revealAll, 1400);
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  document.querySelectorAll('a[href^="http"]').forEach((link) => {
    if (!link.target) link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
})();
