var currSong = new Audio();
var color;
var playlist;
var songInterval = 0;
var playing = false;
var raf;

function updateSlider() {
  document.querySelector(".song-time").max = currSong.duration;
  document.querySelector(".song-time").value = currSong.currentTime;
  if (currSong.currentTime) {
    document.querySelector(".current-time").innerText = toMinutes(Math.trunc(currSong.currentTime));
    document.querySelector(".total-time").innerText = toMinutes(Math.trunc(currSong.duration));
  }

  if (currSong.currentTime === currSong.duration) {
    nextSong();
  }
}

document.querySelector(".song-time").addEventListener("input", (event) => {
  clearInterval(raf);
});

document.querySelector(".song-time").addEventListener("change", (event) => {
  currSong.currentTime = document.querySelector(".song-time").value;
  raf = setInterval(updateSlider, 0);
});

document.querySelector("#song-input").addEventListener("change", (event) => {
  document.querySelector(".song-time").value = "0";
  playlist = event.target.files;
  songInterval = 0;
  currSong.src = URL.createObjectURL(playlist[songInterval]);
  getSongInfo(playlist[songInterval]);
  playSong();
});

function playSong() {
  clearInterval(raf);
  raf = setInterval(updateSlider, 0);
  playing = true;
  currSong.play();
  document.querySelector(".play").classList.add("hidden");
  document.querySelector(".pause").classList.remove("hidden");
}

function pauseSong() {
  clearInterval(raf);
  playing = false;
  currSong.pause();
  document.querySelector(".play").classList.remove("hidden");
  document.querySelector(".pause").classList.add("hidden");
}

function previousSong() {
  songInterval--;
  if (songInterval < 0) {
    songInterval = 0;
  }
  currSong.src = URL.createObjectURL(playlist[songInterval]);
  getSongInfo(playlist[songInterval]);
}

function nextSong() {
  songInterval++;
  if (songInterval > Object.keys(playlist).length - 1) {
    songInterval = Object.keys(playlist).length - 1;
  }
  currSong.src = URL.createObjectURL(playlist[songInterval]);
  getSongInfo(playlist[songInterval]);
}

function averageColor(imageElement) {
  var canvas = document.createElement("canvas"),
    context = canvas.getContext("2d"),
    imgData, width, height,
    length,
    rgb = { r: 0, g: 0, b: 0 },
    count = 0;
  height = canvas.height =
    imageElement.naturalHeight ||
    imageElement.offsetHeight ||
    imageElement.height;
  width = canvas.width =
    imageElement.naturalWidth ||
    imageElement.offsetWidth ||
    imageElement.width;
  context.drawImage(imageElement, 0, 0);
  imgData = context.getImageData(0, 0, width, height);
  length = imgData.data.length;

  for (var i = 0; i < length; i += 4) {
    rgb.r += imgData.data[i];
    rgb.g += imgData.data[i + 1];
    rgb.b += imgData.data[i + 2];
    count++;
  }

  rgb.r = Math.floor(rgb.r / count);
  rgb.g = Math.floor(rgb.g / count);
  rgb.b = Math.floor(rgb.b / count);

  return rgb;
}

function toMinutes(s) {
  return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;
}

function getSongInfo(song) {
  document.querySelector(".song-img").style.opacity = 0;
  jsmediatags.read(song, {
    onSuccess: function(tag) {
      const data = tag.tags.picture.data;
      const format = tag.tags.picture.format;
      let base64String = "";
      for (let i = 0; i < data.length; i++) {
        base64String += String.fromCharCode(data[i]);
      }
      setTimeout(() => {
        document.querySelector(".song-img").style.opacity = 1;
        document.querySelector(".song-img").src = `data:${format};base64,${window.btoa(base64String)}`;
      }, 500);
      document.querySelector(".song-img").onload = () => {
        color = averageColor(document.querySelector(".song-img"));
        document.querySelector(".background").style.background = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
        document.querySelector(".song-img").style.border = "5px solid rgb(" + color.r + "," + color.g + "," + color.b + ")";
        if (playing) {
          currSong.play();
        }
      }
      document.querySelector(".song-title").innerText = tag.tags.title;
      document.querySelector(".song-artist").innerText = tag.tags.artist;
    },
    onError: function() {
      document.querySelector(".song-img").src = "album-placeholder.png";
      document.querySelector(".background").style.background = "limegreen";
      document.querySelector(".song-title").innerText = song.name;
      document.querySelector(".song-artist").innerText = "unknown";
      setTimeout(() => {
        document.querySelector(".song-img").style.opacity = 1;
      }, 500);
    }
  });
}