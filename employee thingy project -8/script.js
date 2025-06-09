// global variables
let employees = [];
const urlAPI = `https://randomuser.me/api/?results=12&inc=name,picture,email,location,phone,dob&noinfo&nat=US`;
const gridContainer = document.querySelector(".grid-container");
const overlay = document.querySelector(".overlay");
const modalContainer = document.querySelector(".modal-content");
const modalClose = document.querySelector(".modal-close");
const loadingMessage = document.getElementById('loading-message');

// Create the no-results div once and append it to gridContainer
const noResultsDiv = document.createElement('div');
noResultsDiv.id = 'no-results';
noResultsDiv.className = 'no-results';
noResultsDiv.textContent = 'No results found. Try again.';
noResultsDiv.style.display = 'none'; // hide initially
gridContainer.appendChild(noResultsDiv);

// Show loading immediately
loadingMessage.style.display = 'block';

// Fetch employee data
fetch(urlAPI)
  .then(res => res.json())
  .then(res => res.results)
  .then(employeeData => {
    displayEmployees(employeeData);
    // Hide loading message after employees are displayed
    loadingMessage.style.display = 'none';
  })
  .catch(err => {
    console.log(err);
    loadingMessage.textContent = 'Failed to load data.';
  });

function displayEmployees(employeeData) {
  employees = employeeData;
  let employeeHTML = '';

  employees.forEach((employee, index) => {
    let { name, email, location, picture } = employee;
    employeeHTML += `
      <div class="card" data-index="${index}">
        <div class="img-container">
          <img class="avatar" src="${picture.large}" alt="example-img"/>
        </div>
        <div class="text-container">
          <h2 class="name">${name.first} ${name.last}</h2>
          <p class="email">${email}</p>
          <p class="address">${location.city}</p>
        </div>
      </div>
    `;
  });

  // Insert employee cards before the noResultsDiv, preserving it
  noResultsDiv.insertAdjacentHTML('beforebegin', employeeHTML);

  // Hide the no-results message (in case it was visible before)
  noResultsDiv.style.display = 'none';

  // Wait for all images to load before sizing
  const images = gridContainer.querySelectorAll('img');
  const imagePromises = Array.from(images).map(img =>
    new Promise(resolve => {
      if (img.complete) resolve();
      else img.onload = img.onerror = resolve;
    })
  );

  Promise.all(imagePromises).then(() => {
    equalizeCardWidths(); // call sizing after content is present
  });
}

function filterEmployees(searchTerm) {
  const cards = document.querySelectorAll('.card');
  let visibleCount = 0;

  cards.forEach(card => {
    const name = card.querySelector('.name').textContent.toLowerCase();
    if (name.includes(searchTerm.toLowerCase())) {
      card.style.display = 'flex'; // or whatever display your .card uses
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  // Show "no results" message if no cards visible, else hide it
  if (visibleCount === 0) {
    noResultsDiv.style.display = 'block';
  } else {
    noResultsDiv.style.display = 'none';
  }
}

function displayModal(index) {
  let { name, dob, phone, email, location, picture } = employees[index];
  let date = new Date(dob.date);

  const modalHTML = `
    <img class="avatar" src="${picture.large}" />
    <div class="text-container">
      <h2 class="name">${name.first} ${name.last}</h2>
      <p class="email">${email}</p>
      <p class="address">${location.city}</p>
      <hr />
      <p>${phone}</p>
      <p class="address">${location.street.number} ${location.street.name}, ${location.state} ${location.postcode}</p>
      <p>Birthday: ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}</p>
    </div>
  `;

  overlay.classList.remove("hidden");
  modalContainer.innerHTML = modalHTML;
}

// Modal open/close event listeners
gridContainer.addEventListener('click', e => {
  if (e.target !== gridContainer) {
    const card = e.target.closest(".card");
    const index = card.getAttribute('data-index');
    displayModal(index);
  }
});

modalClose.addEventListener('click', () => {
  overlay.classList.add("hidden");
});

const searchInput = document.getElementById('search-input');

searchInput.addEventListener('input', e => {
  filterEmployees(e.target.value);
});
