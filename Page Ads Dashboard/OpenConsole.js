// ==UserScript==
// @name         OpenConsole
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.htmlgames.com/*
// @match        https://www.pozirk.com/*
// @match        https://absolutist.com/*
// @match        https://www.bubbleshooter.net/
// @match        https://www.addictinggames.com/*
// @match        https://www.mahjong.com/*
// @match        https://www.mindgames.com/*
// @match        https://new.addictinggames.com/*
// @match        https://squaredle.app/*
// @match        https://mazele.io/*
// @match        https://freegames.org/mahjong-titans-easier/
// @match        https://www.hiddenobjectgames.com/game/The+Hidden+Antique+Shop+2
// @icon         https://www.addictinggames.com/favicons
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Your code here...
  var ympb_checker = setInterval(function () {
    console.log(
      "typeof YMPB_DATA === object: " + (typeof YMPB_DATA === "object")
    );
    if (typeof window.YMPB_DATA == "object") {
      renderConsole();
      gptEventLogging();
      window.requestAnimationFrame(render);
      clearInterval(ympb_checker);
    }
  }, 1000);

  // Append CSS
  var CSSText =
    "\
    #position_board {\
        background-color: rgba(255,255,255,.5);\
        color: lightgray !important;\
        font-weight: bold !important;\
        position: fixed; \
        z-index: 2147483647;\
        left:0; \
        bottom: 0%;\
        height: 500px;\
        width: 250px;\
    };\
#position_board * { opacity:0.7 !important; }\
#footer-as > div {height: inherit !important;}\
";
  var customCSS = window.document.createElement("style");
  customCSS.type = "text/css";
  window.document.head.appendChild(customCSS);
  customCSS.appendChild(window.document.createTextNode(CSSText));
  // advertiser list
  const advertiserList = {
    "-1": "-",
    4633811018: "33across",
    4780588065: "app_s",
    4736669987: "appnexus",
    4848160454: "appnexus2",
    4800263731: "appnexus_v",
    4855387568: "appnexus_v2",
    4844309518: "catchall",
    4854610259: "catchall_v",
    4858143509: "con_s",
    4854465357: "conversant",
    4633813862: "ix",
    4696912226: "ix2",
    4806847617: "ix_v2",
    4858140161: "ope_s",
    4652516769: "openx",
    4724170276: "openx_v",
    5160729083: "pubmatic",
    4680694704: "pulsepoint",
    4854897104: "pulsepoint_v",
    4736975982: "rub_s",
    4648501149: "rubicon",
    4697369671: "rubicon2",
    4637662441: "rubicon_v",
    4806946506: "sov_s",
    4627170933: "sovrn",
    4654729913: "triplelift",
    4629672142: "AdX",
  };
  // Console Slot Color
  const color = {
    swap_impression: "#69f077",
    alert_color: "red",
    requested: "#f8f8f8",
    nofill: "orange",
    rendered: "blue",
    impressed: "darkgreen",
    swapping: "purple", //'blueviolet',
    swapped: "yellow",
    alert: "red",
  };

  let render_id_list = new Set();
  let console_slot_list = new Set();
  function render() {
    // Clear Slots in Console before render.
    document.getElementById(`position_board`).innerHTML = "";
    // render ympb target or ympb target multiple
    renderYMPBTarget();
    //console.log(typeof location.protocol)
    render_id_list.forEach((i) => {
      let el = document.getElementById(i);
      // Check whether slot in page.
      if (checkSlotExist(i)) {
        //Add to slot list
        renderPositionToConsole(i);
        //Check slot swapped. Add border to slot in console.
        checkSlotSwapped(el, i);
        //Get rightnow timestamp
        let rightnow = new Date().getTime();
        let requestedTime = el.dataset.requested;
        if (rightnow - requestedTime > 60000) {
          // do not send request to DFP after one minute.
          if (
            document.getElementById(`console_${i}`).style.backgroundColor !==
            color.alert
          ) {
            document.getElementById(`console_${i}`).style.backgroundColor =
              color.alert;
          }
        } else {
          let status = el.parentNode.parentNode.parentNode.dataset.status;
          let console_el = document.getElementById(`console_${i}`);
          console_el.style.boxSizing = "boder-box";
          //Check swapping
          if (checkSwapping(el, i)) {
            document.getElementById(`console_${i}`).style.backgroundColor =
              color.swapping;
          } else if (
            status === "rendered" ||
            status === "dfpRendered" ||
            status === "dfp_rendered"
          ) {
            //rendered
            console_el.style.backgroundColor = color.rendered;
          } else if (status === "impressed" || status === "dfp_impressed") {
            console_el.style.backgroundColor = color.impressed;
          } else if (status === "nofill" || status === "dfp_empty") {
            // nofill
            if (checkSlotExist(`console_${i}`)) {
              // If slot is nofill can not get new getResponseInformation so remove older bidder and size information.
              document.getElementById(`console_${i}`).innerHTML = "";
              document.getElementById(i).dataset.bidder = "";
            }
            console_el.style.backgroundColor = color.nofill;
          } else if (status === "requesting") {
            // requested
            console_el.style.backgroundColor = color.requested;
            console_el.style.border = "none";
          }
        }
        //}
      } else {
        // If slot do not in page remove list and console element.
        if (checkSlotExist(`console_${i}`)) {
          render_id_list.delete(i);
          document.getElementById(`console_${i}`).remove();
        }
      }
    });
    window.requestAnimationFrame(render);
  }

  //Check whether slot is swapping.
  function checkSwapping(el, id) {
    //If transform is not empty, the slot is swapping
    let ympb_id =
      document.getElementById(id).parentNode.parentNode.parentNode.dataset
        .ympbId;
    let console_slot = document.getElementById(ympb_id);
    let style = window.getComputedStyle(document.getElementById(id).parentNode);
    let matrix = new WebKitCSSMatrix(style.transform);
    let { scrollWidth, scrollHeight } = getBrowserSize();
    let translateX = (matrix.m41 / scrollWidth) * 250;
    let translateY = (matrix.m42 / scrollHeight) * 500;
    //console.log(matrix)
    if (
      el.parentNode.style.transform !== "none" &&
      el.parentNode.style.transform
    ) {
      //console.log(matrix)
      //console.log(el.parentNode.style.transform)
      console_slot.style.transform = `translate(${translateX}px, ${translateY}px)`;
      el.dataset.swapped = true;
      return true;
    }
  }
  //Check whether slot is swapped.
  function checkSlotSwapped(el, id) {
    let console_el = document.getElementById(`console_${id}`);
    if (el.dataset.swapped == "true") {
      if (checkSlotExist(`console_${id}`)) {
        let console_el = document.getElementById(`console_${id}`);
        console_el.style.border = `3px solid ${color.swapped}`;
      }
      return true;
    }
  }
  // Check whether slit exists.
  function checkSlotExist(id) {
    return document.getElementById(id);
  }
  // Get slot bounding
  function getSlotBounding(id) {
    let elBounding = document.getElementById(id).getBoundingClientRect();
    return elBounding;
  }
  // Render console
  function renderConsole() {
    var adBoard = window.document.createElement("div");
    adBoard.id = "position_board";
    window.document.body.appendChild(adBoard);
  }
  // Get browser size
  function getBrowserSize() {
    const collection = document.getElementsByTagName("body");
    let scrollHeight = collection[0].scrollHeight;
    let scrollWidth = collection[0].scrollWidth;
    return { scrollWidth, scrollHeight };
  }
  // Render positoin to console
  function renderPositionToConsole(id) {
    let elBounding = getSlotBounding(id);
    let ympb_id =
      document.getElementById(id).parentNode.parentNode.parentNode.dataset
        .ympbId;
    let bidder = document.getElementById(id).dataset.bidder;
    let { width, height } = elBounding;
    let size_string = `${width}*${height}`;
    let slotNumber = id.split("-")[3] || id.split("-")[2];
    let { scrollWidth } = getBrowserSize();
    let sizePercentageWidth = width / scrollWidth;
    let innerText;
    if (!bidder) {
      innerText = "";
    } else {
      innerText = slotNumber + bidder + size_string;
    }
    let styleText = `width:${
      sizePercentageWidth * 250
    }px; height:25px; font-size:10px; background-color:${color.requested} `;
    createNode(`console_${id}`, ympb_id, styleText, innerText);
  }
  // render ympb target to console
  function renderYMPBTarget() {
    let ympb_target = [...document.querySelectorAll(".ympb_target")];
    let { scrollWidth, scrollHeight } = getBrowserSize();
    ympb_target.forEach((i, idx) => {
      // check whether if multi ad slot
      if (i.parentNode.className == "ympb_target_multi") {
        if (!checkSlotExist(`console_multi_${i.parentNode.dataset.gid}`)) {
          let elBounding = i.parentNode.getBoundingClientRect();
          let { width, height } = elBounding;
          let sizePercentageX = elBounding.x / scrollWidth;
          let sizePercentageY = elBounding.y / scrollHeight;
          let sizePercentageWidth = width / scrollWidth;
          let styleText = `position: absolute; left: ${
            sizePercentageX * 250
          }px; top: ${sizePercentageY * 500}px`;
          createNode(
            `console_multi_${i.parentNode.dataset.gid}`,
            `position_board`,
            styleText
          );
        }
        createNode(
          i.dataset.ympbId,
          `console_multi_${i.parentNode.dataset.gid}`,
          `margin-bottom: 5px;`
        );
        //createNode(i.dataset.ympbId, `console_multi_${i.parentNode.dataset.gid}`)
      } else {
        let elBounding = i.getBoundingClientRect();
        let { width, height } = elBounding;
        let sizePercentageX = elBounding.x / scrollWidth;
        let sizePercentageY = elBounding.y / scrollHeight;
        let sizePercentageWidth = width / scrollWidth;
        let styleText = `position: absolute; left: ${
          sizePercentageX * 250
        }px; top: ${sizePercentageY * 500}px`;
        createNode(i.dataset.ympbId, `position_board`, styleText);
      }
    });
  }
  // Create Node
  function createNode(id, appendToId, styleText = "", innerText = "") {
    let el = document.createElement("div");
    el.id = id;
    el.innerHTML = innerText;
    el.style.cssText = styleText;
    let appendTo = document.getElementById(appendToId);
    appendTo.append(el);
  }
  // gtp event
  function gptEventLogging() {
    console.log("YMPB>>> Logging GPT Events");
    var googletag = window.googletag || {};
    googletag.cmd = googletag.cmd || [];
    googletag.cmd.push(function () {
      console.log("YMPB>>> Adding Event handlers");
      googletag.pubads().addEventListener("slotRequested", function (event) {
        //console.log('slotRequested')
        let requestedTime = new Date().getTime();
        //console.dir(`slotRequested ${requestedTime}`)
        var slotId = event.slot.getSlotElementId();
        if (slotId.indexOf("-oop") < 0) {
          //Ignore OOP slot
          var el = document.getElementById(slotId);
          el.dataset.y = el.getBoundingClientRect().y;
          el.dataset.requested = requestedTime;
          el.dataset.swapped = false;
          render_id_list.add(slotId);
        }
      });
      googletag
        .pubads()
        .addEventListener("slotResponseReceived", function (event) {});
      googletag.pubads().addEventListener("slotOnload", function (event) {
        //This event is fired when the creative's iframe fires its load event. When rendering rich media ads in sync rendering mode, no iframe is used so no SlotOnloadEvent will be fired.
        //console.log('YMPB>>> slotOnload:', event.slot);
        let bidder =
          advertiserList[
            event.slot.getResponseInformation().advertiserId.toString()
          ];
        let advertiser =
          bidder || event.slot.getResponseInformation().advertiserId.toString();
        let slotId = event.slot.getSlotElementId();
        document.getElementById(slotId).dataset.bidder = advertiser;
      });
      googletag.pubads().addEventListener("slotRenderEnded", function (event) {
        //console.dir(event)
        //This event is fired when the creative code is injected into a slot. This event will occur before the creative's resources are fetched, so the creative may not be visible yet. If you need to know when all creative resources for a slot have finished loading, consider the SlotOnloadEvent instead.
      });
      googletag
        .pubads()
        .addEventListener("impressionViewable", function (event) {
          //console.dir('impressionViewable')
          //console.dir(event.slot.getSlotElementId())
          //This event is fired when an impression becomes viewable, according to the Active View criteria.
        });
    });

    window.YMPB = window.YMPB || {};
    YMPB.que = YMPB.que || [];
    YMPB.que.push(() => {
      //console.log('here')
      YMPB.onEvent("bidWon", function (data) {
        //console.log(data.bidderCode)
        //console.log(data.bidderCode+ ' won the ad server auction for ad unit ' +data.adUnitCode+ ' at ' +data.cpm+ ' CPM');
        //let bidder_count_keys = Object.keys(bidder_count)
        //if(bidder_count_keys.indexOf(data.bidderCode) < 0){
        //    bidder_count[data.bidderCode] = 1
        //}else{
        //    bidder_count[data.bidderCode] += 1
        //}
      });
      YMPB.onEvent("setTargeting", function (data) {
        //console.dir('setTargeting')
        var cpm = 0;
        Object.keys(data).forEach((i) => {
          if (data[i]["hb_pb"]) {
            cpm += +data[i]["hb_pb"];
          }
        });
        //console.dir(data)
        //console.dir(cpm)
      });
      YMPB.onEvent("bidResponse", function (data) {
        //bidResponse ++
        //console.dir('bidResponse')
        //console.dir(data)
      });
    });
  }
})();
