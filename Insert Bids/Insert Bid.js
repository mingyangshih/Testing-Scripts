// ==UserScript==
// @name         Insert Bid
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://local.mindgames.com:8099/*
// @match        https://www.htmlgames.com/*
// @match        https://www.shockwave.com/*
// @match        https://www.addictinggames.com/*
// @match        https://absolutist.com/*
// @match        https://www.canucklegame.ca/
// @match        https://htmlmahjonggames.com/*
// @match        https://*.absolutist.com/*
// @match        https://starve.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mindgames.com
// @grant        none
// ==/UserScript==



(function () {
    'use strict';
    var getIncrementalInteger = (function () {
        var count = 0;
        return function () {
            count++;
            return count;
        };
    })();

var CSSText = '\
.hi-vis-container, .shockwave-go-banner, .ympb_target_no_bg, #trevda, .GamePlayer__Anchor--bottom, [data-type^="desktop-leaderboard-template"], .AdContainer>.ympb_target{\
display: none !important;\
};\
';
var customCSS = window.document.createElement('style');
customCSS.type = 'text/css';
window.document.head.appendChild(customCSS);
customCSS.appendChild(window.document.createTextNode(CSSText));

    // generate a random string (to be used as a dynamic JSONP callback)
    function getUniqueIdentifierStr() {
        return getIncrementalInteger() + Math.random().toString(16).substr(2);
    }



    function insertBid(bid, cpm, size, aid) {
        let adId = aid || getUniqueIdentifierStr();
console.log(adId)


        bid.adId = adId;
        bid.responseTimestamp = Date.now();
        bid.requestTimestamp = bid.responseTimestamp - bid.timeToRespond;
        bid.cpm = cpm;



        bid.width = size[0];
        bid.height = size[1];
        bid.size = size.join('x');
        bid.ad = '<img src="https://placehold.co/' + size.join('x') + '/">';



        bid.adserverTargeting.hb_adid = adId;
        bid.adserverTargeting.hb_pb = cpm.toFixed(2);
        bid.adserverTargeting.hb_size = size.join('x');




        window.localStorage.setItem(`YOLLA_CACHE.${adId}`, JSON.stringify(bid));
    }



    let sovrn__1 = {
        bidderCode: 'sovrn',
        width: 320,
        height: 50,
        statusMessage: 'Bid available',
        adId: '65061a6ffa1f696',
        requestId: '6012643beeadfa86',
        transactionId: '73933743-3bf2-474d-9b3c-b4d94fac07bf',
        auctionId: 'd87272db-1db7-48f5-aeb5-cf963be4952f',
        mediaType: 'banner',
        source: 'client',
        cpm: 1.85,
        creativeId: 'ae1rbn5j',
        dealId: null,
        currency: 'USD',
        netRevenue: true,
        ttl: 900,
        meta: {advertiserDomains: ['lithia.com']},
        ad: '<img src="https://placehold.com/">',
        adapterCode: 'sovrn',
        originalCpm: 0.39105107100000003,
        originalCurrency: 'USD',
        isDebug: true,
        responseTimestamp: 1681731332242,
        requestTimestamp: 1681731331382,
        bidder: 'sovrn',
        adUnitCode: 'desktop-medrec-26',
        timeToRespond: 860,
        pbLg: '1.50',
        pbMg: '1.80',
        pbHg: '1.85',
        pbAg: '1.85',
        pbDg: '1.85',
        pbCg: '1.85',
        size: '320x50',
        adserverTargeting: {
            hb_bidder: 'sovrn',
            hb_adid: '65061a6ffa1f696',
            hb_pb: '1.85',
            hb_size: '320x50',
            hb_source: 'client',
            hb_format: 'banner',
            ub: '0.39',
        },
        //__adUnitCode: 'desktop-medrec-26',
        _metrics: 1,
    };



    insertBid(sovrn__1, 2.4, [300, 50], '65061a6ffa1f696');
    insertBid(sovrn__1, 2.4, [300, 50], '65061a6ffa1f697');
    insertBid(sovrn__1, 2.4, [300, 50], '65061a6ffa1f698');
    insertBid(sovrn__1, 2.4, [300, 50], '65061a6ffa1f699');

    insertBid(sovrn__1, 2.4, [300, 250],'65061a6ffa1f700');
})();