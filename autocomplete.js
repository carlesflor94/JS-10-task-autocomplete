const input = document.querySelector('.search__text');
const autocomplete = document.querySelector('.search__results');
const repository = document.querySelector('.repositories__list');
const subtitle = document.querySelector('.search__subtitle');


const debounce = (fn, debounceTime = 0) => {
  let delayTime = 0;

  return function (...args) {
    const newCall = this;

    if (delayTime !== 0) {
      clearTimeout(delayTime);
    }

    delayTime = setTimeout(() => {
       return fn.apply(newCall, args);
    }, debounceTime)
  } 
};


function addAutocomplete(items) {

    autocomplete.innerHTML = '';

    if (items.length === 0) {
        autocomplete.style.display = 'none';
        subtitle.style.display = 'none';
        return;
    }

    else {
        items.forEach(repo => {
            const item = document.createElement('div');
            item.textContent = repo.full_name;
            item.classList.add('autocomplete-item');

            item.addEventListener('click', () => {
                addRepositories(repo);
                input.value = '';
                autocomplete.innerHTML = '';
                autocomplete.style.display = 'none';
                subtitle.style.display = 'none';
            });

            autocomplete.appendChild(item);
        });

        autocomplete.style.display = 'block';
        subtitle.style.display = 'block';
    }
}

function searchRepositories(query) {

    if (!query.trim()) {
        autocomplete.innerHTML = '';
        autocomplete.style.display = 'none';
        return;
    }

    else {
        fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`)
            .then(response => {
                return response.json();
            })
            .then(data => {
                    addAutocomplete(data.items);
            })
            .catch(error => {
                console.error('Repositories not fetched');
            })
        }
    
}

function addRepositories(repo) {
    const item = document.createElement('div');
    item.classList.add('repositories__item');
    const githubData = document.createElement('span');
    githubData.textContent = `${repo.name} | ${repo.owner.login} | ⭐ ${repo.stargazers_count}`;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';

    deleteButton.addEventListener('click', () => {
        item.remove();
    })

    item.appendChild(githubData);
    item.appendChild(deleteButton);
    repository.appendChild(item);
}


input.addEventListener('input', debounce((event) => {
    const query = event.target.value;
    searchRepositories(query);
}, 500));