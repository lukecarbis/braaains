const zombie = document.getElementById('zombie');
const scene = document.getElementById('underlay');
  
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight - 128;

// logical centre position of the zombie (independent of transforms)
let posX = window.innerWidth / 2;
let posY = window.innerHeight;

// new: death state
let isDead = false;

scene.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// new: kill the zombie on click
zombie.addEventListener('click', (e) => {
  if (isDead) return;          // ignore extra clicks
  isDead = true;
  zombie.src = '/die.gif';      // non-looping death animation
  zombie.dataset.mode = 'dead';
});

function animate() {
  // if dead, stop all movement and mode switching
  if (isDead) {
	return; // zombie stays wherever it died
  }

  const width  = zombie.offsetWidth;
  const height = zombie.offsetHeight;

  const lerp = 0.005;

  // compute distance from zombie centre to mouse
  const dx = mouseX - posX;
  const dy = mouseY - posY;
  const distance = Math.hypot(dx, dy);

  const attackRange = 30;

  // switch mode
  if (distance < attackRange) {
	if (zombie.dataset.mode !== 'attack') {
	  zombie.src = '/attack.gif';
	  zombie.dataset.mode = 'attack';
	}
  } else {
	if (zombie.dataset.mode !== 'walk') {
	  zombie.src = '/walk.gif';
	  zombie.dataset.mode = 'walk';
	}
  }

  // only move if in walk mode
  if (zombie.dataset.mode === 'walk') {
	posX += (mouseX - posX) * lerp;
	posY += (mouseY - posY) * lerp;
  }

  // face left or right based on logical centre
  if (mouseX < posX) {
	zombie.style.transform = 'scaleX(-1)';
  } else {
	zombie.style.transform = 'scaleX(1)';
  }

  zombie.style.left = `${posX - width / 2}px`;
  zombie.style.top  = `${posY - height / 2}px`;

  requestAnimationFrame(animate);
}

animate();
