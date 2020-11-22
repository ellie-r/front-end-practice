
let jobsList: HTMLElement = document.querySelector('.jobsList');

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

async function populateHandlebars() {
    let dataToInsert = await getJobs();
    console.log(dataToInsert);
    let HBTemplate = await getHandlebarTemplate('js/templates/job.hbs');

    let template: Function = Handlebars.compile(HBTemplate);
    dataToInsert.forEach( (job)=> {
        console.log(job);
        jobsList.innerHTML += template(job);
    })


}

populateHandlebars();