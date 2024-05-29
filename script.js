document.addEventListener('DOMContentLoaded', () => {
    const relevantCompaniesList = document.getElementById('relevant-companies-list');
    const nonRelevantCompaniesList = document.getElementById('non-relevant-companies-list');
    const toggleNonRelevantBtn = document.getElementById('toggle-non-relevant-btn');
    const modal = document.getElementById('modal');
    const closeModalBtn = document.querySelector('.close-btn');
    const addCompanyBtn = document.getElementById('add-company-btn');
    const companyForm = document.getElementById('company-form');
    const saveChangesBtn = document.getElementById('save-changes-btn');
    const loadJsonBtn = document.getElementById('load-json-btn');
    const nextStepForm = document.getElementById('next-step-form');
    const nextStepModal = document.getElementById('next-step-modal');
    const closeNextStepModalBtn = document.querySelector('.close-next-step-btn');
    const acceptedBtn = document.getElementById('accepted-btn');
    const confettiContainer = document.getElementById('confetti-container');
    const relevantCount = document.getElementById('relevant-count');
    let currentCompanyIndex = null;
    let companies = [];

    if (!relevantCompaniesList || !nonRelevantCompaniesList) {
        console.error('Required DOM elements are missing');
        return;
    }   

    function createConfetti() {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confettiContainer.appendChild(confetti);
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }

    function showConfetti() {
        for (let i = 0; i < 100; i++) {
            createConfetti();
        }
    }

    acceptedBtn.addEventListener('click', showConfetti);

    fetch('companies.json')
        .then(response => response.json())
        .then(data => {
            companies = data;
            console.log('Companies data loaded:', companies);
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
        
        if (currentCompanyIndex !== null) {
            companies[currentCompanyIndex] = company; // Update existing company
        } else {
            companies.push(company); // Add new company
        }
    
        updateCompaniesList();
        modal.style.display = 'none';
        companyForm.reset();
        currentCompanyIndex = null; // Reset after saving
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
                        console.log('Loaded companies from JSON file:', companies);
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

    toggleNonRelevantBtn.addEventListener('click', () => {
        if (nonRelevantCompaniesList.style.display === 'none') {
            nonRelevantCompaniesList.style.display = 'block';
        } else {
            nonRelevantCompaniesList.style.display = 'none';
        }
    });

    function updateCompaniesList() {
        console.log('Updating companies list...');
        if (!relevantCompaniesList || !nonRelevantCompaniesList) return;
    
        relevantCompaniesList.innerHTML = '';
        nonRelevantCompaniesList.innerHTML = '';
        companies.forEach((company, index) => {
            const companyDiv = document.createElement('div');
            companyDiv.classList.add('company');
            if (company.disabled) {
                companyDiv.classList.add('blocked'); // Apply cross-over text style
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
            
    
            if (company.disabled) {
                nonRelevantCompaniesList.appendChild(companyDiv);
            } else {
                relevantCompaniesList.appendChild(companyDiv);
            }

            const relevantCompanies = companies.filter(company => !company.disabled);
            relevantCount.textContent = relevantCompanies.length;
        });
    
        console.log('Companies displayed:', { relevant: relevantCompaniesList.children.length, nonRelevant: nonRelevantCompaniesList.children.length });
    
        document.querySelectorAll('.pass-btn').forEach(button => {
            button.addEventListener('click', event => {
                const index = event.target.dataset.index;
                companies[index].disabled = false;
                updateCompaniesList();
            });
        });
    
        document.querySelectorAll('.fail-btn').forEach(button => {
            button.addEventListener('click', event => {
                const index = event.target.dataset.index;
                companies[index].disabled = true;
                updateCompaniesList();
            });
        });
    
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', event => {
                const index = event.target.dataset.index;
                currentCompanyIndex = index;
                const company = companies[index];
                document.getElementById('company-name').value = company.name;
                document.getElementById('role').value = company.role;
                document.getElementById('interview-date').value = company.interviewDate;
                document.getElementById('interviewer').value = company.interviewer;
                document.getElementById('notes').value = company.notes;
                modal.style.display = 'block';
            });
        });
    
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', event => {
                const index = event.target.dataset.index;
                companies.splice(index, 1);
                updateCompaniesList();
            });
        });
    }
    
    function saveCompanies() {
        const blob = new Blob([JSON.stringify(companies, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'companies.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
});
