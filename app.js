const filterArray = [];

class JobCard {
    constructor(cardData) {
        this.id = cardData.id;
        this.company = cardData.company;
        this.logo = cardData.logo;
        this.new = cardData.new;
        this.featured = cardData.featured;
        this.position = cardData.position;
        this.role = cardData.role;
        this.level = cardData.level;
        this.postedAt = cardData.postedAt;
        this.contract = cardData.contract;
        this.location = cardData.location;
        this.languages = cardData.languages;
        this.tools = cardData.tools;
    }

    createCard() {
        let wrapper = document.createElement('div');
        wrapper.classList.add('job-card');
        wrapper.append(...[this.createJobSection(), this.createTabletSection()]);
        return wrapper;
    }

    createJobSection() {
        let logoTag = document.createElement('img');
        logoTag.classList.add('logo');
        logoTag.src = this.logo;
        logoTag.alt = `${this.company} company logo`

        let metadata = this.createJobMetadata();

        let wrapper = document.createElement('div');
        wrapper.classList.add('job-section');
        wrapper.append(...[logoTag, metadata]);

        return wrapper;
    }

    createJobMetadata() {
        let arrOfElements = [];
        let companyName = document.createElement('span');
        companyName.innerHTML = this.company;
        companyName.classList.add('company-name');
        arrOfElements.push(companyName);
        let isNew = this.new ? document.createElement('span') : null;
        if (isNew) {
            isNew.classList.add('is-new');
            isNew.innerHTML = 'NEW!';
            arrOfElements.push(isNew);
        }

        let isFeatured = this.featured ? document.createElement('span') : null;
        if (isFeatured) {
            isFeatured.classList.add('is-featured');
            isFeatured.innerHTML = 'FEATURED';
            arrOfElements.push(isFeatured);
        }

        let jobName = document.createElement('h3');
        jobName.innerHTML = this.position;
        arrOfElements.push(jobName);

        let geoData = this.createGeoJobData();
        arrOfElements.push(geoData);

        let wrapper = document.createElement('div');
        wrapper.classList.add('job-metadata');

        wrapper.append(...arrOfElements);

        return wrapper;
    }

    createGeoJobData() {
        let timePosed = document.createElement('span');
        timePosed.classList.add('time-posted');
        timePosed.innerHTML = this.postedAt;

        let jobHours = document.createElement('span');
        jobHours.innerHTML = this.contract;
        jobHours.classList.add('job-time-period');

        let location = document.createElement('span');
        location.innerHTML = this.location;
        location.classList.add('job-country');

        let wrapper = document.createElement('div');
        wrapper.classList.add('geo-time-data');
        wrapper.append(...[timePosed, jobHours, location]);

        return wrapper;
    }

    createTabletSection() {
        let unorderedList = document.createElement('ul');
        unorderedList.classList.add('tablets-list');
        let roleChip = document.createElement('li');
        roleChip.innerHTML = this.role;
        roleChip.classList.add('tablet-chip');
        let levelChip = document.createElement('li');
        levelChip.innerHTML = this.level;
        levelChip.classList.add('tablet-chip');

        unorderedList.append(...[roleChip, levelChip]);

        this.languages.forEach((lang) => {
            let langElement = document.createElement('li');
            langElement.classList.add('tablet-chip');
            langElement.innerHTML = lang;
            unorderedList.append(langElement);
        });
        this.tools.forEach((tool) => {
            let toolElement = document.createElement('li');
            toolElement.classList.add('tablet-chip');
            toolElement.innerHTML = tool;
            unorderedList.append(toolElement);
        });

        let wrapper = document.createElement('div');
        wrapper.classList.add('tablets-section');
        wrapper.append(unorderedList);

        return wrapper;
    }

    appendCard() {
        let cardSection = document.getElementById('cards-section');
        cardSection.append(this.createCard());
    }
}

function addToFilterSection(event) {
    event.preventDefault();
    let value = event.target.innerHTML;
    if (!filterArray.includes(value)) {
        filterArray.push(value);
        console.log('Updated filter array:', filterArray);

        let filterChip = document.createElement('div');
        filterChip.classList.add('filtr-chip-container');
        filterChip.innerHTML = `<span class="btn-icon-left">${value}</span><span class="btn-icon-right">X</span>`;

        let filterSection = document.getElementById('filter-chips');
        filterSection.append(filterChip);

        filterChip.querySelector('.btn-icon-right').addEventListener('click', removeFilterChip);

        filterJobCards();
        toggleFilterSectionVisibility();
    }
}

function removeFilterChip(event) {
    let value = event.target.previousElementSibling.innerHTML;
    filterArray.splice(filterArray.indexOf(value), 1);
    event.target.parentElement.remove();

    filterJobCards();
    toggleFilterSectionVisibility();
}

function clearFilters() {
    filterArray.length = 0;
    let filterSection = document.getElementById('filter-chips');
    filterSection.innerHTML = '';

    filterJobCards();
    toggleFilterSectionVisibility();
}

function toggleFilterSectionVisibility() {
    const filterSection = document.querySelector('.filter-section');
    if (filterArray.length === 0) {
        filterSection.style.visibility = 'hidden';
    } else {
        filterSection.style.visibility = 'visible';
    }
}

function filterJobCards() {
    let jobCards = document.querySelectorAll('.job-card');

    jobCards.forEach(card => {
        let chipElements = card.querySelectorAll('.tablet-chip');
        let chipValues = Array.from(chipElements).map(chip => chip.innerHTML);

        let matchesAllFilters = filterArray.every(filter => chipValues.includes(filter));

        if (filterArray.length === 0 || matchesAllFilters) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function addFilterHandler() {
    let tabletChips = document.querySelectorAll('.tablet-chip');
    tabletChips.forEach(chip => {
        chip.addEventListener('click', addToFilterSection);
    });
}


function bootstrap() {
    fetch('data.json')
        .then((response) => response.json())
        .then((data) => {
            data.forEach((job) => {
                let JobInstance = new JobCard(job);
                JobInstance.appendCard();
            });
            addFilterHandler();

            document.querySelector('.close-btn').addEventListener('click', clearFilters);
        })
        .catch((error) => console.error('Error loading JSON:', error));
}

bootstrap();