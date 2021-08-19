const backdrop = document.querySelector('.backdrop');
const sideDrawer = document.querySelector('.mobile-nav');
const menuToggle = document.querySelector('#side-menu-toggle');
const scrollBtn = document.querySelector('#scroll-btn');

const likeBtns = document.querySelectorAll('.fa-thumbs-up');

function backdropClickHandler() {
  backdrop.style.display = 'none';
  sideDrawer.classList.remove('open');
}

function menuToggleClickHandler() {
  backdrop.style.display = 'block';
  sideDrawer.classList.add('open');
}

backdrop.addEventListener('click', backdropClickHandler);
menuToggle.addEventListener('click', menuToggleClickHandler);

try {
  scrollBtn.addEventListener('click', () => {
    window.scrollTo(0, 0);
  });
}
catch(err){};

const toggleLike = (event) => {
  const btnId = event.target.id; 
  const btn = document.getElementById(btnId);
  const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

  fetch(`/posts/${btnId}`, { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'csrf-token': csrf
    },
    //body: {}
  })
  .then(() => {
    console.log('POST async request done')
  })
  .catch(err => console.log(err));
}

likeBtns.forEach(btn => {
  btn.addEventListener('click', toggleLike)
});


