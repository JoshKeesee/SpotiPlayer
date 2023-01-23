var currSong;
var background = "limegreen";

document.querySelector("#song-input").addEventListener("change", (event) => {
  const song = event.target.files[0];
  currSong = new Audio();
  currSong.src = URL.createObjectURL(song);
  jsmediatags.read(song, {
      onSuccess: function(tag) {
        const data = tag.tags.picture.data;
        const format = tag.tags.picture.format;
        let base64String = "";
        for (let i = 0; i < data.length; i++) {
          base64String += String.fromCharCode(data[i]);
        }
        document.querySelector(".song-img").src = `data:${format};base64,${window.btoa(base64String)}`;
        const rgb = getAverageRGB(document.querySelector(".song-img"));
        document.querySelector(".container").style.background = 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';
        document.querySelector(".song-title").innerText = tag.tags.title;
        document.querySelector(".song-artist").innerText = tag.tags.artist;
        }
    });
});

function playSong() {
  currSong.play();
  document.querySelector(".play").classList.add("hidden");
  document.querySelector(".pause").classList.remove("hidden");
}

function pauseSong() {
  currSong.pause();
  document.querySelector(".play").classList.remove("hidden");
  document.querySelector(".pause").classList.add("hidden");
}

function getAverageRGB(imgEl) {

    var blockSize = 5, // only visit every 5 pixels
        defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height,
        i = -4,
        length,
        rgb = {r:0,g:0,b:0},
        count = 0;

    if (!context) {
        return defaultRGB;
    }

    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

    context.drawImage(imgEl, 0, 0);

    try {
        data = context.getImageData(0, 0, width, height);
    } catch(e) {
        /* security error, img on diff domain */
        return defaultRGB;
    }

    length = data.data.length;

    while ( (i += blockSize * 4) < length ) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i+1];
        rgb.b += data.data[i+2];
    }

    // ~~ used to floor values
    rgb.r = ~~(rgb.r/count);
    rgb.g = ~~(rgb.g/count);
    rgb.b = ~~(rgb.b/count);

    return rgb;
}