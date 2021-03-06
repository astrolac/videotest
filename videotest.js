/*  Многое взято с сайта Mozilla Foundation, из примера создания видео плейера HTML5. Всё что взто оттуда
    я оставил без изменений. Ниже ссылка на статью. */
/* https://developer.mozilla.org/en-US/Apps/Fundamentals/Audio_and_video_delivery/cross_browser_video_player */

'use strict';

  //Using the Media API
/*  HTML5 comes with a JavaScript Media API that allows developers access to and control of HTML5 media. This API
    will be used to make the custom control set defined above actually do something. In addition, the fullscreen
    button will use the Fullscreen API
    [https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode],
    another W3C API that controls the ability of web browsers to show apps using your computer's full screen. */

  //Setup
/*  Before dealing with the individual buttons, a number of initialisation calls are required. */

/*  To begin with, it's a good idea to first check if the browser actually supports the <video> element and to only
    setup the custom controls if it does. This is done by simply checking if a created <video> element supports the
    canPlayType() method, which any supported HTML5 <video> element should. */

var supportsVideo = !!document.createElement('video').canPlayType;
if (supportsVideo) {

/*  Once it has been confirmed that the browser does indeed support HTML5 video, it's time to set up the custom
    controls. A number of variables pointing to HTML elements are required: */

  var videoContainer = document.getElementById('videoContainer');
  var video = document.getElementById('video');
  var videoControls = document.getElementById('video-controls');

/*  As mentioned earlier, the browser's default controls now need to be disabled, and the custom controls need to be
    displayed: */

  /*video.controls = false; /* Hide the default controls */
  videoControls.style.display = 'block'; /* Display the user defined video controls */

/* With that done, a variable pointing to each of the buttons is now required: */

  var playpause = document.getElementById('playpause');
  var stop = document.getElementById('stop');
  var mute = document.getElementById('mute');
  var volinc = document.getElementById('volinc');
  var voldec = document.getElementById('voldec');
  var progress = document.getElementById('progress');
  var progressBar = document.getElementById('progress-bar');
  var fullscreen = document.getElementById('fs');

/*  Using these handles, events can now be attached to each of the custom control buttons making them interactive.
    Most of these buttons require a simple click event listener to be added, and a Media API defined method and/or
    attributes to be called/checked on the video. */

  // Play/Pause
  playpause.addEventListener('click', function(e) {
    if (video.paused || video.ended) video.play();
    else video.pause();
  });

/*  When a click event is detected on the play/pause button, the handler first of all checks if the video is
    currently paused or has ended (via the Media API's paused and ended attributes); if so, it uses the play() method
    to playback the video. Otherwise the video must be playing, so it is paused using the pause() method. */

  //Stop
  stop.addEventListener('click', function(e) {
    video.pause();
    video.currentTime = 0;
    progress.value = 0;
  });

/*  The Media API doesn't have a stop method, so to mimic this the video is paused, and its currentTime (i.e. the
    video's current playing position) and the <progress> element's position is set to 0 (more on the <progress>
    element later). */

  // Mute
  mute.addEventListener('click', function(e) {
    video.muted = !video.muted;
  });

/*  The mute button is a simple toggle button that uses the Media API's muted attribute to mute the video: this is a
    Boolean indicating whether the video is muted or not. To get it to toggle, we set it to the inverse of itself. */

  //Volume
  volinc.addEventListener('click', function(e) {
    alterVolume('+');
  });
  voldec.addEventListener('click', function(e) {
    alterVolume('-');
  });

/*  Two volume control buttons have been defined, one for increasing the volume and another for decreasing it. A user
    defined function, alterVolume(direction) has been created that deals with this: */

  var alterVolume = function(dir) {
    var currentVolume = Math.floor(video.volume * 10) / 10;
    if (dir === '+') {
      if (currentVolume < 1) video.volume += 0.1;
    }
    else if (dir === '-') {
      if (currentVolume > 0) video.volume -= 0.1;
    }
  }

/*  This function makes use of the Media API's volume attribute, which holds the current volume value of the video.
    Valid values for this attribute are 0 and 1 and anything in between. The function checks the dir parameter, which
    indicates whether the volume is to be increased (+) or decreased (-) and acts accordingly. The function is defined
    to increase or decrease the video's volume attribute in steps of 0.1, ensuring that it doesn't go lower than 0 or
    higher than 1. */

    //Progress

/*  When the <progress> element was defined above in the HTML, only two attributes were set, value and min, both
    being given a value of 0. The function of these attributes is self-explanatory, with min indicating the minimum
    allowed value of the progress element and value indicating its current value. It also needs to have a maximum
    value set so that it can display its range correctly, and this can be done via the max attribute, which needs to
    be set to the maximum playing time of the video. This is obtained from the video's duration attribute, which
    again is part of the Media API. */

/*  Ideally, the correct value of the video's duration attribute is available when the loadedmetadata event is raised,
    which occurs when the video's metadata has been loaded: */

    video.addEventListener('loadedmetadata', function() {
      progress.setAttribute('max', video.duration);
    });

/*  Unfortunately in some mobile browsers, when loadedmetadata is raised — if it even is raised — video.duration may
    not have the correct value, or even any value at all. So something else needs to be done. More on that below. */

/*  Another event, timeupdate, is raised periodically as the video is being played through. This event is ideal for
    updating the progress bar's value, setting it to the value of the video's currentTime attribute, which indicates
    how far through the video the current playback is. */

    video.addEventListener('timeupdate', function() {
      progress.value = video.currentTime;
      progressBar.style.width = Math.floor((video.currentTime / video.duration) * 100) + '%';
    });

/*  As the timeupdate event is raised, the progress element's value attribute is set to the video's currentTime.
    The <span> element mentioned earlier, for browsers that do not support the <progress> element (e.g. Internet
    Explorer 9), is also updated at this time, setting its width to be a percentage of the total time played.
    This span has a solid CSS background colour, which helps it provide the same visual feedback as a <progress>
    element. */

/*  Coming back to the video.duration problem mentioned above, when the timeupdate event is raised, in most mobile
    browsers the video's duration attribute should now have the correct value. This can be taken advantage of to set
    the progress element's max attribute if it is currently not set: */

    video.addEventListener('timeupdate', function() {
      if (!progress.getAttribute('max')) progress.setAttribute('max', video.duration);
      progress.value = video.currentTime;
      progressBar.style.width = Math.floor((video.currentTime / video.duration) * 100) + '%';
    });

/*  Note: for more information and ideas on progress bars and buffering feedback, read "Media buffering, seeking, and
    time ranges" [https://developer.mozilla.org/en-US/Apps/Build/Manipulating_media/buffering_seeking_time_ranges] */

    // Skip Ahead
/*  Another feature of most browser default video control sets is the ability to click on the video's progress bar to
    "skip ahead" to a different point in the video. This can also be achieved by adding a simple click event listener
    to the progress element: */

    progress.addEventListener('click', function(e) {
      var pos = (e.pageX  - this.offsetLeft) / this.offsetWidth;
      video.currentTime = pos * video.duration;
    });

/*  This piece of code simply uses the clicked position to (roughly) work out where in the progress element the user
    has clicked, and to move the video to that position by setting its currentTime attribute. */

    // Fullscreen

/*  The Fullscreen API should be straight forward to use: the user clicks a button, if the video is in fullscreen
    mode: cancel it, otherwise enter fullscreen mode. */

/*  Alas it has been implemented in browsers in a number of weird and wonderful ways which requires a lot of extra
    code to check for various prefixed versions of attributes and methods so as to call the right one. */

/*  To detect if a browser actually supports the Fullscreen API and that it is enabled, the following may be called: */

var fullScreenEnabled = !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen);

