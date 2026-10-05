async function includePartials() {
	const includeNodes = document.querySelectorAll("[data-include]");
	const tasks = Array.from(includeNodes).map(async (node) => {
		const includePath = node.getAttribute("data-include");
		if (!includePath) {
			return;
		}

		const includeUrl = new URL(includePath, window.location.href);
		try {
			const response = await fetch(includeUrl);
			if (!response.ok) {
				throw new Error(`HTTP ${response.status}`);
			}

			node.innerHTML = await response.text();
		} catch (error) {
			console.error(`No se pudo cargar ${includePath}`, error);
		}
	});

	await Promise.all(tasks);
}

function setActiveNavLink() {
	const currentPage = document.body.dataset.page;
	if (!currentPage) {
		return;
	}

	const activeLink = document.querySelector(`[data-nav="${currentPage}"]`);
	if (activeLink) {
		activeLink.classList.add("active");
		activeLink.setAttribute("aria-current", "page");
	}
}

function setGitHubPagesBasePath() {
	const currentPath = window.location.pathname;
	const htmlDirectory = currentPath.indexOf("/html/");
	const siteRoot = htmlDirectory >= 0
		? currentPath.slice(0, htmlDirectory + 1)
		: currentPath.slice(0, currentPath.lastIndexOf("/") + 1);

	document.querySelectorAll('[href^="/"], [src^="/"]').forEach((element) => {
		const attribute = element.hasAttribute("href") ? "href" : "src";
		const path = element.getAttribute(attribute);
		element.setAttribute(attribute, `${siteRoot}${path.slice(1)}`);
	});
}



function initializeAutoHideHeader() {
    const header = document.getElementById("site-header");

    if (!header) {
        return;
    }

    let previousScrollPosition = window.scrollY;
    let animationPending = false;

    window.addEventListener(
        "scroll",
        () => {
            if (animationPending) {
                return;
            }

            animationPending = true;

            window.requestAnimationFrame(() => {
                const currentScrollPosition = window.scrollY;
                const mobileMenu = document.getElementById("navbarScroll");
                const mobileMenuIsOpen =
                    mobileMenu?.classList.contains("show");

                if (currentScrollPosition <= 10 || mobileMenuIsOpen) {
                    header.classList.remove("header-hidden");
                } else if (
                    currentScrollPosition > previousScrollPosition &&
                    currentScrollPosition > header.offsetHeight
                ) {
                    header.classList.add("header-hidden");
                } else if (
                    currentScrollPosition < previousScrollPosition
                ) {
                    header.classList.remove("header-hidden");
                }

                previousScrollPosition = Math.max(
                    currentScrollPosition,
                    0
                );

                animationPending = false;
            });
        },
        { passive: true }
    );
}

/*aqui inicia la cajita de los precios de subscripción */

function animateCount(el, start, end, duration = 300) {
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentVal = Math.round(start + (end - start) * progress);

        el.textContent = currentVal;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function setBilling(mode) {
    const pill = document.getElementById("switchPill");
    const monthlyBtn = document.getElementById("monthlyBtn");
    const yearlyBtn = document.getElementById("yearlyBtn");
    const priceElements = document.querySelectorAll(".price-val");
    const periodLabels = document.querySelectorAll(".price-period");

    const isYearly = mode === "yearly";

    if (pill) {
        pill.style.transform = isYearly ? "translateX(100%)" : "translateX(0%)";
    }

    if (monthlyBtn && yearlyBtn) {
        monthlyBtn.classList.toggle("active", !isYearly);
        yearlyBtn.classList.toggle("active", isYearly);
    }

    priceElements.forEach((el) => {
        const free = el.getAttribute("free");

        if (free) {
            el.textContent = "Gratis";
            return;
        }

        const monthlyValue = Number.parseInt(el.getAttribute("data-monthly") || "0", 10) || 0;
        const yearlyValue = Number.parseInt(el.getAttribute("data-yearly") || String(monthlyValue * 12), 10) || 0;
        const targetVal = isYearly ? yearlyValue : monthlyValue;

        const startVal = Number.parseInt(String(el.textContent).replace(/[^\d]/g, ""), 10) || 0;

        animateCount(el, startVal, targetVal);
    });

    periodLabels.forEach((label) => {
        label.textContent = isYearly ? "/año" : "/mes";
    });
}


window.setBilling = setBilling;

function initializePricing() {
    const monthlyBtn = document.getElementById("monthlyBtn");
    const yearlyBtn = document.getElementById("yearlyBtn");

    if (monthlyBtn && yearlyBtn) {
        monthlyBtn.addEventListener("click", () => setBilling("monthly"));
        yearlyBtn.addEventListener("click", () => setBilling("yearly"));
    }
}


document.addEventListener("DOMContentLoaded", async () => {
    await includePartials();
    setGitHubPagesBasePath();
    setActiveNavLink();
    initializeAutoHideHeader();
    initializePricing();
    setBilling("monthly");
});
