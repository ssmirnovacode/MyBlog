const backdrop = document.querySelector('.backdrop');
const sideDrawer = document.querySelector('.mobile-nav');
const menuToggle = document.querySelector('#side-menu-toggle');
const scrollBtn = document.querySelector('#scroll-btn');

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
catch(err){}

function convertDate(str) {
  const arr = str.slice(0,-5).split('T');
  arr[0] = arr[0].split('-').reverse().join('-');
  return arr.join(' at ');
}
//console.log(convertDate('2021-08-19T14:12:23.308Z'))
const str = '2021-08-19T14:12:23.308Z';
const res = str.slice(0,-5).split('T').map(item => {
  if (item.indexOf('-') > 0) {
    item = item.split('-').reverse().join('-');
  }
  else {
    const hours = +item.slice(0,2) + 2; //real time
    item = hours.toString() + item.slice(2)
  }
  return item;
}).join(' at ');
console.log(res);