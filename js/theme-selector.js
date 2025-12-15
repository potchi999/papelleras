(() => {
    'use strict';

    //-----------------------------
    // Theme Selector Component
    //-----------------------------
    class TTheme extends HTMLElement {
        connectedCallback() {
            const type = this.getAttribute("mode") || "navbar";
            const html = document.documentElement;

            const applySystemTheme = () => {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) html.setAttribute("data-theme", "dark");
                else html.removeAttribute("data-theme");
            };

            let savedTheme = localStorage.getItem("theme") || "auto";
            let mq;

            const applyTheme = (mode) => {
                if (mq) mq.removeEventListener("change", applySystemTheme);

                if (mode === "light") {
                    html.setAttribute("data-theme", "light");
                } else if (mode === "dark") {
                    html.setAttribute("data-theme", "dark");
                } else {
                    mq = window.matchMedia("(prefers-color-scheme: dark)");
                    mq.addEventListener("change", applySystemTheme);
                    applySystemTheme();
                }
            };

            applyTheme(savedTheme);

            const broadcastThemeChange = (mode) => {
                localStorage.setItem("theme", mode);
                window.dispatchEvent(new CustomEvent("theme-change", { detail: mode }));
            };

            const getIonIconName = (theme) =>
                theme === "dark" ? "moon" :
                    theme === "auto" ? "desktop" : "sunny";

            if (type === "sidebar") {
                this.innerHTML = `
                    <div class="theme-buttons">
                        <button class="mode-btn" data-mode="light" aria-label="Light mode">
                            <ion-icon name="sunny"></ion-icon>
                        </button>
                        <button class="mode-btn" data-mode="auto" aria-label="System mode">
                            <ion-icon name="desktop"></ion-icon>
                        </button>
                        <button class="mode-btn" data-mode="dark" aria-label="Dark mode">
                            <ion-icon name="moon"></ion-icon>
                        </button>
                    </div>
                `;

                const buttons = this.querySelectorAll(".mode-btn");

                const updateActive = () => {
                    buttons.forEach((btn) =>
                        btn.classList.toggle("active", btn.dataset.mode === savedTheme)
                    );
                };
                updateActive();

                buttons.forEach((btn) => {
                    btn.addEventListener("click", () => {
                        const mode = btn.dataset.mode;
                        savedTheme = mode;
                        applyTheme(mode);
                        broadcastThemeChange(mode);
                        updateActive();
                    });
                });
            } else {
                this.innerHTML = `
                    <li class="dark-mode-toggle" id="dark-mode-toggle" role="button" tabindex="0">
                        <ion-icon name="${getIonIconName(savedTheme)}"></ion-icon>
                    </li>
                    <ul class="dropdown-theme">
                        <li data-mode="light"><ion-icon name="sunny"></ion-icon> Light</li>
                        <li data-mode="auto"><ion-icon name="desktop"></ion-icon> System</li>
                        <li data-mode="dark"><ion-icon name="moon"></ion-icon> Dark</li>
                    </ul>
                `;

                const toggleBtn = this.querySelector("#dark-mode-toggle");
                const dropdown = this.querySelector(".dropdown-theme");
                const dropdownItems = dropdown.querySelectorAll("li");

                const updateDropdownActive = () => {
                    dropdownItems.forEach((item) =>
                        item.classList.toggle("active", item.dataset.mode === savedTheme)
                    );
                    toggleBtn.querySelector("ion-icon").setAttribute("name", getIonIconName(savedTheme));
                };
                updateDropdownActive();

                toggleBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const isOpen = dropdown.style.display === "block";
                    dropdown.style.display = isOpen ? "none" : "block";
                    toggleBtn.classList.toggle("active", !isOpen);
                });

                dropdownItems.forEach((item) => {
                    item.addEventListener("click", () => {
                        const mode = item.dataset.mode;
                        savedTheme = mode;
                        applyTheme(mode);
                        broadcastThemeChange(mode);
                        dropdown.style.display = "none";
                        toggleBtn.classList.remove("active");
                        updateDropdownActive();
                    });
                });

                document.addEventListener("click", (e) => {
                    if (!this.contains(e.target)) {
                        dropdown.style.display = "none";
                        toggleBtn.classList.remove("active");
                    }
                });
            }

            window.addEventListener("theme-change", (e) => {
                savedTheme = e.detail;
                applyTheme(savedTheme);

                if (type === "sidebar") {
                    const buttons = this.querySelectorAll(".mode-btn");
                    buttons.forEach((btn) =>
                        btn.classList.toggle("active", btn.dataset.mode === savedTheme)
                    );
                } else {
                    const toggleBtn = this.querySelector("#dark-mode-toggle");
                    const dropdownItems = this.querySelectorAll(".dropdown-theme li");
                    dropdownItems.forEach((item) =>
                        item.classList.toggle("active", item.dataset.mode === savedTheme)
                    );
                    toggleBtn.querySelector("ion-icon").setAttribute("name", getIonIconName(savedTheme));
                }
            });

            window.addEventListener("storage", (e) => {
                if (e.key === "theme" && e.newValue) {
                    const mode = e.newValue;
                    savedTheme = mode;
                    applyTheme(mode);
                    window.dispatchEvent(new CustomEvent("theme-change", { detail: mode }));
                }
            });
        }
    }
    customElements.define("t-theme", TTheme);

})();
