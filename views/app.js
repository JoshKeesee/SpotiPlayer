var currSong;

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
        document.querySelector(".song-title").innerText = tag.tags.title;
        document.querySelector(".song-artist").innerText = tag.tags.artist;
        }
    });
});

function play() {
  currSong.play();
  document.querySelector(".play").classList.add("hidden");
  document.querySelector(".pause").classList.remove("hidden");
}

function pause() {
  currSong.pause();
  document.querySelector(".play").classList.remove("hidden");
  document.querySelector(".pause").classList.add("hidden");
}