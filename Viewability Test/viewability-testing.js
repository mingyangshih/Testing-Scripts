// ==UserScript==
// @name         Slot Viewability Testing
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.addictinggames.com/*
// @match        https://www.addictinggames.com/*
// @match        http://www.shockwave.com/*
// @match        https://www.shockwave.com/*
// @grant        none
// ==/UserScript==

const advertiserList = {
    '-1' : '-',
    '4633811018' : '33across',
    '4780588065' : 'app_s',
    '4736669987' : 'appnexus',
    '4848160454' : 'appnexus2',
    '4800263731' : 'appnexus_v',
    '4855387568' : 'appnexus_v2',
    '4844309518' : 'catchall',
    '4854610259' : 'catchall_v',
    '4858143509' : 'con_s',
    '4854465357' : 'conversant',
    '4633813862' : 'ix',
    '4696912226' : 'ix2',
    '4806847617' : 'ix_v2',
    '4858140161' : 'ope_s',
    '4652516769' : 'openx',
    '4724170276' : 'openx_v',
    '5160729083' : 'pubmatic',
    '4680694704' : 'pulsepoint',
    '4854897104' : 'pulsepoint_v',
    '4736975982' : 'rub_s',
    '4648501149' : 'rubicon',
    '4697369671' : 'rubicon2',
    '4637662441' : 'rubicon_v',
    '4806946506' : 'sov_s',
    '4627170933' : 'sovrn',
    '4654729913' : 'triplelift',
    '4629672142' : 'AdX'
}

var leaderboard = {
        requested: 0,
        rendered: 0,
        viewed: 0,
        empty: 0
    },

    medrec = {
        requested: 0,
        rendered: 0,
        viewed: 0,
        empty: 0
    },

    adhesion = {
        requested: 0,
        rendered: 0,
        viewed: 0,
        empty: 0
    },

    sticky = {
        requested: 0,
        rendered: 0,
        viewed: 0,
        empty: 0
    };

var ympb_checker = setInterval(function() {
    //console.log('typeof YMPB === object: ' + (typeof YMPB === 'object'));
    if(typeof YMPB === 'object') {
        startAdLog();
        clearInterval(ympb_checker);
    }
}, 1000);

var CSSText = '\
    #ad_event_count_info {\
        position: fixed; z-index: 2147483647;\
        left: 0; top: 0;\
        background-color: lightyellow;\
        display: block;\
        color: #000; font-size: 10px;\
        table-layout: fixed;\
        border: 1px solid gray;\
    }\
    #ad_event_count_info td {width: 30px; border: 1px solid gray; width: 150px; }\
';

var customCSS = window.document.createElement('style');
customCSS.type = 'text/css';
window.document.head.appendChild(customCSS);
customCSS.appendChild(window.document.createTextNode(CSSText));

var eventCountTable = window.document.createElement('table');
eventCountTable.id = 'ad_event_count_info';
eventCountTable.innerHTML = '<tr>                           <td>Event</td>              <td>Medrec</td> <td>Leaderboard</td>    <td>Adhesion</td>   <td>Sticky</td> </tr>';
eventCountTable.innerHTML += '<tr id="slotRequested">       <td>slotRequested</td>      <td></td>       <td></td>               <td></td>           <td></td>       </tr>';
eventCountTable.innerHTML += '<tr id="slotRenderEnded">     <td>slotRenderEnded</td>    <td></td>       <td></td>               <td></td>           <td></td>       </tr>';
eventCountTable.innerHTML += '<tr id="impressionViewable">  <td>impressionViewable</td> <td></td>       <td></td>               <td></td>           <td></td>       </tr>';
eventCountTable.innerHTML += '<tr id="empty">               <td>Empty</td>              <td></td>       <td></td>               <td></td>           <td></td>       </tr>';
window.document.body.appendChild(eventCountTable);

function startAdLog() {
    console.log('YMPB>>> Start Log');
    var googletag = window.googletag || {};
    googletag.cmd = googletag.cmd || [];
    googletag.cmd.push(function() {
        googletag.pubads().addEventListener('slotRequested', function(e) {
            if(e.slot.getSlotElementId().indexOf('medrec') > -1) {
                ++medrec.requested;
            } else if(e.slot.getSlotElementId().indexOf('leaderboard') > -1) {
                ++leaderboard.requested;
            } else if(e.slot.getSlotElementId().indexOf('adhesion') > -1) {
                ++adhesion.requested;
            } else if(e.slot.getSlotElementId().indexOf('sticky') > -1) {
                ++sticky.requested;
            }

            document.getElementById('slotRequested').innerHTML = '<td>slotRequested</td><td>'+medrec.requested+'</td><td>'+leaderboard.requested+'</td><td>'+adhesion.requested+'</td><td>'+sticky.requested+'</td>';
        });

        googletag.pubads().addEventListener('slotRenderEnded', function(e) {
            if(e.slot.getSlotElementId().indexOf('medrec') > -1) {
                if(e.isEmpty) {
                    ++medrec.empty;
                } else {
                    ++medrec.rendered;
                }
            } else if(e.slot.getSlotElementId().indexOf('leaderboard') > -1) {
                if(e.isEmpty) {
                    ++leaderboard.empty;
                } else {
                    ++leaderboard.rendered;
                }
            } else if(e.slot.getSlotElementId().indexOf('adhesion') > -1) {
                if(e.isEmpty) {
                    ++adhesion.empty;
                } else {
                    ++adhesion.rendered;
                }
            } else if(e.slot.getSlotElementId().indexOf('sticky') > -1) {
                if(e.isEmpty) {
                    ++sticky.empty;
                } else {
                    ++sticky.rendered;
                }
            }

            document.getElementById('slotRenderEnded').innerHTML = '<td>slotRenderEnded</td><td>'+medrec.rendered+'</td><td>'+leaderboard.rendered+'</td><td>'+adhesion.rendered+'</td><td>'+sticky.rendered+'</td>';
            document.getElementById('empty').innerHTML = '<td>empty</td><td>'+medrec.empty+'</td><td>'+leaderboard.empty+'</td><td>'+adhesion.empty+'</td><td>'+sticky.empty+'</td>';
        });

        googletag.pubads().addEventListener('impressionViewable', function(e) {
            if(e.slot.getSlotElementId().indexOf('medrec') > -1) {
                ++medrec.viewed;
            } else if(e.slot.getSlotElementId().indexOf('leaderboard') > -1) {
                ++leaderboard.viewed;
            } else if(e.slot.getSlotElementId().indexOf('adhesion') > -1) {
                ++adhesion.viewed;
            } else if(e.slot.getSlotElementId().indexOf('sticky') > -1) {
                ++sticky.viewed;
            }

            document.getElementById('impressionViewable').innerHTML = '<td>impressionViewable</td><td>'+medrec.viewed+'</td><td>'+leaderboard.viewed+'</td><td>'+adhesion.viewed+'</td><td>'+sticky.viewed+'</td>';

        });

        //googletag.pubads().addEventListener('slotVisibilityChanged', function(e) {
            // This listener will be called whenever the on-screen percentage of an ad
            // slot's area changes.
            //console.log('YMPB>>> slotVisibilityChanged:', e.slot.getSlotElementId());
        //});
    });
}
