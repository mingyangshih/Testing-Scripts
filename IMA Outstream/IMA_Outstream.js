// ==UserScript==
// @name         Out Stream IMA SDK
// @namespace    http://tampermonkey.net/
// @version      2024-06-20
// @description  try to take over the world!
// @author       You
// @match        https://www.shockwave.com/*
// @match        https://www.pozirk.com/all-in-one-solitaire-game/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.pbjs = window.pbjs || {};
    window.pbjs.que = window.pbjs.que || [];

    // Load Prebid Script
    var script = document.createElement('script');
    script.src = "//cdn.jsdelivr.net/npm/prebid.js@8.45.0/dist/not-for-prod/prebid.js";
    document.head.appendChild(script);
    // Create out stream container
    var mainContainer = document.createElement('div');
    mainContainer.id = 'mainContainer';
    mainContainer.style.cssText = 'position:fixed;width:400px;height:300px;z-index:100;background:#000;right:10px;top:10px;'
    var contentElement = document.createElement('video');
    contentElement.id = 'contentElement';
    contentElement.volume = 0
    contentElement.style.cssText = 'height:0px;'
    var adContainer = document.createElement('div');
    adContainer.id = 'desktop-outstream';
    mainContainer.appendChild(contentElement)
    mainContainer.appendChild(adContainer)
    document.body.appendChild(mainContainer);
    // Count the bids status
    let outstreamRequests = 0,
        noBids = 0,
        bidRequests = 0,
        bidResponses = 0,
        adSucceeded = 0,
        adFailed = 0,
        bidPlayed = 0,
        CPM = 0;

    // render function
    function render(bid) {
        console.log('render', bid)
        CPM = CPM + bid.cpm
        console.log(`outstreamRequests: ${outstreamRequests},CPM: ${CPM},bidRequests: ${bidRequests},bidResponses: ${bidResponses},adSucceeded: ${adSucceeded},adFailed: ${adFailed}, bidPlayed:${bidPlayed}`);
        const videoContent = document.getElementById("contentElement");
        const adContainer = document.getElementById("desktop-outstream");

        const adDisplayContainer = new window.google.ima.AdDisplayContainer(
            adContainer,
            videoContent
        );

        const adsRequest = new window.google.ima.AdsRequest();
        adsRequest.adTagUrl = "";
        //if(!bid.vastXml) {
        adsRequest.adTagUrl = bid.vastUrl;
        //}else {
        adsRequest.adsResponse = bid.vastXml;
        //}


        const adsLoader = new window.google.ima.AdsLoader(adDisplayContainer);
        adsLoader.requestAds(adsRequest);
        adsLoader.addEventListener('adError', adError => {
            console.log('adError',adError);
        });

        adsLoader.addEventListener(
            window.google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
            (adsManagerLoadedEvent) => {
                const adsRenderingSettings = new window.google.ima.AdsRenderingSettings();
                //adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
                /* videoContent should be set to the video DOM element. */
                console.log('videoContent',videoContent)
                const adsManager = adsManagerLoadedEvent.getAdsManager(
                    videoContent,
                    adsRenderingSettings
                );

                /* Ad event listeners */
                adsManager.addEventListener(window.google.ima.AdEvent.Type.LOADED, () =>{
                    console.log('YOLLA bidPlayed Count:', ++bidPlayed);
                });


                /* Play the ad */
                videoContent.load();
                adDisplayContainer.initialize();
                adsManager.init(400, 300, window.google.ima.ViewMode.NORMAL);
                adsManager.start();
            },
            false
        );
    }


    /* Prebid video ad unit */
    const videoAdUnit = {
        //uid: 1205,
        //gamPath: "/22065394766/Solitaired_D_outstream",
        gamSizes: [[400, 300]],
        clsSize: null,
        code: "desktop-outstream",
        elementId: "desktop-outstream", // new
        baseFloor: "1.00", // new
        deviceType: "desktop", //new
        deviceTypes: ["desktop"],//new
        dynamicFloorParameters:'"{"auction_type": {}, "browser": {"Safari": 0.33}, "impression_tracker_floors": {"default": 0.54, "Chrome_US_desktop_default_B": 3.56, "CA": 0.93, "AU": 0.48, "DE": 0.16, "Firefox_US": 1.44, "Chrome_US": 3.05, "Safari_US": 2.22, "GB": 0.66, "Edge_US_desktop_default_C": 2.08, "Edge_US": 2.2, "Edge_US_desktop_default_B": 2.39, "Chrome_US_desktop_default_A": 4.07, "Chrome_GB": 0.73, "US": 2.54, "Chrome_US_desktop_default_C": 2.62}}"',
        refresh: true,//new
        requireBids: false,//new
        lazyLoad: false,//new
        unitType: "outstream",//new
        sections: ['default'],//new
        renderer: {
            render,
            url: "https://imasdk.googleapis.com/js/sdkloader/ima3_debug.js",
        },
        mediaTypes: {
            video: {
                context: 'outstream',
                playerSize: [400,300],
                mimes: ["video/mp4","video/webm","video/x-ms-wmv","application/javascript"],
                protocols: [1, 2, 3, 4, 5, 6, 7, 8],
                playbackmethod: [6],
                pos: 1,
                skip: 0,
                skippable: false,
                api: [1,2,7],
                minduration: 5,
                maxduration: 41,
                linearity: 1,
                placement: 5,
                plcmt: 4,
                startdelay: 0,
            }
        },
        ortb2Imp:{
            battr:[3],
            ext:{
                ae: 1,
                gpid: "desktop-outstream",
            }
        },
        bids: [
            {
                bidder: "appnexus",
                params: {
                    placementId: "32947583",
                    video: {"skippable":false,"playback_method":["auto_play_sound_off"],"mimes":["video/mp4","video/webm","video/x-ms-wmv","application/javascript"],"protocols":[1,2,3,4,5,6,7,8],"api":[1,2,7]}
                }
            },
            {
                bidder: "rubicon",
                params: {
                    accountId: 19700,
                    siteId: 549700,
                    zoneId: 3431526,
                    video: {"language":"en"},
                }
            },
            {
                bidder: "sovrn",
                params: {
                    tagid: "1238606",
                }
            },
            {
                bidder: "openx",
                params: {
                    unit: "560866653",
                    delDomain: "yolla-d.openx.net",
                    video: {
                        mimes: [
                            "video/mp4",
                            "video/webm",
                            "video/x-ms-wmv",
                            "application/javascript",
                        ],
                        protocols: [1, 2, 3, 4, 5, 6, 7, 8],
                    },
                }
            },
            {
                bidder: "ix",
                params: {
                    siteId: "1113420",
                    size: [400,300],
                    video: {
                        mimes: [
                            "video/mp4",
                            "video/webm",
                            "video/x-ms-wmv",
                            "application/javascript",
                        ],
                        protocols: [1, 2, 3, 4, 5, 6, 7, 8],
                        api: [1, 2, 7],
                    },
                }
            }
        ]
    };


    // floor lookup function
    function bidderLookup(req, res) {
        console.log('lookup',req.bidder);
        return req.bidder;
    }
    window.pbjs.que.push(() => {
        window.pbjs.setBidderConfig({
            bidders: ["openx","ix"],
            config: {
                fledgeEnabled: true,
            }
        });
        window.pbjs.setBidderConfig({
            bidders: ["appnexus","rubicon"],
            config: {
                fledgeEnabled: false
            }
        });
        // prebid set config
        window.pbjs.setConfig({
            ortb2:{
                site: {
                    keywords: "",
                },
            },
            floors: {
                enforcement: {
                    enforceJS: true,
                },
                data: {
                    currency: 'USD',
                    schema: {
                        fields: ['bidder']
                    },
                    values: {
                        "rubicon": 1,
                        "appnexus": 1,
                        "ix": 1,
                        "sovrn": 1,
                        "openx": 1,
                    }
                },
                additionalSchemaFields : {
                    bidder : bidderLookup // where deviceTypes is the function reference for your lookup function
                }
            },
            useBidCache: true,
            maxRequestsPerOrigin: 6,
            enableTIDs: true,
            eventHistoryTTL: 60,
            targetingControls: {
                alwaysIncludeDeals: true
            },
            cache: {
                url: 'https://prebid.adnxs.com/pbc/v1/cache',
                ignoreBidderCacheKey: true
            },
            enableSendAllBids: false,
            userSync: {
                topics: {
                    maxTopicCaller: 3, // SSP rotation
                    bidders: [{
                        bidder: 'pubmatic',
                        iframeURL: 'https://ads.pubmatic.com/AdServer/js/topics/topics_frame.html',
                        expiry: 7 // Configurable expiry days
                    }]
                },
                filterSettings: {
                    image: {
                        bidder: '*',
                        filter: 'include'
                    },
                    iframe: {
                        bidders: '*',
                        filter: 'include'
                    }
                },
                syncDelay: 5000,
                auctionDelay: 300,
                userIds: [{
                    name: "sharedId",
                    storage: {
                        type: "cookie",
                        name: "_sharedid",// create a cookie with this name
                        expires: 30// expires in 1 years
                    }
                },{
                    name: "criteo",
                },{
                    name: "lotamePanoramaId",
                    params: {
                        clientId: "17808"
                    }
                },{
                    name: "33acrossId",
                    params: {
                        pid: "0010b00002Ed7U2AAJ",
                        //storeFpid: true
                    },
                    storage: {
                        name: "33acrossId",
                        type: "html5",

                    }
                }]
            },
            currency: {
                adServerCurrency: "USD",
            },
        });
        window.pbjs.addAdUnits(videoAdUnit);

        function requestOutstream() {
            console.log('YOLLA Request Outstream ', outstreamRequests);
            outstreamRequests++;
            // request bid
            window.pbjs.requestBids({
                timeout: 3000,
                bidsBackHandler: function(bids) {
                    console.log(`bidsBackHandler`, bids)
                    const highestCpmBids = window.pbjs.getHighestCpmBids("desktop-outstream");
                    console.log(`outstreamRequests: ${outstreamRequests},CPM: ${CPM},bidRequests: ${bidRequests},bidResponses: ${bidResponses},adSucceeded: ${adSucceeded},adFailed: ${adFailed}, bidPlayed:${bidPlayed}`);
                    console.log('highestCpmBids', highestCpmBids)

                    window.pbjs.renderAd(mainContainer, highestCpmBids[0].adId);


                }
            });
        }
        requestOutstream();
        setInterval(requestOutstream, 60000);

        window.pbjs.onEvent('bidRequested', function(data) {
            console.log('YOLLA bidRequested Count:', ++bidRequests);
            //if(data.bidderCode == 'rubicon') {
                console.log('YOLLA bidRequested', data);
            //}
        });

        window.pbjs.onEvent('bidResponse', function(data) { //A bid response has arrived
            console.log('YOLLA bidResponse Count:', ++bidResponses);
            //console.log('YOLLA bidResponse', data);
        });

        window.pbjs.onEvent('adRenderFailed', function(data) { //Addata rendering failed
            console.log('YOLLA adRenderFailed Count:', ++adFailed);
            //console.log('YOLLA adRenderFailed', data);
        });

        window.pbjs.onEvent('adRenderSucceeded', function(data) { //Addata rendering failed
            console.log('YOLLA adRenderSucceeded Count:', ++adSucceeded);
            //console.log('YOLLA adRenderSucceeded', data);
        });

        window.pbjs.onEvent('beforeBidderHttp', (data) => {
            //console.log('YOLLA beforeBidderHttp',data);
            if (data.bidderCode == 'appnexus' || data.bidderCode == 'rubicon') {
                data.bids[0].ortb2Imp.ext.ae = undefined;
            }
            //if(data.bidderCode == 'rubicon'||data.bidderCode == 'appnexus') {
            data.bids[0].floorData = {floorMin: 1}
            //}

        })
    });
})();