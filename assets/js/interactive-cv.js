// Data storage
let experienceData = [];
let educationData = [];
let skillsData = [];

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    loadData();
});

// Tab functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            document.getElementById(tabName + '-tab').classList.add('active');
        });
    });
}

// Load and render data
async function loadData() {
    try {
        // Load data from JSON files
        experienceData = await fetchJSON('assets/docs/data/experience.json');
        educationData = await fetchJSON('assets/docs/data/education.json');
        skillsData = await fetchJSON('assets/docs/data/skills.json');
        
        // Render the data
        renderExperience();
        renderEducation();
        renderSkills();
    } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to hardcoded data if JSON files are not available
        loadFallbackData();
    }
}

// Fetch JSON data
async function fetchJSON(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

// Fallback data if JSON files are not available
function loadFallbackData() {
    // This will be used if the JSON files are not yet created
    experienceData = [
        {
            title: "R&D Data Scientist Intern",
            company: "MAYA GLOBAL",
            period: "May 2024 - Oct 2024",
            location: "Nivelles (Belgium) & London (UK)",
            details: [
                "Collected and identified Business Processes IT automation needs",
                "Developed from conception to deployment AI-driven BI tool to improve business processes (Python, PHP Laravel, Vue.JS)",
                "Collaborated with cross-functional international team: Customer Success (Belgium & Spain), IT (Sri Lanka & UK)"
            ]
        }
    ];
    
    renderExperience();
    renderEducation();
    renderSkills();
}

function renderExperience(experiences) {
    const container = document.getElementById("experience-list");
    container.innerHTML = "";

    experiences.forEach(exp => {
        const item = document.createElement("div");
        item.classList.add("content-item");

        // --- HEADER (collapsed view) ---
        const header = document.createElement("div");
        header.classList.add("item-header");

        const info = document.createElement("div");
        info.classList.add("item-info");

        const title = document.createElement("h3");
        title.textContent = exp.title;

        const company = document.createElement("div");
        company.classList.add("company");

        // clickable company
        if (exp.company_url) {
            company.innerHTML = `<a href="${exp.company_url}" target="_blank">${exp.company}</a>`;
        } else {
            company.textContent = exp.company;
        }

        const period = document.createElement("div");
        period.classList.add("period");
        period.textContent = `${exp.period} | ${exp.location}`;

        // referee italic (non-expanded view)
        const referee = document.createElement("div");
        referee.classList.add("referee");
        referee.textContent = exp.referee || "";

        info.appendChild(title);
        info.appendChild(company);
        info.appendChild(period);
        info.appendChild(referee);

        const expandIcon = document.createElement("div");
        expandIcon.classList.add("expand-icon");
        expandIcon.innerHTML = "&#9660;";

        header.appendChild(info);
        header.appendChild(expandIcon);

        // --- DETAILS (expanded view) ---
        const detailsWrapper = document.createElement("div");
        detailsWrapper.classList.add("item-details");

        const detailsContent = document.createElement("div");
        detailsContent.classList.add("item-details-content");

        // details
        if (exp.details && exp.details.length > 0) {
            const ul = document.createElement("ul");

            exp.details.forEach(detail => {
                if (Array.isArray(detail)) {
                    // first item is level 1
                    const li = document.createElement("li");
                    li.textContent = detail[0];

                    // create sublist
                    const subUl = document.createElement("ul");
                    subUl.classList.add("sub-list");

                    detail.slice(1).forEach(subItem => {
                        const subLi = document.createElement("li");
                        subLi.textContent = subItem;
                        subUl.appendChild(subLi);
                    });

                    li.appendChild(subUl);
                    ul.appendChild(li);
                } else {
                    const li = document.createElement("li");
                    li.textContent = detail;
                    ul.appendChild(li);
                }
            });

            detailsContent.appendChild(ul);
        }

        // results
        if (exp.results && exp.results.length > 0) {
            const resultsDiv = document.createElement("div");
            resultsDiv.classList.add("results");
            resultsDiv.innerHTML = "<strong>Key Results:</strong><ul>" +
                exp.results.map(r => `<li>${r}</li>`).join("") +
                "</ul>";
            detailsContent.appendChild(resultsDiv);
        }

        // context
        if (exp.context && exp.context.length > 0) {
            const contextDiv = document.createElement("div");
            contextDiv.classList.add("context");
            contextDiv.innerHTML = exp.context.map(c => `<p>${c}</p>`).join("");
            detailsContent.appendChild(contextDiv);
        }

        detailsWrapper.appendChild(detailsContent);

        // --- assemble ---
        item.appendChild(header);
        item.appendChild(detailsWrapper);

        // toggle expand
        header.addEventListener("click", () => {
            item.classList.toggle("expanded");
        });

        container.appendChild(item);
    });
}


// Render education section
function renderEducation() {
    const container = document.getElementById('education-list');
    container.innerHTML = '';
    
    educationData.forEach(item => {
        const educationItem = createExpandableItem(item, 'education');
        container.appendChild(educationItem);
    });
}

// Render skills section
function renderSkills() {
    const container = document.getElementById('skills-list');
    container.innerHTML = '';
    
    skillsData.forEach(category => {
        const skillCategory = createSkillCategory(category);
        container.appendChild(skillCategory);
    });
}

// Create expandable item (for experience and education)
function createExpandableItem(data, type) {
    const item = document.createElement('div');
    item.className = 'content-item';
    
    const header = document.createElement('div');
    header.className = 'item-header';
    
    const info = document.createElement('div');
    info.className = 'item-info';
    
    const title = document.createElement('h3');
    title.textContent = data.title;
    info.appendChild(title);
    
    if (data.company || data.school) {
        const company = document.createElement('div');
        company.className = 'company';
        company.textContent = data.company || data.school;
        info.appendChild(company);
    }
    
    if (data.period) {
        const period = document.createElement('div');
        period.className = 'period';
        period.textContent = data.period;
        if (data.location) {
            period.textContent += ` | ${data.location}`;
        }
        info.appendChild(period);
    }
    
    const expandIcon = document.createElement('div');
    expandIcon.className = 'expand-icon';
    expandIcon.textContent = '▼';
    
    header.appendChild(info);
    header.appendChild(expandIcon);
    
    const details = document.createElement('div');
    details.className = 'item-details';
    
    const detailsContent = document.createElement('div');
    detailsContent.className = 'item-details-content';
    
    if (data.details && Array.isArray(data.details)) {
        const list = document.createElement('ul');
        data.details.forEach(detail => {
            const listItem = document.createElement('li');
            listItem.textContent = detail;
            list.appendChild(listItem);
        });
        detailsContent.appendChild(list);
    }
    
    if (data.coursework) {
        const coursework = document.createElement('div');
        coursework.innerHTML = `<strong>Relevant Coursework:</strong> ${data.coursework}`;
        coursework.style.marginTop = '1rem';
        detailsContent.appendChild(coursework);
    }
    
    details.appendChild(detailsContent);
    
    item.appendChild(header);
    item.appendChild(details);
    
    // Add click event for expansion
    header.addEventListener('click', function() {
        item.classList.toggle('expanded');
    });
    
    return item;
}

// Create skill category
function createSkillCategory(category) {
    const container = document.createElement('div');
    container.className = 'skills-category';
    
    const title = document.createElement('h3');
    title.textContent = category.category;
    container.appendChild(title);
    
    const tagsContainer = document.createElement('div');
    tagsContainer.className = 'skill-tags';
    
    category.skills.forEach(skill => {
        const tag = document.createElement('span');
        tag.className = 'skill-tag';
        
        if (skill.level) {
            tag.classList.add(skill.level.toLowerCase());
        }
        
        tag.textContent = skill.name || skill;
        tagsContainer.appendChild(tag);
    });
    
    container.appendChild(tagsContainer);
    return container;
}
