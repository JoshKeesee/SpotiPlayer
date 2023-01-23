var currSong;
var color;

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
      document.querySelector(".song-img").onload = () => {
        color = averageColor(document.querySelector(".song-img"));
        document.querySelector(".background").style.background = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
      }
      document.querySelector(".song-title").innerText = tag.tags.title;
      document.querySelector(".song-artist").innerText = tag.tags.artist;
    },
    onError: function() {
      document.querySelector(".song-img").src = "album-placeholder.png";
      document.querySelector(".background").style.background = "limegreen";
      document.querySelector(".song-title").innerText = song.name;
      document.querySelector(".song-artist").innerText = "unknown";
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