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
            if(jobsPartsToCheck.some(part => currentFilters.includes(part))) {
                jobsList.innerHTML += template(job);
            }
        } else {
            jobsList.innerHTML += template(job);
        }
        }
    )
    let selectFilters: NodeListOf<Element> = document.querySelectorAll('.toFilter');
    console.log(selectFilters)
    selectFilters.forEach( (filter) => {
        filter.addEventListener('click', addFilter)
    })
}


async function addFilter(e) {
    let FilterTemplate = await getHandlebarTemplate('js/templates/filterOn.hbs');
    let template: Function = Handlebars.compile(FilterTemplate);
    let filtersBox: HTMLElement = document.querySelector('.filters');
    console.log(filtersBox.style.display);
    if (!filtersBox.style.display) {
        filtersBox.style.display = 'flex';
    }
    filtersList.innerHTML += template({filter: e.target.textContent});
    currentFilters.push(e.target.textContent.toString());
    populatePage(currentFilters);
}



populatePage(currentFilters);



