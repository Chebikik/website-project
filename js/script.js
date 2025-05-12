document.addEventListener("DOMContentLoaded", () => {
    fetch('js/sample.json') // Завантажуємо JSON-файл
        .then(response => response.json())
        .then(data => {
            const brands = new Set();
            const models = new Set();
            const years = new Set();

            // Розбираємо дані з JSON
            Object.keys(data).forEach(key => {
                const [brand, model, year] = key.split('/');
                brands.add(brand);
                models.add(model);
                years.add(year);
            });

            populateList('#brand-list', Array.from(brands), 'brand');
            populateList('#model-list', Array.from(models), 'model');
            populateList('#year-list', Array.from(years), 'year');

            // Відображення галереї
            displayGallery(data);

            // Додавання подій для фільтрів
            document.querySelectorAll('.filter ul').forEach(list => {
                list.addEventListener('click', event => {
                    if (event.target.tagName === 'LI') {
                        const filterType = event.target.dataset.type;
                        const filterValue = event.target.textContent;
                        filterGallery(data, filterType, filterValue);
                    }
                });
            });
        })
        .catch(error => console.error('Error loading gallery data:', error));
});

function populateList(selector, items, type) {
    const list = document.querySelector(selector);
    items.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = item;
        listItem.dataset.type = type;
        list.appendChild(listItem);
    });
}

function displayGallery(data) {
    const galleryContainer = document.querySelector('.gallery-items');
    galleryContainer.innerHTML = '';

    const validData = {}; // Об'єкт для збереження валідних зображень

    Object.entries(data).forEach(([key, value]) => {
        const img = new Image();
        img.src = value;

        img.onload = () => {
            if (img.naturalWidth > 1 && img.naturalHeight > 1) {
                validData[key] = value; // Додаємо тільки валідні зображення

                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';

                const imgElement = document.createElement('img');
                imgElement.src = value;
                imgElement.alt = key;

                galleryItem.appendChild(imgElement);
                galleryContainer.appendChild(galleryItem);
            }
        };

        img.onerror = () => {
            console.warn(`Image failed to load: ${value}`);
        };
    });

    // Повертаємо тільки валідні дані
    return validData;
}

function filterGallery(data, filterType, filterValue) {
    const filteredData = Object.entries(data).filter(([key]) => {
        const [brand, model, year] = key.split('/');
        if (filterType === 'brand') return brand === filterValue;
        if (filterType === 'model') return model === filterValue;
        if (filterType === 'year') return year === filterValue;
        return true;
    });

    displayGallery(Object.fromEntries(filteredData));
}

