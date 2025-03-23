// ==UserScript==
// @name         XPath AutoClick Master (Optimized)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Advanced XPath clicker with optimizations
// @author       Your Name
// @match        *://*/*
// @updateURL    https://raw.githubusercontent.com/streaam-developer/private/main/xpath-autoclick.user.js
// @downloadURL  https://raw.githubusercontent.com/streaam-developer/private/main/xpath-autoclick.user.js
// @grant        none
// @run-at       document-start
// ==/UserScript==
(function() {
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
        "//*[@id='lite-end-sora-button']"
    ];

    function ultraForceClick(element) {
        if (!element || element.dataset.clicked) return;
        element.dataset.clicked = "true";

        // Click simulation
        ['mousedown', 'mouseup', 'click'].forEach(eventType => {
            element.dispatchEvent(new MouseEvent(eventType, {
                view: window, bubbles: true, cancelable: true
            }));
        });

        try {
            element.removeAttribute('disabled');
            element.removeAttribute('readonly');
            element.click();
            console.log('✅ Clicked:', element);
        } catch (error) {
            console.log('⚠️ Click failed, using fallback:', error);
            element.dispatchEvent(new Event('click', {bubbles: true}));
        }
    }

    function scanAndClickXPaths() {
        xpaths.forEach(xpath => {
            try {
                const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                const node = result.singleNodeValue;
                if (node) {
                    console.log(`🎯 Found: ${xpath}`);
                    ultraForceClick(node);
                }
            } catch (error) {
                console.error(`❌ XPath Error: ${xpath}`, error);
            }
        });
    }

    let observerTimeout;
    const observer = new MutationObserver(mutations => {
        clearTimeout(observerTimeout);
        observerTimeout = setTimeout(scanAndClickXPaths, 500);
    });

    (function init() {
        scanAndClickXPaths();
        setInterval(scanAndClickXPaths, 2500);
        observer.observe(document, { childList: true, subtree: true, attributes: true });
    })();

})();
