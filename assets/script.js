let currentSlide = 0;
let autoSlideTimer;

const slides = [
  { type: "photo", src: "media/photo1.jpg", caption: "This is where our story began." },
  { type: "photo", src: "media/photo2.jpg", caption: "Laughs like these stay forever." },
  { type: "photo", src: "media/photo3.jpg", caption: "Your eyes had me stuck in a loop." },
  { type: "photo", src: "media/photo4.jpg", caption: "Pink skies and you." },
  { type: "photo", src: "media/photo5.jpg", caption: "Could look at you forever." },
  { type: "video", src: "media/video1.mp4", caption: "Remember this moment?" },
  { type: "video", src: "media/video2.mp4", caption: "My chaos, my calm." },
  { type: "video", src: "media/video3.mp4", caption: "Caught in the act of being adorable." },
  { type: "video", src: "media/video4.mp4", caption: "The way you smile 🥹" },
  { type: "video", src: "media/video5.mp4", caption: "And you stole the show again." }
];

function showSlide(index) {
  const img = document.getElementById("slide-img");
  const video = document.getElementById("slide-video");
  const caption = document.getElementById("slide-caption");
  const slide = slides[index];

  // Reset opacity for transition
  img.style.opacity = 0;
  video.style.opacity = 0;

  setTimeout(() => {
    if (slide.type === "photo") {
      img.src = slide.src;
      img.hidden = false;
      video.hidden = true;
      caption.textContent = slide.caption;
      img.style.opacity = 1;
    } else {
      video.src = slide.src;
      video.hidden = false;
      img.hidden = true;
      caption.textContent = slide.caption;

      // Autoplay video smoothly
      video.autoplay = true;
      video.muted = true;
      video.loop = false;

      video.oncanplay = () => {
        video.play();
        video.style.opacity = 1;
      };

      // Pause auto-slideshow during video
      clearInterval(autoSlideTimer);
      video.onended = () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
        startAutoSlide(); // resume autoSlide
      };
    }
  }, 200);
}

function startAutoSlide() {
  clearInterval(autoSlideTimer);
  autoSlideTimer = setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }, 3000); // 3 sec for photo
}

function nextPage(id) {
  const pages = document.querySelectorAll(".page");
  pages.forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  // Start slideshow
  if (id === "slideshow") {
    currentSlide = 0;
    showSlide(currentSlide);
    startAutoSlide();
  }

  // Load quiz when needed
  if (id === "quiz") showQuestion();

  // Play music on first interaction
  const audio = document.getElementById("bg-music");
  if (audio && audio.paused) {
    audio.play().catch(e => {
      console.warn("Autoplay failed:", e);
    });
  }
}




// QUIZ FUNCTIONALITY
const quizData = [
  {
    question: "What did I notice about you in the first sight when we met?",
    options: ["👀 Eyes", "👗 Outfit", "😊 Smile", "🎤 Voice"],
    answer: "👗 Outfit"
  },
  {
    question: "Where did we go after the Lover Fest?",
    options: ["🍔 Burger King", "☕ Starbucks", "🍟 McDonalds", "🏠 Home"],
    answer: "🍟 McDonalds"
  },
  {
    question: "Where did we go for our first bike ride?",
    options: ["🌄 Sholay shooting spot", "🥤 Philly's", "🍰 A cute cafe next to highway", "🏙️ HSR"],
    answer: "🍰 A cute cafe next to highway"
  },
  {
    question: "What song would always remind me of you?",
    options: ["✨ Enchanted", "💖 Lover", "🌅 Daylight", "🎸 Fearless"],
    answer: "💖 Lover"
  },
  {
    question: "Our cute fights are about?",
    options: ["🍕 Food", "🌧️ Mood", "📱 Texts", "👚 Outfits"],
    answer: "🌧️ Mood"
  }
];


let currentQuestion = 0;
let score = 0;

function showQuestion() {
  const q = quizData[currentQuestion];
  document.getElementById("question-text").innerText = q.question;
  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";
  document.getElementById("feedback").innerText = "";

  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.classList.add("option-btn");
    btn.innerText = option;
    btn.onclick = () => checkAnswer(btn, q.answer);
    optionsContainer.appendChild(btn);
  });
}

function checkAnswer(button, correctAnswer) {
  const buttons = document.querySelectorAll(".option-btn");
  buttons.forEach(btn => btn.disabled = true);

  if (button.innerText === correctAnswer) {
    button.classList.add("correct");
    document.getElementById("feedback").innerText = "Yay! You're right! 💖";
    score++;
  } else {
    button.classList.add("wrong");
    document.getElementById("feedback").innerText = `Oops! Correct: ${correctAnswer}`;
    buttons.forEach(btn => {
      if (btn.innerText === correctAnswer) btn.classList.add("correct");
    });
  }

  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
      showQuestion();
    } else {
      showQuizEnd();
    }
  }, 1800);
}

