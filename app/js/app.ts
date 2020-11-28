let jobsList: HTMLElement = document.querySelector('.jobsList');
let filtersList: HTMLElement = document.querySelector('.filters');
let currentFilters = [];

async function getJobs(): Promise<any> {
    let data = await fetch('data.json');
    return data.json();
}

async function getHandlebarTemplate(path: string) {
    let response = await fetch(
        path,
        {method: 'get'}
    )
    return response.text()
}



async function populatePage(currentFilters) {
    jobsList.innerHTML = '';
    let dataToInsert = await getJobs();
    let HBTemplate = await getHandlebarTemplate('js/templates/job.hbs');
    let template: Function = Handlebars.compile(HBTemplate);
    dataToInsert.forEach( (job)=> {
        let jobsPartsToCheck = job.languages.concat(job.tools);
        jobsPartsToCheck.push(job.level);
        jobsPartsToCheck.push(job.role);
        if (currentFilters.length > 0) {
            if(currentFilters.every(part => jobsPartsToCheck.includes(part))) {
                jobsList.innerHTML += template(job);
            }
        } else {
            jobsList.innerHTML += template(job);
        }
    })
    let selectFilters: NodeListOf<Element> = document.querySelectorAll('.toFilter');
    selectFilters.forEach( (filter) => {
        filter.addEventListener('click', addFilter)
    })

    let deleteFilters: NodeListOf<Element> = document.querySelectorAll('.filterExit');
    deleteFilters.forEach( (filter) => {
        filter.addEventListener('click', removeFilter)
    })

    let clearButton: HTMLElement = document.querySelector('.clear');
    clearButton.addEventListener('click', removeAllFilters   )
}

async function addFilter(e) {
    let FilterTemplate = await getHandlebarTemplate('js/templates/filterOn.hbs');
    let template: Function = Handlebars.compile(FilterTemplate);
    let filtersBox: HTMLElement = document.querySelector('.filterSection');
    if(!currentFilters.includes(e.target.textContent.toString())){
        currentFilters.push(e.target.textContent.toString());
        filtersList.innerHTML += template({filter: e.target.textContent});
        if (currentFilters.length > 0) {
            if (!filtersBox.style.visibility || filtersBox.style.visibility == 'hidden') {
                filtersBox.style.visibility = 'visible';
            }
        } else {
            filtersBox.style.visibility = 'hidden';
        }
        populatePage(currentFilters);
    }
}

async function removeFilter(e) {
    let filterToDelete: string;
    let filtersBox: HTMLElement = document.querySelector('.filterSection');
    if (e.target.id.toString().includes('parent')){
        filterToDelete = e.target.id.split('-')[1];
    } else {
        filterToDelete = e.target.parentElement.id.split('-')[1];
    }
    currentFilters = currentFilters.filter( (filter) => {
        return filter != filterToDelete.toString();
    })
    let toSelect = '#filter-' + filterToDelete;
    let filterInHTML: HTMLElement = document.querySelector(toSelect);
    filterInHTML.remove();
    if (currentFilters.length == 0) {
        filtersBox.style.visibility = 'hidden';
    }
    populatePage(currentFilters);
}

async function removeAllFilters() {
    currentFilters.forEach( (filter) => {
        let toSelect = '#filter-' + filter;
        let filterInHTML: HTMLElement = document.querySelector(toSelect);
        filterInHTML.remove();
    })
    currentFilters = [];
    let filtersBox: HTMLElement = document.querySelector('.filterSection');
    filtersBox.style.visibility = 'hidden';
    populatePage(currentFilters);
}

populatePage(currentFilters);



