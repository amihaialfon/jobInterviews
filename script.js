document.addEventListener('DOMContentLoaded', () => {
    const companiesList = document.getElementById('companies-list');
    const modal = document.getElementById('modal');
    const closeModalBtn = document.querySelector('.close-btn');
    const addCompanyBtn = document.getElementById('add-company-btn');
    const companyForm = document.getElementById('company-form');
    const saveChangesBtn = document.getElementById('save-changes-btn');
    const loadJsonBtn = document.getElementById('load-json-btn');
    const nextStepForm = document.getElementById('next-step-form');
    const nextStepModal = document.getElementById('next-step-modal');
    const closeNextStepModalBtn = document.querySelector('.close-next-step-btn');
    let currentCompanyIndex = null;

    // Fetch companies data from companies.json
    fetch('companies.json')
        .then(response => response.json())
        .then(data => {
            companies = data;
            updateCompaniesList();
        })
        .catch(error => console.error('Error loading companies data:', error));

    addCompanyBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    closeNextStepModalBtn.addEventListener('click', () => {
        nextStepModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        } else if (event.target == nextStepModal) {
            nextStepModal.style.display = 'none';
        }
    });

    companyForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const company = {
            name: document.getElementById('company-name').value,
            role: document.getElementById('role').value,
            interviewDate: document.getElementById('interview-date').value,
            interviewer: document.getElementById('interviewer').value,
            notes: document.getElementById('notes').value,
            passed: false,
            disabled: false,
            interviews: []
        };
        companies.push(company);
        updateCompaniesList();
        modal.style.display = 'none';
        companyForm.reset();
    });

    nextStepForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const interview = {
            title: document.getElementById('next-step-title').value,
            date: document.getElementById('next-step-date').value,
            location: document.getElementById('next-step-location').value
        };
        companies[currentCompanyIndex].interviews.push(interview);
        nextStepModal.style.display = 'none';
        updateCompaniesList();
    });

    saveChangesBtn.addEventListener('click', saveCompanies);

    // Add event listener for the load JSON button
    loadJsonBtn.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.onchange = event => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = e => {
                    try {
                        const json = JSON.parse(e.target.result);
                        companies = json;
                        updateCompaniesList();
                    } catch (error) {
                        console.error('Error parsing JSON:', error);
                    }
                };
                reader.readAsText(file);
            }
        };
        fileInput.click();
    });

    function updateCompaniesList() {
        companiesList.innerHTML = '';
        companies.forEach((company, index) => {
            const companyDiv = document.createElement('div');
            companyDiv.classList.add('company');
            if (company.disabled) {
                companyDiv.classList.add('disabled');
            }
            companyDiv.innerHTML = `
                <h3>${company.name}</h3>
                <p>תפקיד: ${company.role}</p>
                <p>תאריך ראיון: ${company.interviewDate}</p>
                <p>מי דיבר איתי: ${company.interviewer}</p>
                <p>הערות: ${company.notes}</p>
                ${company.interviews.map((interview, i) => `
                    <div class="interview">
                        <h4>שלב ${i + 1}: ${interview.title}</h4>
                        <p>תאריך: ${interview.date}</p>
                        <p>מיקום: ${interview.location}</p>
                    </div>
                `).join('')}
                <button class="pass-btn" data-index="${index}">עבר</button>
                <button class="fail-btn" data-index="${index}">לא עבר</button>
                <button class="edit-btn" data-index="${index}">ערוך</button>
                <button class="delete-btn" data-index="${index}">מחק</button>
            `;
            companiesList.appendChild(companyDiv);
        });
        document.querySelectorAll('.pass-btn').forEach(button => {
            button.addEventListener('click', handlePass);
        });
        document.querySelectorAll('.fail-btn').forEach(button => {
            button.addEventListener('click', handleFail);
        });
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', handleEdit);
        });
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', handleDelete);
        });
    }

    function handlePass(event) {
        const index = event.target.dataset.index;
        currentCompanyIndex = index;
        nextStepModal.style.display = 'block';
    }

    function handleFail(event) {
        const index = event.target.dataset.index;
        companies[index].disabled = true;
        updateCompaniesList();
    }

    function handleEdit(event) {
        const index = event.target.dataset.index;
        const company = companies[index];
        document.getElementById('company-name').value = company.name;
        document.getElementById('role').value = company.role;
        document.getElementById('interview-date').value = company.interviewDate;
        document.getElementById('interviewer').value = company.interviewer;
        document.getElementById('notes').value = company.notes;
        companies.splice(index, 1);
        modal.style.display = 'block';
    }

    function handleDelete(event) {
        const index = event.target.dataset.index;
        companies.splice(index, 1);
        updateCompaniesList();
    }

    function saveCompanies() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(companies));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "companies.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    // Initialize companies list on page load
    updateCompaniesList();
});
