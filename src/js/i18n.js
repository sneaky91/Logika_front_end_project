(() => {
    const languages = ["uk", "it", "sk", "en"];
    const storageKey = "peak-trails-language";
    const normalize = text => text.trim().replace(/\s+/g, " ");
    const dictionary = new Map(window.peakTranslations.map(entry => [entry[0], entry]));
    const textNodes = [];
    const attributes = [];
    let language = "uk";

    // Save original text nodes to preserve icons, line breaks and layout.
    const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.parentElement.closest("script, style, option")) continue;
        const source = normalize(node.textContent);
        if (dictionary.has(source)) textNodes.push({ node, source });
    }

    document.querySelectorAll("[alt], [placeholder], [aria-label], meta[name='description']").forEach(element => {
        ["alt", "placeholder", "aria-label", "content"].forEach(attribute => {
            const source = element.getAttribute(attribute);
            if (source && dictionary.has(normalize(source))) {
                attributes.push({ element, attribute, source: normalize(source) });
            }
        });
    });

    function translate(source) {
        return dictionary.get(source)[languages.indexOf(language)];
    }

    function setLanguage(value) {
        language = languages.includes(value) ? value : "uk";
        document.documentElement.lang = language;
        textNodes.forEach(({ node, source }) => {
            node.textContent = node.textContent.replace(/\S[\s\S]*\S|\S/, () => translate(source));
        });
        attributes.forEach(({ element, attribute, source }) => {
            element.setAttribute(attribute, translate(source));
        });
        document.querySelectorAll(".Language_switch").forEach(select => {
            select.value = language;
        });
        // Some browser privacy settings disable local storage.
        try {
            localStorage.setItem(storageKey, language);
        } catch {
            // Switching remains available on the current page.
        }
    }

    document.querySelectorAll(".Language_switch").forEach(select => {
        select.addEventListener("change", () => setLanguage(select.value));
    });

    let savedLanguage;
    try {
        savedLanguage = localStorage.getItem(storageKey);
    } catch {
        savedLanguage = "uk";
    }
    setLanguage(savedLanguage);
})();