/*  This simply tests all the different prefixed (and of course the non-prefixed!) booleans to see if fullscreen is
    possible. The final tested value, document.createElement('video').webkitRequestFullScreen is required for the
    last Presto version of Opera (12.14). Note the different letter casing in the various values. */

/*  The visibility of the fullscreen button depends on whether the browser supports the Fullscreen API and that it
    is enabled: */

    if (!fullScreenEnabled) {
      fullscreen.style.display = 'none';
    }

/*  Naturally the fullscreen button needs to actually do something, so, like the other buttons, a click event handler
    is attached in which we call a user defined function handleFullscreen: */

    fs.addEventListener('click', function(e) {
      handleFullscreen();
    });

/*  The handleFullscreen function is defined as follows: */

    var handleFullscreen = function() {
      if (isFullScreen()) {
        if (document.exitFullscreen) document.exitFullscreen();
          else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
          else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
          else if (document.msExitFullscreen) document.msExitFullscreen();
          setFullscreenData(false);
      } else {
          if (videoContainer.requestFullscreen) videoContainer.requestFullscreen();
          else if (videoContainer.mozRequestFullScreen) videoContainer.mozRequestFullScreen();
          else if (videoContainer.webkitRequestFullScreen) video.webkitRequestFullScreen();
          else if (videoContainer.msRequestFullscreen) videoContainer.msRequestFullscreen();
          setFullscreenData(true);
      }
    }

