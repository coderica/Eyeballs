window.onload = function() {
  var speed = document.getElementById("speed");
  var zone = document.getElementById("zone");
  zones = document.getElementsByClassName("zone");
  zone.addEventListener("input", changeZones);

  webgazer
    .setRegression("ridge") /* currently must set regression and tracker */
    .setTracker("clmtrackr")
    .setGazeListener(function(data, clock) {
      var scrollUp = window.innerHeight * zone.value;
      var scrollDown = window.innerHeight - window.innerHeight * zone.value;

      if (data) {
        if (data.y > scrollDown) {
          window.scrollBy(0, speed.value);
        } else if (data.y < scrollUp) {
          window.scrollBy(0, -speed.value);
        }
      }

      //console.log(clock); /* elapsed time in milliseconds since webgazer.begin() was called */
    })
    .begin()
    .showPredictionPoints(
      true
    ); /* shows a square every 100 milliseconds where current prediction is */

  var width = 320;
  var height = 240;
  var topDist = "0px";
  var leftDist = "0px";

  var setup = function() {
    var video = document.getElementById("webgazerVideoFeed");
    video.style.display = "block";
    video.style.position = "fixed";
    video.style.top = topDist;
    video.style.left = leftDist;
    video.width = width;
    video.height = height;
    video.style.margin = "0px";
    video.style.transform = "filter: FlipH";
    video.style.transform = "scale(-1, 1)";

    webgazer.params.imgWidth = width;
    webgazer.params.imgHeight = height;

    // draw face outline...
    // var overlay = document.createElement('canvas');
    // overlay.id = 'overlay';
    // overlay.style.position = 'absolute';
    // overlay.width = width;
    // overlay.height = height;
    // overlay.style.top = topDist;
    // overlay.style.left = leftDist;
    // overlay.style.margin = '0px';

    // document.body.appendChild(overlay);

    // var cl = webgazer.getTracker().clm;

    // function drawLoop() {
    //     requestAnimFrame(drawLoop);
    //     overlay.getContext('2d').clearRect(0,0,width,height);
    //     if (cl.getCurrentPosition()) {
    //         cl.draw(overlay);
    //     }
    // }
    // drawLoop();
  };

  function checkIfReady() {
    if (webgazer.isReady()) {
      setup();
    } else {
      setTimeout(checkIfReady, 100);
    }
  }
  setTimeout(checkIfReady, 100);
};

window.onbeforeunload = function() {
  //webgazer.end(); //Uncomment if you want to save the data even if you reload the page.
  window.localStorage.clear(); //Comment out if you want to save data across different sessions
};

function changeZones(e) {
  for (i = 0; i < zones.length; i++) {
    var height = window.innerHeight * zone.value;
    zones[i].style.height = height;
    zones[i].style.opacity = "0.2";
  }
  setTimeout(function() {
    zones.top.style.opacity = "0";
    zones.bottom.style.opacity = "0";
  }, 600);
}

document.onkeydown = function(e) {
  if (e.shiftKey) {
    if (e.keyCode == "38") {
      // up arrow
      zone.stepUp();
      changeZones();
    } else if (e.keyCode == "40") {
      // down arrow
      zone.stepDown();
      changeZones();
    } else if (e.keyCode == "37") {
      // left arrow
      speed.stepDown();
    } else if (e.keyCode == "39") {
      // right arrow
      speed.stepUp();
    }
  }
};
