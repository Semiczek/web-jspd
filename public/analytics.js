'use strict';

// Keep the queue in a same-origin file so strict CSP does not need inline scripts.
window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
const analyticsScript = document.createElement('script');
analyticsScript.defer = true;
analyticsScript.src = '/_vercel/insights/script.js';
document.head.appendChild(analyticsScript);
