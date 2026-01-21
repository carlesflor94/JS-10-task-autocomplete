const input = document.querySelector('.search__text');
const autocomplete = document.querySelector('.search__results');
const repository = document.querySelector('.repositories__list');

function addAutocomplete(items) {

    autocomplete.innerHTML = '';

    if (items.length === 0) {
        autocomplete.style.display = 'none';
        return;
    }

    else {
        items.slice(0, 5).forEach(repo => {
            const item = document.createElement('div');
            item.textContent = repo.full_name;
            item.classList.add('autocomplete-item');

            item.addEventListener('click', () => {
                addRepositories(repo);
                input.value = '';
                autocomplete.innerHTML = '';
                autocomplete.style.display = 'none';
            });

            autocomplete.appendChild(item);
        });

        autocomplete.style.display = 'block';
    }
}

function searchRepositories(query) {

    if (!query.trim()) {
        autocomplete.innerHTML = '';
        autocomplete.style.display = 'none';
        return;
    }

    else {
        fetch(`https://api.github.com/search/repositories?q=${query}`)
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.items) {
                    addAutocomplete(data.items);
                } 
                else {
                    addAutocomplete([]);
                    }
            })
            .catch(error => {
                console.error('Repositories not fetched');
            })
        }
    
}

function addRepositories(repo) {
    const item = document.createElement('div');
    item.classList.add('repositories__list');
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


input.addEventListener('input', (event) => {
    const query = event.target.value;
    searchRepositories(query);
});