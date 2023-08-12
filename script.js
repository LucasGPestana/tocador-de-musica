//DOM - Entendimento da estrutura da página HTML pelo navegador
//document referencia o DOM

// Botões
const buttons = window.document.getElementsByTagName("button");
const play_button = window.document.getElementById("play");
const previous_button = window.document.getElementById("previous");
const next_button = window.document.getElementById("next");
const shuffle = window.document.getElementById("shuffle");
const repeat_button = window.document.getElementById("repeat")
const like_button = window.document.getElementById("like");

// Barra de Progresso
const current_progress = window.document.getElementById("current-progress");
const progress_container = window.document.getElementById("progress-container");
const song_time = window.document.getElementById("song-time");
const song_to_end = window.document.getElementById("song-to-end")

// Informações da música
const song_name = window.document.getElementById("song-name");
const band_name = window.document.getElementById("band-name");
const cover = window.document.getElementById("cover");
const song = window.document.getElementById("audio");

let isShuffled = false;
let isRepeated = false;

const agentRed =  {
    song: "Agent Red",
    artist: "Abbynoise",
    file: "agent-red",
    favorite: false
};

const rawPower =  {
    song: "Raw Power",
    artist: "Cruen",
    file: "raw-power",
    favorite: false
};

const traceRoute = {
  song: "Trace Route",
  artist: "BoxCat Games",
  file: "trace-route",
  favorite: false
}

const original_playlist = JSON.parse(localStorage.getItem("playlist")) ?? [agentRed, rawPower, traceRoute]; // ?? - Coalescência nula: caso o valor da esquerda exista, o mesmo será utilizado. Caso não, o próximo será
let sorted_playlist = original_playlist.slice(); // Copia os elementos do array
const playlist_name = window.document.getElementById("playlist-name");
let index = 0;

function initializePage() {
  playlist_name.innerText = localStorage.getItem("playlist-name") ?? "Nome da Playlist"
  initializeSong();
}

function playSong() {
  play_button.querySelector(".bi").classList.remove("bi-play-circle"); // a consulta pelo seletor será feita apenas por elementos internos
  play_button.querySelector(".bi").classList.add("bi-pause-circle");
  song.play();
}

function pauseSong() {
  play_button.querySelector(".bi").classList.remove("bi-pause-circle");
  play_button.querySelector(".bi").classList.add("bi-play-circle");
  song.pause();
}

function initializeSong() {
  cover.src = `imagens/${sorted_playlist[index].file}.webp`;
  song_name.innerText = sorted_playlist[index].song;
  band_name.innerText = sorted_playlist[index].artist;
  song.src = `musicas/${sorted_playlist[index].file}.mp3`;
  likeButtonRender(); // Verifica se o status atual da propriedade favorite é true ou false e, assim, configura o estilo do botão
}

function previousSong() {
  if (index === 0) {
    index = sorted_playlist.length - 1;
  } else {
    index--;
  }
  initializeSong();
  playSong();
}

function nextSong() {
  if (index === sorted_playlist.length - 1) {
    index = 0;
  } else {
    index++;
  }
  initializeSong();
  playSong();
}

function updateProgress() {
  let porcentagem = (song.currentTime / song.duration) * 100;
  current_progress.style.setProperty("--progress", `${porcentagem}%`);

  song_time.innerText = convertToTradTime(song.currentTime)
  song_to_end.innerText = convertToTradTime(song.duration - song.currentTime)
}

function updateTotalTime() {
  song_to_end.innerText = convertToTradTime(song.duration)
}

function convertToTradTime(original_number) {
  let hours = Number.parseInt(original_number / 3600);
  let minutes = Number.parseInt((original_number - (hours * 3600)) / 60);
  let seconds = Number.parseInt(original_number - (hours * 3600) - (minutes * 60));

  if (hours != 0) {
    return String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
  } else {
    return String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
  }
}

function jumpTo(mouse_event) {
  const width = progress_container.clientWidth;
  const click_position = mouse_event.offsetX; // Propriedade do evento do mouse que pega a posição de clique do mouse a partir do lado esquerdo do elemento referenciado no evento
  console.log(mouse_event.offsetX)
  const jump_to_time = (click_position / width) * song.duration;
  song.currentTime = jump_to_time;
}

function shuffleArray(pre_shuffle_array) {
  let size = pre_shuffle_array.length;
  let current_index = size - 1;

  while (current_index > 0) {
    let random_index = Number.parseInt(Math.random() * size);
    let aux = pre_shuffle_array[current_index];

    pre_shuffle_array[current_index] = pre_shuffle_array[random_index];
    pre_shuffle_array[random_index] = aux;

    current_index--;
    size--;
  }
}

function shuffleButtonClicked() {
  if (!isShuffled) {
    isShuffled = true;
    shuffleArray(sorted_playlist);
    shuffle.classList.add("button-active");
  } else {
    isShuffled = false;
    sorted_playlist = [...original_playlist];
    shuffle.classList.remove("button-active");
  }
}

function repeatButtonClicked() {
  if (!isRepeated) {
    isRepeated = true;

    repeat_button.classList.add("button-active");
  } else {
    isRepeated = false;

    repeat_button.classList.remove("button-active");
  }
}

play_button.addEventListener("click", function() {
  if (song.paused) {
    playSong();
  } else {
    pauseSong();
  }
})

function nextOrRepeat() {
  if (!isRepeated) {
    nextSong();
  } else {
    playSong();
  }
}

function likeButtonRender() { // Essa função serve para atualizar o estilo do botão de acordo com o valor da propriedade favorite

  if (sorted_playlist[index].favorite) {
    like_button.querySelector(".bi").classList.remove("bi-hand-thumbs-up");
    like_button.querySelector(".bi").classList.add("bi-hand-thumbs-up-fill");
    like_button.classList.add("button-active");
  } else {
    like_button.querySelector(".bi").classList.remove("bi-hand-thumbs-up-fill");
    like_button.querySelector(".bi").classList.add("bi-hand-thumbs-up");
    like_button.classList.remove("button-active");
  }

}

function likeButtonClicked() {
  if (!sorted_playlist[index].favorite) {
    sorted_playlist[index].favorite = true;
  } else {
    sorted_playlist[index].favorite = false;
  }
  likeButtonRender();
  saveData();
}

function saveData() {
  localStorage.setItem("playlist", JSON.stringify(original_playlist));
}

this.addEventListener("load", initializePage);

previous_button.addEventListener("click", previousSong);

next_button.addEventListener("click", nextSong);

song.addEventListener("timeupdate", updateProgress);

song.addEventListener("ended", nextOrRepeat);

song.addEventListener("loadedmetadata", updateTotalTime);

progress_container.addEventListener("click", jumpTo);

shuffle.addEventListener("click", shuffleButtonClicked);

repeat_button.addEventListener("click", repeatButtonClicked);

like_button.addEventListener("click", likeButtonClicked);

for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("mouseover", function() {
    buttons[i].classList.add("button-hover");
  })
  buttons[i].addEventListener("mouseout", function() {
    buttons[i].classList.remove("button-hover");
  })
}

playlist_name.addEventListener("input", function() {
  localStorage.setItem("playlist-name", playlist_name.innerText)
})