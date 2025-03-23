// ==UserScript==
// @name         XPath + classes
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Advanced XPath clicker with optimizations
// @author       Your Name
// @match        *://*/*
// @updateURL    https://raw.githubusercontent.com/streaam-developer/private/main/xpath-autoclick.user.js
// @downloadURL  https://raw.githubusercontent.com/streaam-developer/private/main/xpath-autoclick.user.js
// @grant        none
// @run-at       document-start
// ==/UserScript==
(function () {
    'use strict';

    const xpaths = [
        "//*[@id='tp-snp2']",
        "//*[@id='main']/div[1]/center/center/a[2]",
        "//*[@id='notarobot']",
        "//*[@id='getlink']",
        "//*[@id='btn7']/div/button",
        "//*[@id='verify']/button",
        "//*[@id='file']/span",
        "//*[@id='file']",
        "//*[@id='get-link']",
        "//*[@id='lite-human-verif-button']",
        "//*[@id='lite-start-sora-button']",
        "//*[@id='lite-end-sora-button']",
        "//*[@id='VerifyBtn']",
        "//*[@id='NextBtn']",
        "//*[@id='captchaButton']",
        "//*[@id='wpsafelinkhuman']",
        "//*[@id='wpsafelinkhuman']/img",
        "//*[@id='submit-button']",
        "//*[@id='soralink-human-verif-main']",
        "//*[@id='generater']/img",
        "//*[@id='showlink']"
    ];

    const classNames = [
        "btn-primary",
        "btn-verify",
        "verify-button",
        "captcha-btn",
        "next-step",
        "proceed-btn",
        "continue-button",
        "btn btn-success btn-lg get-link" // Added class from your example
    ];

    function ultraFastClick(element) {
        if (!element) return;

        // Prevent duplicate clicking, but allow if re-scanned
        if (element.dataset.clicked === "true") {
            console.log("⚠️ Already clicked, skipping:", element);
            return;
        }

        element.dataset.clicked = "true";

        element.focus();
        ["mouseover", "mouseenter", "mousedown", "mouseup", "click"].forEach(eventType => {
            element.dispatchEvent(new MouseEvent(eventType, { view: window, bubbles: true, cancelable: true }));
        });

        try {
            element.removeAttribute("disabled");
            element.removeAttribute("readonly");
            element.click();
            console.log("✅ Clicked:", element);
        } catch (error) {
            console.log("⚠️ Click failed, using fallback:", error);
            element.dispatchEvent(new Event("click", { bubbles: true }));
        }
    }

    function scanAndClickElements() {
        let elementsSet = new Set(); // To prevent duplicate elements

        // Check XPath elements
        xpaths.forEach(xpath => {
            try {
                const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                if (result.singleNodeValue) {
                    elementsSet.add(result.singleNodeValue);
                }
            } catch (error) {
                console.error(`❌ XPath Error: ${xpath}`, error);
            }
        });

        // Check class-based elements
        classNames.forEach(className => {
            document.querySelectorAll(`.${className.split(" ").join(".")}`).forEach(element => {
                elementsSet.add(element); // Add to set to avoid duplicates
            });
        });

        // Click all detected elements
        elementsSet.forEach(element => ultraFastClick(element));
    }

    const observer = new MutationObserver(() => scanAndClickElements());

    (function init() {
        scanAndClickElements();
        setInterval(scanAndClickElements, 1500); // Scan every 1s for new elements
        observer.observe(document, { childList: true, subtree: true, attributes: true });
    })();
})();
