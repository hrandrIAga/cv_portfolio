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

// Render experience section
function renderExperience() {
    const container = document.getElementById('experience-list');
    container.innerHTML = '';
    
    experienceData.forEach(item => {
        const experienceItem = createExpandableItem(item, 'experience');
        container.appendChild(experienceItem);
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
    
    // Handle title with URL for both experience and education
    if (data.company_url || data.school_url) {
        const titleLink = document.createElement('a');
        titleLink.href = data.company_url || data.school_url;
        titleLink.target = '_blank';
        titleLink.className = 'title-link';
        titleLink.textContent = data.title;
        title.appendChild(titleLink);
    } else {
        title.textContent = data.title;
    }
    
    info.appendChild(title);
    
    if (data.company || data.school) {
        const company = document.createElement('div');
        company.className = 'company';
        
        // Check if company has URL
        if (data.company_url) {
            const companyLink = document.createElement('a');
            companyLink.href = data.company_url;
            companyLink.target = '_blank';
            companyLink.className = 'company-link';
            companyLink.textContent = data.company || data.school;
            company.appendChild(companyLink);
        } else {
            company.textContent = data.company || data.school;
        }
        
        info.appendChild(company);
    }
    
    // Add reference if available (for experience items)
    if (data.referee && type === 'experience') {
        const reference = document.createElement('div');
        reference.className = 'referee';
        
        const referenceLabel = document.createElement('span');
        referenceLabel.className = 'reference-label';
        referenceLabel.textContent = 'Reference: ';
        
        const referenceText = document.createElement('span');
        referenceText.textContent = data.referee;
        
        reference.appendChild(referenceLabel);
        reference.appendChild(referenceText);
        info.appendChild(reference);
    }
    
    // Add context for education items (displayed in non-expanded view)
    if (data.details && data.details.context && Array.isArray(data.details.context) && type === 'education') {
        const contextContainer = document.createElement('div');
        contextContainer.className = 'education-context';
        
        data.details.context.forEach(contextLine => {
            const contextLine_elem = document.createElement('div');
            contextLine_elem.className = 'context-line';
            contextLine_elem.textContent = contextLine;
            contextContainer.appendChild(contextLine_elem);
        });
        
        info.appendChild(contextContainer);
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
    
    // Logo and expand icon container
    const headerRight = document.createElement('div');
    headerRight.className = 'header-right';
    
    // Add logo for education items
    if (data.logo && type === 'education') {
        const logoImg = document.createElement('img');
        logoImg.src = data.logo;
        logoImg.alt = `${data.school} logo`;
        logoImg.className = 'education-logo';
        headerRight.appendChild(logoImg);
    }
    
    const expandIcon = document.createElement('div');
    expandIcon.className = 'expand-icon';
    expandIcon.textContent = '▼';
    headerRight.appendChild(expandIcon);
    
    header.appendChild(info);
    header.appendChild(headerRight);
    
    const details = document.createElement('div');
    details.className = 'item-details';
    
    const detailsContent = document.createElement('div');
    detailsContent.className = 'item-details-content';
    
    // Add context section (for experience items only)
    if (data.context && Array.isArray(data.context) && data.context.length > 0 && type === 'experience') {
        const contextSection = document.createElement('div');
        contextSection.className = 'context-box';
        
        const contextTitle = document.createElement('h4');
        contextTitle.textContent = 'Context';
        contextSection.appendChild(contextTitle);
        
        data.context.forEach(contextItem => {
            const contextParagraph = document.createElement('p');
            contextParagraph.textContent = contextItem;
            contextSection.appendChild(contextParagraph);
        });
        
        detailsContent.appendChild(contextSection);
    }
    
    // Handle education details
    if (type === 'education' && data.details) {
        // Add speciality if available
        if (data.details.speciality) {
            const specialityDiv = document.createElement('div');
            specialityDiv.className = 'speciality';
            specialityDiv.innerHTML = `<strong>Speciality:</strong> ${data.details.speciality}`;
            detailsContent.appendChild(specialityDiv);
        }
        
        // Handle coursework (can be array or object)
        if (data.details.coursework) {
            const courseworkSection = document.createElement('div');
            courseworkSection.className = 'coursework-section';
            
            const courseworkTitle = document.createElement('h4');
            courseworkTitle.textContent = 'Coursework';
            courseworkSection.appendChild(courseworkTitle);
            
            if (Array.isArray(data.details.coursework)) {
                // Simple list format
                const courseList = document.createElement('ul');
                courseList.className = 'simple-course-list';
                data.details.coursework.forEach(course => {
                    const courseItem = document.createElement('li');
                    courseItem.textContent = course;
                    courseList.appendChild(courseItem);
                });
                courseworkSection.appendChild(courseList);
            } else if (typeof data.details.coursework === 'object') {
                // Expandable categories format
                const categoriesContainer = document.createElement('div');
                categoriesContainer.className = 'coursework-categories';
                
                Object.keys(data.details.coursework).forEach(category => {
                    const categoryItem = document.createElement('div');
                    categoryItem.className = 'coursework-category';
                    
                    const categoryHeader = document.createElement('div');
                    categoryHeader.className = 'category-header';
                    categoryHeader.innerHTML = `<span class="category-name">${category}</span><span class="category-expand">▼</span>`;
                    
                    const categoryContent = document.createElement('div');
                    categoryContent.className = 'category-content';
                    
                    const courseList = document.createElement('ul');
                    data.details.coursework[category].forEach(course => {
                        const courseItem = document.createElement('li');
                        courseItem.textContent = course;
                        courseList.appendChild(courseItem);
                    });
                    categoryContent.appendChild(courseList);
                    
                    categoryItem.appendChild(categoryHeader);
                    categoryItem.appendChild(categoryContent);
                    
                    // Add click event for category expansion
                    categoryHeader.addEventListener('click', function(e) {
                        e.stopPropagation();
                        categoryItem.classList.toggle('expanded');
                    });
                    
                    categoriesContainer.appendChild(categoryItem);
                });
                
                courseworkSection.appendChild(categoriesContainer);
            }
            
            detailsContent.appendChild(courseworkSection);
        }
        
        // Add research projects if available
        if (data.details['research projects']) {
            const researchSection = document.createElement('div');
            researchSection.className = 'research-section';
            
            const researchTitle = document.createElement('h4');
            researchTitle.textContent = 'Research Projects';
            researchSection.appendChild(researchTitle);
            
            Object.keys(data.details['research projects']).forEach(projectTitle => {
                const project = data.details['research projects'][projectTitle];
                const projectItem = document.createElement('div');
                projectItem.className = 'research-project';
                
                const projectHeader = document.createElement('div');
                projectHeader.className = 'project-header';
                
                const titleLink = document.createElement('a');
                titleLink.href = project.article_url;
                titleLink.target = '_blank';
                titleLink.className = 'project-title-link';
                titleLink.textContent = projectTitle;
                projectHeader.appendChild(titleLink);
                
                const projectDetails = document.createElement('div');
                projectDetails.className = 'project-details';
                
                if (project.paper_type) {
                    const paperType = document.createElement('span');
                    paperType.className = 'paper-type';
                    paperType.textContent = project.paper_type;
                    projectDetails.appendChild(paperType);
                }
                
                if (project.time) {
                    const timeSpan = document.createElement('span');
                    timeSpan.className = 'project-time';
                    timeSpan.textContent = `Duration: ${project.time}`;
                    projectDetails.appendChild(timeSpan);
                }
                
                if (project.prof) {
                    const profSpan = document.createElement('span');
                    profSpan.className = 'project-prof';
                    profSpan.textContent = `Supervisor: ${project.prof}`;
                    projectDetails.appendChild(profSpan);
                }
                
                if (project.conference) {
                    const conferenceDiv = document.createElement('div');
                    conferenceDiv.className = 'project-conference';
                    conferenceDiv.textContent = `Published at: ${project.conference}`;
                    projectDetails.appendChild(conferenceDiv);
                }
                
                projectItem.appendChild(projectHeader);
                projectItem.appendChild(projectDetails);
                researchSection.appendChild(projectItem);
            });
            
            detailsContent.appendChild(researchSection);
        }
        
        // Add grades if available
        if (data.details.grades) {
            const gradesDiv = document.createElement('div');
            gradesDiv.className = 'grades-info';
            gradesDiv.innerHTML = `<strong>Academic Performance:</strong> <em>${data.details.grades}</em>`;
            detailsContent.appendChild(gradesDiv);
        }
    }
    
    // Add details with nested bullet points (for experience items)
    if (type === 'experience' && data.details && Array.isArray(data.details)) {
        const list = document.createElement('ul');
        list.className = 'details-list';
        
        data.details.forEach(detail => {
            if (typeof detail === 'string') {
                // Regular bullet point
                const listItem = document.createElement('li');
                listItem.className = 'bullet-level-1';
                listItem.textContent = detail;
                list.appendChild(listItem);
            } else if (Array.isArray(detail) && detail.length > 0) {
                // Nested bullet points
                const mainItem = document.createElement('li');
                mainItem.className = 'bullet-level-1';
                mainItem.textContent = detail[0]; // First item as main bullet
                list.appendChild(mainItem);
                
                // Add sub-bullets if there are more items
                if (detail.length > 1) {
                    const subList = document.createElement('ul');
                    subList.className = 'sub-details-list';
                    
                    for (let i = 1; i < detail.length; i++) {
                        const subItem = document.createElement('li');
                        subItem.className = 'bullet-level-2';
                        subItem.textContent = detail[i];
                        subList.appendChild(subItem);
                    }
                    
                    list.appendChild(subList);
                }
            }
        });
        
        detailsContent.appendChild(list);
    }
    
    // Add coursework (for old education format compatibility)
    if (data.coursework) {
        const coursework = document.createElement('div');
        coursework.innerHTML = `<strong>Relevant Coursework:</strong> ${data.coursework}`;
        coursework.style.marginTop = '1rem';
        detailsContent.appendChild(coursework);
    }
    
    // Add results section (for experience items)
    if (data.results && Array.isArray(data.results) && data.results.length > 0) {
        const resultsSection = document.createElement('div');
        resultsSection.className = 'results-box';
        
        const resultsTitle = document.createElement('h4');
        resultsTitle.textContent = 'Key Results';
        resultsSection.appendChild(resultsTitle);
        
        const resultsList = document.createElement('ul');
        data.results.forEach(result => {
            const resultItem = document.createElement('li');
            resultItem.textContent = result;
            resultsList.appendChild(resultItem);
        });
        
        resultsSection.appendChild(resultsList);
        detailsContent.appendChild(resultsSection);
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