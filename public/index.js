//Input filter
const inputAttributes = {
  type: 'text',
  placeholder: 'Filter jobs by title',
};
const setAttributes = (element, attributes) => {
  Object.keys(attributes).forEach((attr) => {
    element.setAttribute(attr, attributes[attr]);
  });
};

const divSearchbar = document.querySelector('.container-searchbar');

const searchbar = document.createElement('input');
setAttributes(searchbar, inputAttributes);
divSearchbar.appendChild(searchbar);

const span = document.createElement('span');
span.setAttribute('class', 'filter-icon');
span.innerHTML = `<i class='bi bi-funnel'></i>`;
divSearchbar.appendChild(span);

//filter function that returns a new array that will be mapped to render the filtered cards
const handleOnchange = (str) => {
  const filteredData = jobData.filter((job) =>
    job.title.toLowerCase().includes(str.toLowerCase())
  );
  container.innerHTML = '';
  return renderCards(filteredData);
};

searchbar.addEventListener('change', (e) => handleOnchange(e.target.value));
//Job cards
const container = document.querySelector('.container');
const fragmentCards = document.createDocumentFragment();

const renderCards = (data) => {
  data.map((job) => {
    if (job.location.includes('Smart Working')) {
      job.location = 'Smart Working';
    }
    const card = document.createElement('div');
    card.innerHTML = `
    <div class='card-job'>
    <span class='job-date'>${job.date}</span>
    <span class='job-title'>${job.title}</span>
    <span>${job.company}</span>
    <span class=${
      job.location === 'Smart Working' ? 'smart-working' : 'milano'
    } >${job.location}</span>
    <a href=${job.link}>Go to job offer</a>
    </div>
    `;
    return fragmentCards.appendChild(card);
  });
  container.appendChild(fragmentCards);
};

renderCards(jobData);

//footer
const footer = document.querySelector('footer');
footer.innerText =
  'Last update: ' + jobData[0].insertion_date.replace('/', '-');
