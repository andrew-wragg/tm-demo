(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function init() {
  const intersectionOptions = {
    root: null,
    // root element. Null is the viewport.
    rootMargin: "0px 110% 0px 110%",
    // margin around root. Values are similar to css property. Unitless values not allowed
    threshold: 0.25
    // trigger intersection callback when 25% of the element is visible
  };
  const intersectionVideoOptions = {
    root: null,
    rootMargin: "0px 110% 0px 110%",
    threshold: 0.01
  };
  let playersArray = [];
  const players = document.getElementsByClassName("video");
  for (let i = 0; i < players.length; i++) {
    playersArray[i] = {
      parentElement: players.item(i),
      videoID: players.item(i).dataset.videoid,
      startTime: players.item(i).dataset.startTime
    };
  }
  let elementList = document.querySelectorAll(".fade-in, .from-bottom, .from-left, .from-right, .blur");
  let videoElementList = document.querySelectorAll(".video");
  const callbacks = (enteries) => {
    enteries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        if (entry.target.classList.contains("video")) {
          entry.target.style.visibility = "visible";
          entry.target.style.pointerEvents = "auto";
          let player = playersArray.find((item) => item.videoID === entry.target.dataset.videoid);
          if (player.playerRef) {
            playVid(player.playerRef);
          }
        }
      } else {
        entry.target.classList.remove("active");
        if (entry.target.classList.contains("video")) {
          entry.target.style.pointerEvents = "none";
          let player = playersArray.find((item) => item.videoID === entry.target.dataset.videoid);
          if (player.playerRef) {
            pauseVideo(player.playerRef);
          }
        }
      }
    });
  };
  const videoObserver = new IntersectionObserver(callbacks, intersectionVideoOptions);
  const observer = new IntersectionObserver(callbacks, intersectionOptions);
  elementList.forEach((element) => {
    observer.observe(element);
  });
  videoElementList.forEach((element) => {
    videoObserver.observe(element);
  });
  setTimeout(animateOnLoad, 1e3);
  initYouTubeVids(playersArray);
}
function playVid(playerRef) {
  playerRef.playVideo();
}
function pauseVideo(playerRef) {
  playerRef.pauseVideo();
}
function initYouTubeVids(playersArray) {
  var tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  window.onYouTubeIframeAPIReady = function() {
    for (let i = 0; i < playersArray.length; i++) {
      playersArray[i].playerRef = new YT.Player(playersArray[i].videoID, {
        height: "742",
        width: "1728",
        videoId: playersArray[i].videoID,
        playerVars: {
          "playsinline": 1,
          "autoplay": 0,
          "controls": 1,
          "start": playersArray[i].startTime
        },
        events: {
          "onReady": onPlayerReady,
          "onAutoplayBlocked": onAutoplayBlocked
        }
      });
    }
  };
  function onPlayerReady(event) {
    console.log("onPlayerReady");
    event.target.mute();
  }
  function onAutoplayBlocked() {
    console.log("onAutoplayBlocked");
  }
}
function animateOnLoad() {
  let band = document.getElementById("img-band");
  band.classList.add("on-load-active");
  const circles = document.querySelectorAll(".circle3, .circle4");
  console.log(circles);
  setTimeout(function() {
    for (let i = 0; i < circles.length; i++) {
      circles.item(i).classList.add("active");
    }
  }, 500);
  const circles2 = document.querySelectorAll(".circle1, .circle2");
  console.log(circles2);
  setTimeout(function() {
    for (let i = 0; i < circles2.length; i++) {
      circles2.item(i).classList.add("active");
    }
  }, 300);
  const circles3 = document.querySelectorAll(".circle5, .circle6");
  setTimeout(function() {
    for (let i = 0; i < circles3.length; i++) {
      circles3.item(i).classList.add("active");
    }
  }, 700);
}
init();
