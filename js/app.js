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

document.addEventListener("DOMContentLoaded", async () => {
    await includePartials();
    setGitHubPagesBasePath();
    setActiveNavLink();
    initializeAutoHideHeader();
});

