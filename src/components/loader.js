

export function removeLoader() {
  const loader = document.querySelector('.loader');
  const mainContent = document.getElementById('main-content');
  loader.classList.add('hidden');
  mainContent.classList.remove('hidden');
}

export function addLoader() {
  const loader = document.querySelector('.loader');
  const mainContent = document.getElementById('main-content');
  loader.classList.remove('hidden');
  mainContent.classList.add('hidden');
}