/*  First of all the function checks if the browser is already in fullscreen mode by calling another function
    isFullScreen: */

    var isFullScreen = function() {
      return !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
    }

/*  This function checks all the various browser prefxed versions to try and determing the correct result. */

/*  If the browser is currently in fullscreen mode, then it must be exited and vice versa. Support for the different
    prefixed versions of the relevant action are checked in order to call the correct one. Interestingly document must
    be used for exiting/cancelling fullscreen mode, whereas any HTML element can request fullscreen mode, here the
    videoContainer is used as it also contains the custom controls which should also appear with the video in
    fullscreen mode. */

/*  The exception to this is Safari 5.1, which will only allow webkitRequestFullScreen to be called on the <video>
    element. The custom controls will only appear on this browser in fullscreen mode with some WebKit specific CSS:

    1. The default browser controls have to be hidden with video::-webkit-media-controls { display:none !important; }
    2. The custom controls container needs to have a special z-index value: .controls { z-index:2147483647; }

/*  Dealing with WebKit-specific code in this way will affect all WebKit browsers, but everything works as expected
    in more advanced WebKit browsers such as Chrome and the latest Opera. */

/*  Another user defined function — setFullscreenData() — is also called, which simply sets the value of a
    data-fullscreen attribute on the videoContainer (this makes use of data-states).
    https://toddmotto.com/stop-toggling-classes-with-js-use-behaviour-driven-dom-manipulation-with-data-states/ */

    var setFullscreenData = function(state) {
      videoContainer.setAttribute('data-fullscreen', !!state);
    }

/*  This is used simply to set some basic CSS to improve the styling of the custom controls when they are in
    fullscreen (see the sample code for further details). When a video goes into fullscreen mode, it usually displays
    a message indicating that the user can press the Esc key to exit fullscreen mode, so the code also needs to listen
    for relevant events in order to call the setFullscreenData function to ensure the control styling is correct: */

    document.addEventListener('fullscreenchange', function(e) {
      setFullscreenData(!!(document.fullScreen || document.fullscreenElement));
    });
    document.addEventListener('webkitfullscreenchange', function() {
      setFullscreenData(!!document.webkitIsFullScreen);
    });
    document.addEventListener('mozfullscreenchange', function() {
      setFullscreenData(!!document.mozFullScreen);
    });
    document.addEventListener('msfullscreenchange', function() {
      setFullscreenData(!!document.msFullscreenElement);
    });

/* https://developer.mozilla.org/en-US/Apps/Fundamentals/Audio_and_video_delivery/Adding_captions_and_subtitles_to_HTML5_video */
    //Subtitle implementation
/*  A lot of what we do to access the video subtitles revolves around JavaScript. Similar to the video
    controls, if a browser supports HTML5 video subtitles, there will be a button provided within the native
    control set to access them. However, since we have defined our own video controls, this button is hidden,
    and we need to define our own. */

/*  Browsers do vary as to what they support, so we will be attempting to bring a more unified UI to each
    browser where possible. There's more on browser compatibility issues later on. */

    //Initial setup
