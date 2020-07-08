// ==UserScript==
// @name         여신장판
// @namespace    sarapad
// @version      1.0.0
// @description  여신님 장판
// @author       shm
// @license      MIT
// @icon         https://majaksin.github.io/sarapad/preview.png
// @supportURL   https://github.com/majaksin/sarapad/issues
// @homepageURL  https://github.com/majaksin/sarapad
// @downloadURL  https://majaksin.github.io/sarapad/sarapad.user.js
// @updateURL    https://majaksin.github.io/sarapad/sarapad.user.js
// @include      https://game.mahjongsoul.com/*
// @grant        unsafeWindow
// @grant        GM_getResourceText
// @run-at       document-start
// @resource resourcepack https://majaksin.github.io/sarapad/resourcepack.json
// ==/UserScript==

(function () {
    'use strict';
    const GAME_BASE_URL = 'https://game.mahjongsoul.com/';
    const RES_BASE_URL = 'https://majaksin.github.io/sarapad/';

    const version_re = /v\d+\.\d+\.\d+\.w\//i;
    const resourcepack = JSON.parse(GM_getResourceText('resourcepack'));


    replaceXhrOpen();

    function updateUrl(url) {
        const original_url = url;
        if (url.startsWith(GAME_BASE_URL)) {
            url = url.substring(GAME_BASE_URL.length);
        }
        url = url.replace(version_re, '');
        if (resourcepack.replace.includes(url)) {
            url = RES_BASE_URL + 'assets/' + url;
            console.log(url);
            return url;
        } else {
            return original_url;
        }
    }

    function replaceXhrOpen() {
        const original_function = window.XMLHttpRequest.prototype.open;
        window.XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
            return original_function.call(this, method, updateUrl(url), async, user, password);
        };
    }

})();
