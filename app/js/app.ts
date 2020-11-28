
let jobsList: HTMLElement = document.querySelector('.jobsList');
let filtersList: HTMLElement = document.querySelector('.filters');

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

let currentFilters = [];

async function populatePage(currentFilters) {
    jobsList.innerHTML = '';
    let dataToInsert = await getJobs();
    let HBTemplate = await getHandlebarTemplate('js/templates/job.hbs');
    let template: Function = Handlebars.compile(HBTemplate);
    dataToInsert.forEach( (job)=> {
        let jobsPartsToCheck: [string] = JSON.parse(JSON.stringify(job.languages));
        jobsPartsToCheck.push(job.level);
        jobsPartsToCheck.push(job.role);
        if (currentFilters.length > 0) {
            if(currentFilters.every(part => jobsPartsToCheck.includes(part))) {
                jobsList.innerHTML += template(job);
            }
        } else {
            jobsList.innerHTML += template(job);
        }
        }
    )
    let selectFilters: NodeListOf<Element> = document.querySelectorAll('.toFilter');
    selectFilters.forEach( (filter) => {
        filter.addEventListener('click', addFilter)
    })

    let deleteFilters: NodeListOf<Element> = document.querySelectorAll('.filterExit');
    deleteFilters.forEach( (filter) => {
        filter.addEventListener('click', removeFilters)
    })
}

async function addFilter(e) {
    let FilterTemplate = await getHandlebarTemplate('js/templates/filterOn.hbs');
    let template: Function = Handlebars.compile(FilterTemplate);
    let filtersBox: HTMLElement = document.querySelector('.filters');
    currentFilters.push(e.target.textContent.toString());
    filtersList.innerHTML += template({filter: e.target.textContent});
    if (currentFilters.length > 0) {
        if (!filtersBox.style.display || filtersBox.style.display=='none' ) {
            filtersBox.style.display = 'flex';
        }
    } else {
        if (filtersBox.style.display) {
            filtersBox.style.display = 'none';
        }
    }
    populatePage(currentFilters);
}

async function removeFilters(e) {
    let filterToDelete: string;
    let filtersBox: HTMLElement = document.querySelector('.filters');
    if (e.target.id.toString().includes('parent')){
        filterToDelete = e.target.id.split('-')[1];
    } else {
        filterToDelete = e.target.parentElement.id.split('-')[1];
    }
    let filterIndex: number = currentFilters.indexOf(filterToDelete);
    currentFilters.splice( filterIndex - 1 , 1);
    let toSelect = '#filter-' + filterToDelete;
    let filterInHTML: HTMLElement = document.querySelector(toSelect);
    filterInHTML.remove();
    if (currentFilters.length == 0) {
        if (filtersBox.style.display) {
            filtersBox.style.display = 'none';
        }
    }
    populatePage(currentFilters);
}

populatePage(currentFilters);



