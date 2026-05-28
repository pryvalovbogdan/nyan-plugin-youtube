const catsData = {
    black: { src: 'black.gif' },
    catty: { src: 'catty.gif' },
    glitch: { src: 'glitch-cat.gif', },
    cute: { src: 'cute-cat.gif' },
    kawaii: { src: 'cute-kawaii.gif' },
    gatito: { src: 'gatito.gif' },
    wigglez: { src: 'kitty-wigglez.gif' },
    orange: { src: 'orange-cat-orange.gif' },
    pixel: { src: 'pixel-cat.gif' },
    garfield: { src: 'cat-garfield.gif' },
    white: { src: 'white-cat.gif' },
    'orange-cat-dancing.gif': { src: 'orange-cat-dancing.gif' },
};

// Initialize the Grid UI
function renderCatGrid() {
    const gridContainer = document.getElementById('catGrid');
    if (!gridContainer) return;

    Object.keys(catsData).forEach(key => {
        const catImg = document.createElement('img');
        // Assuming your extension assets are inside an './assets/' folder
        const imgPath = `./assets/${catsData[key].src}`;

        catImg.src = imgPath;
        catImg.className = 'cat-grid-item';
        catImg.alt = key;

        // Click handler to communicate with the content script
        catImg.addEventListener('click', () => {
            handleCatSelection(catsData[key].src);
        });

        gridContainer.appendChild(catImg);
    });
}

// Target the active web page and send the payload
async function handleCatSelection(imgSrc) {
    const matchingTabs = await chrome.tabs.query({
        url: [
            "*://*.youtube.com/*",
            "*://music.youtube.com/*"
        ]
    });


    if (!matchingTabs || matchingTabs.length === 0) {
        await chrome.storage.sync.set({ selectedCat: imgSrc });
        return
    };

    matchingTabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
            action: 'CHANGE_CAT_IMAGE',
            src: imgSrc
        }, () => {
            if (chrome.runtime.lastError) {
                console.log(`Tab ${tab.id} busy or not ready yet.`);
            }
        });
    });
}

// Add this initialization inside your existing popup.js file
function initTheme() {
    const themeCheckbox = document.getElementById('themeCheckbox');

    // 1. Check if user explicitly saved a choice in the past
    chrome.storage.sync.get(['theme'], (result) => {
        if (result.theme) {
            setTheme(result.theme === 'light');
        } else {
            // 2. Default: Fallback to checking their PC System Preference
            const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
            setTheme(prefersLight);
        }
    });

    // 3. Watch for manual user clicks on the switch toggle
    themeCheckbox.addEventListener('change', (e) => {
        const isLight = e.target.checked;
        setTheme(isLight);
        chrome.storage.sync.set({ theme: isLight ? 'light' : 'dark' });
    });
}

function setTheme(isLight) {
    const themeCheckbox = document.getElementById('themeCheckbox');
    if (isLight) {
        document.body.classList.add('light-theme');
        if (themeCheckbox) themeCheckbox.checked = true;
    } else {
        document.body.classList.remove('light-theme');
        if (themeCheckbox) themeCheckbox.checked = false;
    }
}

// Attach the theme engine initialization alongside your grid setup
document.addEventListener('DOMContentLoaded', () => {
    renderCatGrid(); // your grid renderer function
    initTheme();     // triggers the system/saved theme processing
});

