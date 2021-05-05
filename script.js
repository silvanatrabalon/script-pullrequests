//functions 
function httpGet(theUrl) {
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); 
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
function cancel() {
    background.style["display"] = 'block';
    footer.style["display"] = 'block';
    container.style['opacity'] = '0';
    const removed = document.querySelectorAll('.mycontent');
    removed.forEach(function(e) {
        e.remove()
    })
}
function createContent() {
    const content = document.createElement('tr');
    content.classList.add('mycontent');
    return content;
}
function addColum(value, header = false, state = false) {
    const newColum = document.createElement('td');
    newColum.style['width'] = '155px';
    if (header) {
        newColum.classList.add('h3');
    }
    newColum.classList.add('float-left', 'p-4', 'mycontent');

    if (state) {
        if (value) {
            value.forEach(function(v) {
                tag = document.createElement('p');
                tag.innerHTML = v;
                newColum.appendChild(tag);
            })
        } else {
            newColum.innerHTML = ' ';
        }
    } else {
        newColum.innerHTML = value;
    }
    return newColum;
}
function createButtons(name) {
    const btn = document.createElement('td');
    btn.classList.add('btn', 'btn-sm','primary','flash-action', name);
    btn.style['margin'] = '5px';
    btn.innerHTML = name;
    header.appendChild(btn);
}
function renderHeaderTitle() {
    content = createContent();
    title = addColum('Title', true, false);
    num = addColum('PR', true, false);
    comment = addColum('Comments', true, false);
    gannett = addColum('Gannett', true, false);
    from = addColum('Reviewers', true, false);
    opened = addColum('Opened', true, false);
    merged = addColum('Merged', true, false);
    statuss = addColum('Status', true, false);
    content.appendChild(title);
    content.appendChild(num);
    content.appendChild(comment);
    content.appendChild(gannett);
    content.appendChild(from);
    content.appendChild(opened);
    content.appendChild(merged);
    content.appendChild(statuss);
    container.appendChild(content);
}
function renderColumn(content, field, state = false) {
    const element = addColum(field,false, state);
    content.appendChild(element);
    container.appendChild(content);
}
function download(tableID, filename = '') {
    const dataType = 'application/vnd.ms-excel',
          tableSelect = document.getElementById(tableID),
          tableHTML = tableSelect.outerHTML.replace(/ /g, '%20'),
          downloadLink = document.createElement("a");
    filename = filename ? filename+'.xls' : 'metrics.xls';
    document.body.appendChild(downloadLink);
    if (navigator.msSaveOrOpenBlob) {
        var blob = new Blob(['ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob( blob, filename);
    } else {
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
        downloadLink.download = filename;
        downloadLink.click();
    }
}

//variables
const background = document.querySelector('.logged-in'),
      footer = document.querySelector('.footer '),
      modal = document.querySelectorAll('[id = "js-flash-container"]'),
      mycontainer = document.createElement('table'),
      container = modal[0].appendChild(mycontainer);
container.style['width'] = '100%';
container.style['backgroundColor'] = 'black';
container.style['opacity'] = '0';

const header = document.createElement("tr");
header.classList.add('flash', 'h1', 'mycontent');
header.innerHTML = 'Globant Team PRs';

//renderHeaderTitle
createButtons('download');
createButtons('cancel');
container.appendChild(header);
renderHeaderTitle();

array = [
    {
        "name": "Anto",
        "user": "trabalonsilvana"
    },
    {
       "name": "Carlos",
        "user": "carlos-lopez-gannett"
    },
    {
        "name": "Claus",
        "user": "claushessegannett"
    },
    {
        "name": "Jose",
        "user": "josedimarco"
    },
    {
        "name": "Jp",
        "user": "juandelcastillo"
    },
    {
        "name": "Leo",
        "user": "orsileonel-gannett"
    },
    {
        "name": "Nacho",
        "user": "jose-decima"
    },
    {
        "name": "Sil",
        "user": "sgarciagannett"
    },
    {
        "name": "Kevin",
        "user": "KevinTriana-Gannett"
    },
    {
        "name": "Francisco",
        "user": "frxncismor "
    }
];
function checkArray(rev, array) {
    let isGlb = false;
    array.forEach(function(author) {
        if (author.user === rev || 'Rodrigo-gannett' === rev) {
            isGlb = true;
        }
    })
    return isGlb;
}

function render (user,name, merged) {
    if (merged) {
        var mysite = httpGet(`https://github.com/GannettDigital/tangent/pulls?q=author%3A${user}+is%3Amerged++`),   
        doc = document.createElement('html');
    } else {
        var mysite = httpGet("https://github.com/GannettDigital/tangent/pulls/" + user),   
        doc = document.createElement('html');
    }

    doc.innerHTML = mysite;
    const prs = doc.querySelectorAll('[id ^= "issue_"]'),
          activePr = [];
    flag = false;
    if (prs) {
        prs.forEach(async function(pr) {
            let title, 
                elementLabels, 
                tags = [], 
                labels, 
                label = [], 
                datetime, 
                opened;
            if (pr.classList.contains('Box-row')) {
                flag = true;
                title = pr.querySelector('a[data-hovercard-type="pull_request"]').text;
                    elementLabels = pr.querySelectorAll('.labels');
                    elementLabels.forEach(function(lbs){
                        labels = lbs.querySelectorAll('.IssueLabel');
                        labels.forEach(function(lb){
                            label.push(lb.text); 
                        });
                        tags.push(label);
                    })
                datetime = pr.querySelectorAll("relative-time[datetime]");
                opened = datetime[0].title;
                d = new Date (opened);
                if (isNaN(d)) {
                    d = opened.split(' GMT-3')[0]
                } else {
                    d = d.toLocaleString().split(' ')[0]
                }
                comments = pr.querySelectorAll("span.text-small.text-bold");
                if (comments[comments.length -1]) {
                    nroComments = comments[comments.length -1].innerText;
                    nroComments = nroComments.trim();
                    if (isNaN(parseInt(nroComments))) {
                        nroComments = '0';
                    }
                } else {
                    nroComments = '0'
                }

                num = pr.id.split('issue_')[1];
                const mypr = httpGet("https://github.com/GannettDigital/tangent/pull/" + num);
                docum = document.createElement( 'html' );
                docum.innerHTML = mypr;

                let timeline = docum.querySelectorAll('.TimelineItem-body.d-flex'),
                    reviewers = [],
                    reviews = [];

                if (timeline.length > 0) {
                    timeline.forEach(function(review) {
                        if (review.outerText.includes('reviewed')) {
                            rev = review.getElementsByTagName("strong")[0].innerText.trim();
                            check = checkArray(rev,array);
                            if (!check && rev != 'New changes since you last viewed'){
                                reviews.push(rev);
                            }
                        }
                    })
                }

                let numRev = reviews.length;
                if (numRev > 0) {
                    reviewers = reviews.filter((el, index) => reviews.indexOf(el) === index);
                } else {
                    reviewers = '';
                }
                activePr.push({'title': title.split(' ')[0], 'labels': merged ? ['merged'] : tags[0], 'opened' : merged ? '' : d.replace(',',''),'merged' : merged ? d.replace(',','') : '', 'comments': nroComments.trim(), 'pr': num, 'gannett': numRev, 'from': reviewers });
            }
        })
    }
    if (!merged) {
        content = createContent();
        author = addColum(name, true , false);
        content.appendChild(author);
        container.appendChild(content);
    }

    //Render grid
    activePr.forEach(function(e) {
        content = createContent();
        renderColumn(content, e.title);
        renderColumn(content, e.pr);
        renderColumn(content, e.comments);
        renderColumn(content, e.gannett);
        renderColumn(content, e.from);
        renderColumn(content, e.opened);
        renderColumn(content, e.merged);
        renderColumn(content, e.labels , true);
    })
}

array.forEach(function(author) {
    render(author.user, author.name), merged = false;
    render(author.user, author.name, merged = true);

})

cancelButton = document.querySelector('.cancel');
cancelButton.onclick = function() {cancel()};
downloadButton = document.querySelector('.download');
downloadButton.onclick = function() {
    download('js-flash-container')
};

if (flag) {
    footer.style["display"] = 'none';
    container.style['opacity'] = '1';
}

