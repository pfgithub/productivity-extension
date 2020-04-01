console.log("[Productivity] Extension Loaded.");

function addCSS(css) {
    let cssElem = document.createElement("style");
    cssElem.appendChild(document.createTextNode(css));
    document.head.appendChild(cssElem);
}
function disablePage(reason = "Disabled.") {
    addCSS(`
        body {
        	display: none;
        }
        html:after{
        	content: ${JSON.stringify(reason)};
        	position: fixed;
        	top: 50%;
        	left: 50%;
        	transform: translate(-50%, -50%);
        }
    `);
}

let invidious = () => {
    if (!document.querySelectorAll("#subscribe").length)
        return disablePage("Disabled. Not video page.");
    // only display the video, nothing else
    addCSS(`
        html body div.pure-g div.pure-u-1.pure-u-md-20-24 div.pure-g {
            display: none;
        }
    `);
};

let overrides = {
    "https://developer.mozilla.org": () => {},
    "https://stackoverflow.com": () => {
        // allow posts only, hide related posts
        if (!document.querySelectorAll(".post-signature").length)
            return disablePage("Disabled. Not post.");
        addCSS(`
			#sidebar {display: none;}
			.left-sidebar--sticky-container {display: none;}
			.top-bar {display: none;}
		`);
    },
    "http://invidious": invidious,
    "https://invidio.us": invidious,
    "https://www.youtube.com": () => {
        // redirect to invidio.us
        disablePage("Disabled. Not invidio.us.");
        location.href = location.href.replace(
            "https://www.youtube.com",
            "http://invidious",
        );
    },
    "https://www.google.com": () => {},
};
// location.host

if (location.protocol === "http:" || location.protocol === "https:") {
    let domainDetails = overrides[location.origin];
    if (domainDetails) domainDetails();
    else disablePage();
}
