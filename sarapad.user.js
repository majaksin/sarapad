// ==UserScript==
// @name         여신장판
// @namespace    sarapad
// @version      1.0.0
// @description  여신님 장판. 적용안되면 새로고침 한번하셈.
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
    replaceCodeScript();

    function replaceCodeScript() {
        let observer = null;
        observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                const scripts = document.getElementsByTagName('script');
                for (let i = 0; i < scripts.length; i++) {
                    const script = scripts[i];
                    if (script.src && script.src.indexOf('code.js') !== -1) {
                        script.onload = function () {
                            replaceLayaLoadImage();
                            replaceLayaLoadSound();
                            replaceLayaLoadTtf();
                        };
                        observer.disconnect();
                    }
                }
            });
        });
        const config = {
            childList: true
        };
        observer.observe(document.body, config);
    }

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

    function replaceLayaLoadImage() {
        const original_function = Laya.Loader.prototype._loadImage;
        Laya.Loader.prototype._loadImage = function (url) {
            return original_function.call(this, updateUrl(url));
        }
    }

    function replaceLayaLoadSound() {
        const original_function = Laya.Loader.prototype._loadSound;
        Laya.Loader.prototype._loadSound = function (url) {
            return original_function.call(this, updateUrl(url));
        }
    }

    function replaceLayaLoadTtf() {
        const original_function = Laya.Loader.prototype._loadTTF;
        Laya.Loader.prototype._loadTTF = function (url) {
            return original_function.call(this, updateUrl(url));
        }
    }

})();