function showQuizEnd() {
  document.getElementById("quiz-box").style.display = "none";
  document.getElementById("quiz-end").style.display = "block";
  document.getElementById("final-score").innerText = score;

  const rewardMsg = document.getElementById("reward-message");
  const rewardGift = document.getElementById("reward-gift");

  // Clear previous content
  rewardMsg.innerHTML = "";
  rewardGift.innerHTML = "";

  // 🎁 Surprise gifts based on score
  if (score === 5) {
    rewardMsg.innerText = "Perfect score! You're my Memory Master 💖";
    rewardGift.innerHTML = "🎁 ✨ A forever ticket to all my cuddles ✨";
  } else if (score === 4) {
    rewardMsg.innerText = "Wow! You're almost perfect 😘";
    rewardGift.innerHTML = "🧸 Free cuddles + a tight hug anytime you want!";
  } else if (score === 3) {
    rewardMsg.innerText = "Awww you're trying, and I love that! 🥺💗";
    rewardGift.innerHTML = "🍩 A donut date on me!";
  } else if (score === 2) {
    rewardMsg.innerText = "You got some right! Still cute tho 😌";
    rewardGift.innerHTML = "🍫 A bar of your fav chocolate (guess which)";
  } else {
    rewardMsg.innerText = "It’s okay, we’re still the cutest 😘";
    rewardGift.innerHTML = "💌 A handwritten letter from me — just for you.";
  }
}

// SWIPE GESTURE SUPPORT
let startX = 0;

const slideshowElement = document.getElementById("slideshow");

slideshowElement.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

slideshowElement.addEventListener("touchend", (e) => {
  const endX = e.changedTouches[0].clientX;
  handleSwipe(endX - startX);
});

slideshowElement.addEventListener("mousedown", (e) => {
  startX = e.clientX;
});

slideshowElement.addEventListener("mouseup", (e) => {
  const endX = e.clientX;
  handleSwipe(endX - startX);
});

function handleSwipe(diff) {
  if (Math.abs(diff) > 50) {
    // Reset auto slide timer
    clearInterval(autoSlideTimer);
    if (diff < 0) {
      // Swipe left → next
      currentSlide = (currentSlide + 1) % slides.length;
    } else {
      // Swipe right → previous
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    }
    showSlide(currentSlide);
    startAutoSlide();
  }
}

function toggleLetter(id) {
  const el = document.getElementById(id);
  el.style.display = el.style.display === "block" ? "none" : "block";
}

function openLetter(id) {
  document.getElementById(id).style.display = "block";
}

function closeLetter(id) {
  document.getElementById(id).style.display = "none";
}

// Heart Sparkle Particles 💖
const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let hearts = [];

function createHeart(x = null, y = null, burst = false) {
  const count = burst ? 10 : 1;
  for (let j = 0; j < count; j++) {
    const size = Math.random() * 6 + 4;
    hearts.push({
      x: x !== null ? x + (Math.random() - 0.5) * 100 : Math.random() * canvas.width,
      y: y !== null ? y + (Math.random() - 0.5) * 100 : canvas.height + size,
      size,
      speed: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.3,
    });
  }
}

function drawHearts() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hearts.forEach((h, i) => {
    ctx.globalAlpha = h.opacity;
    ctx.fillStyle = "#ff85c1";
    ctx.beginPath();
    ctx.moveTo(h.x, h.y);
    ctx.bezierCurveTo(h.x + h.size, h.y - h.size,
                      h.x + h.size * 2, h.y + h.size,
                      h.x, h.y + h.size * 2);
    ctx.bezierCurveTo(h.x - h.size * 2, h.y + h.size,
                      h.x - h.size, h.y - h.size,
                      h.x, h.y);
    ctx.fill();
    ctx.closePath();

    h.y -= h.speed;
    h.x += Math.sin(h.y / 50) * 0.5;
    h.opacity -= 0.001;

    if (h.opacity <= 0 || h.y < -20) {
      hearts.splice(i, 1);
    }
  });
  ctx.globalAlpha = 1;
}

function animate() {
  drawHearts();
  requestAnimationFrame(animate);
}

setInterval(() => {
  for (let i = 0; i < 3; i++) createHeart(); // generates 3 hearts every 150ms
}, 200);
animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

if (document.getElementById("quiz")) {
  showQuestion();
}

function hideSurpriseText() {
  const text = document.getElementById("celebrate-text");
  if (text) text.style.display = "none";
}


function claimSurprise() {
  const container = document.getElementById("confetti");
  container.innerHTML = ""; // Clear previous

  const emojis = ["💖", "🎉", "💫", "🥳", "🌸", "✨", "🩷"];
  const count = 30;

  for (let i = 0; i < count; i++) {
    const span = document.createElement("span");
    span.className = "emoji-burst";
    span.innerText = emojis[Math.floor(Math.random() * emojis.length)];

    const x = Math.random() * window.innerWidth - 100;
    const delay = Math.random() * 0.5;

    span.style.left = `${x}px`;
    span.style.animationDelay = `${delay}s`;

    container.appendChild(span);
  }

  document.getElementById("claimBtn").disabled = true;
  document.getElementById("claimBtn").innerText = "🎊 Claimed!";

  setTimeout(() => {
    nextPage('surprise');
    setTimeout(hideSurpriseText, 4000); // hides animated text after 4s
  }, 2000);
}

