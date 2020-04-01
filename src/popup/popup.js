document.getElementById("settings").onclick = () => {
    browser.tabs.create({
        url: "about:blank",
    });
};