/*  As with all the other buttons, one of the first things we need to do is store a handle to the subtitles'
    button: */

    var subtitles = document.getElementById('subtitles');

/*  We also initially turn off all subtitles, in case the browser turns any of them on by default: */

    for (var i = 0; i < video.textTracks.length; i++) {
      video.textTracks[i].mode = 'hidden';
      console.log(i);
    }

/*  The video.textTracks property contains an array of all the text tracks attached to the video. We loop
    through each one and set its mode to hidden. */

/*  Note: The WebVTT API [https://w3c.github.io/webvtt/#api] gives us access to all the text tracks that are
    defined for an HTML5 video using the <track> element. */

    //Building a caption menu

/*  Our aim is to use the subtitles button we added earlier to display a menu that allows users to choose
    which language they want the subtitles displayed in, or to turn them off entirely.

    We have added the button, but before we make it do anything, we need to build the menu that goes with it.
    This menu is built dynamically, so that languages can be added or removed later by simply editing the
    <track> elements within the video's markup. */


    /* ----------------------------- */
    /*  The creation of each list item and button is done by the createMenuItem() function, which is defined as
        follows: */

        var subtitleMenuButtons = [];
        var createMenuItem = function(id, lang, label) {
          var listItem = document.createElement('li');
          var button = listItem.appendChild(document.createElement('button'));
          button.setAttribute('id', id);
          button.className = 'subtitles-button';
          if (lang.length > 0) button.setAttribute('lang', lang);
          button.value = label;
          button.setAttribute('data-state', 'inactive');
          button.appendChild(document.createTextNode(label));

          button.addEventListener('click', function(e) {
            // Set all buttons to inactive
            subtitleMenuButtons.map(function(v, i, a) {
              subtitleMenuButtons[i].setAttribute('data-state', 'inactive');
            });

            // Find the language to activate
            var lang = this.getAttribute('lang');
            for (var i = 0; i < video.textTracks.length; i++) {
              // For the 'subtitles-off' button, the first condition will never match so all will subtitles be turned off
              if (video.textTracks[i].language == lang) {
                video.textTracks[i].mode = 'showing';
                this.setAttribute('data-state', 'active');
              } else {
                video.textTracks[i].mode = 'hidden';
              }
            }
            subtitlesMenu.style.display = 'none';
          });

          subtitleMenuButtons.push(button);
          return listItem;
        }

    /*  This function builds the required <li> and <button> elements, and returns them so they can be added to the
        subtitles menu list. It also sets up the required event listeners on the button to toggle the relevant subtitle
        set on or off. This is done by simply setting the required subtlte's mode attribute to showing, and setting the
        others to hidden. */
    /* ----------------------------- */



/*  All we need to do is to go through the video's textTracks, reading their properties and building the menu
    up from there: */

    var subtitlesMenu;
    if (video.textTracks) {
      var df = document.createDocumentFragment();
      var subtitlesMenu = df.appendChild(document.createElement('ul'));
      subtitlesMenu.className = 'subtitles-menu';
      subtitlesMenu.appendChild(createMenuItem('subtitles-off', '', 'Off'));
      for (var i = 0; i < video.textTracks.length; i++) {
        subtitlesMenu.appendChild(createMenuItem('subtitles-' + video.textTracks[i].language, video.textTracks[i].language, video.textTracks[i].label));
      }
      videoContainer.appendChild(subtitlesMenu);
    }

/*  This code creates a documentFragment, which is used to hold an unordered list containing our subtitles menu.
    First of all an option is added to allow the user to switch all subtitles off, and then buttons are added
    for each text track, reading the language and label from each one. */

/*  Once the menu is built, it is then inserted into the DOM at the bottom of the videoContainer.

    Initially the menu is hidden by default, so an event listener needs to be added to our subtitles button to
    toggle it: */

    subtitles.addEventListener('click', function(e) {
      if (subtitlesMenu) {
        subtitlesMenu.style.display = (subtitlesMenu.style.display == 'block' ? 'none' : 'block');
      }
    });
}
