let projectsData = [];
let activeFieldFilters = new Set();
let activeTypeFilters = new Set();
let carouselIntervals = new Map();

// Subtle color palettes for different categories
const colorPalettes = {
    'data/AI': ['#64748b', '#475569'],
    'wireless network': ['#6b7280', '#4b5563'],
    'other': ['#71717a', '#52525b'],
    'hackathon/challenge': ['#059669', '#047857'],
    'scientific research': ['#7c3aed', '#6d28d9'],
    'POC': ['#0891b2', '#0e7490'],
    'optimization': ['#dc2626', '#b91c1c'],
    'academic': ['#ea580c', '#c2410c'],
    'perso': ['#16a34a', '#15803d']
};

async function loadProjectsData() {
    try {
        const response = await fetch('assets/docs/data/projects_data/projects_index.csv');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const csvText = await response.text();
        projectsData = parseCSV(csvText);
        
        setupFilters();
        renderProjects();
        
        document.getElementById('loading').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        
    } catch (error) {
        console.error('Error loading projects:', error);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error-content').style.display = 'block';
    }
}

function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(';');
    const projects = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(';');
        const project = {};
        
        headers.forEach((header, index) => {
            let value = values[index] || '';
            
            // Parse JSON-like arrays
            if (value.startsWith('[') && value.endsWith(']')) {
                try {
                    value = JSON.parse(value.replace(/"/g, '"'));
                } catch (e) {
                    value = value.slice(1, -1).split(',').map(s => s.trim().replace(/"/g, ''));
                }
            }
            
            project[header.trim()] = value;
        });
        
        projects.push(project);
    }

    return projects;
}

function setupFilters() {
    const fields = new Set();
    const types = new Set();

    projectsData.forEach(project => {
        if (Array.isArray(project.project_field)) {
            project.project_field.forEach(field => fields.add(field));
        } else if (project.project_field) {
            fields.add(project.project_field);
        }

        if (Array.isArray(project.project_type)) {
            project.project_type.forEach(type => types.add(type));
        } else if (project.project_type) {
            types.add(project.project_type);
        }
    });

    // Initially select all filters
    activeFieldFilters = new Set(fields);
    activeTypeFilters = new Set(types);

    createFilterOptions('field-filters', fields, activeFieldFilters, 'field');
    createFilterOptions('type-filters', types, activeTypeFilters, 'type');
}

function createFilterOptions(containerId, options, activeSet, filterType) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    Array.from(options).sort().forEach(option => {
        const filterDiv = document.createElement('div');
        filterDiv.className = 'filter-option active';
        filterDiv.innerHTML = `
            <input type="checkbox" id="${filterType}-${option}" checked>
            <label for="${filterType}-${option}">${option}</label>
        `;
        
        filterDiv.addEventListener('click', (e) => {
            if (e.target.type !== 'checkbox') {
                const checkbox = filterDiv.querySelector('input');
                checkbox.checked = !checkbox.checked;
            }
            
            const checkbox = filterDiv.querySelector('input');
            if (checkbox.checked) {
                activeSet.add(option);
                filterDiv.classList.add('active');
            } else {
                activeSet.delete(option);
                filterDiv.classList.remove('active');
            }
            
            renderProjects();
        });
        
        container.appendChild(filterDiv);
    });
}

function renderProjects() {
    renderProjectsByCategory('field', 'field-content', activeFieldFilters);
    renderProjectsByCategory('type', 'type-content', activeTypeFilters);
}

function renderProjectsByCategory(categoryType, containerId, activeFilters) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    // Clear existing intervals
    carouselIntervals.forEach(interval => clearInterval(interval));
    carouselIntervals.clear();

    const categoryField = categoryType === 'field' ? 'project_field' : 'project_type';
    
    Array.from(activeFilters).sort().forEach(category => {
        const projectsInCategory = projectsData.filter(project => {
            const projectCategory = Array.isArray(project[categoryField]) 
                ? project[categoryField] 
                : [project[categoryField]];
            return projectCategory.includes(category);
        });

        if (projectsInCategory.length === 0) return;

        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'project-category';
        
        const categoryId = `${categoryType}-${category.replace(/[^a-zA-Z0-9]/g, '-')}`;
        
        categoryDiv.innerHTML = `
            <div class="category-title">${category}</div>
            <div class="carousel-container" id="${categoryId}-carousel" onclick="goToCurrentProject('${categoryId}')">
                ${projectsInCategory.map((project, index) => `
                    <div class="carousel-slide ${index === 0 ? 'active' : ''}" data-project-id="${project.id}" data-slide-index="${index}">
                        ${createProjectIllustration(project)}
                    </div>
                `).join('')}
                ${projectsInCategory.length > 1 ? `
                    <button class="carousel-arrow prev" onclick="event.stopPropagation(); navigateCarousel('${categoryId}', -1)">‹</button>
                    <button class="carousel-arrow next" onclick="event.stopPropagation(); navigateCarousel('${categoryId}', 1)">›</button>
                    <div class="carousel-controls">
                        ${projectsInCategory.map((_, index) => `
                            <div class="carousel-dot ${index === 0 ? 'active' : ''}" onclick="event.stopPropagation(); goToSlide('${categoryId}', ${index})"></div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
            <div class="projects-list">
                ${projectsInCategory.map(project => createProjectListItem(project)).join('')}
            </div>
        `;

        container.appendChild(categoryDiv);

        // Store project data for this carousel
        const carouselElement = document.getElementById(`${categoryId}-carousel`);
        carouselElement.projectsData = projectsInCategory;

        container.appendChild(categoryDiv);

        // Setup carousel auto-rotation
        if (projectsInCategory.length > 1) {
            const interval = setInterval(() => {
                navigateCarousel(categoryId, 1, true);
            }, 5000);
            
            carouselIntervals.set(categoryId, interval);
        }
    });
}

function createProjectIllustration(project) {
    if (project.illustration && project.illustration.trim()) {
        return `
            <div class="project-illustration">
                <img src="${project.illustration}" alt="${project.title}" onerror="this.parentElement.innerHTML=\`${createFallbackIllustration(project)}\`">
                <div class="project-title-overlay">
                    <div class="project-title-main">${project.title}</div>
                    ${project.description ? `<div class="project-description">${project.description}</div>` : ''}
                    ${project.tech_stack ? createTechStackCarousel(project.tech_stack) : ''}
                </div>
            </div>
        `;
    } else {
        return createFallbackIllustration(project);
    }
}

function createFallbackIllustration(project) {
    const fields = Array.isArray(project.project_field) ? project.project_field : [project.project_field];
    const types = Array.isArray(project.project_type) ? project.project_type : [project.project_type];
    
    const colorKey = fields[0] || types[0] || 'other';
    const colors = colorPalettes[colorKey] || colorPalettes['other'];
    
    const displayInfo = [
        project.organizer,
        project.event,
        ...(Array.isArray(project.result) ? project.result : [project.result].filter(Boolean))
    ].filter(Boolean);

    return `
        <div class="project-illustration">
            <div class="project-placeholder" style="background: linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%);">
                <div class="project-title-main">${project.title}</div>
                ${displayInfo.slice(0, 2).map(info => `<div class="project-info-item">${info}</div>`).join('')}
                ${project.description ? `<div class="project-description" style="margin-top: 0.75rem;">${project.description}</div>` : ''}
                ${project.tech_stack ? createTechStackCarousel(project.tech_stack) : ''}
            </div>
        </div>
    `;
}

function createTechStackCarousel(techStack) {
    if (!techStack) return '';
    
    const stack = Array.isArray(techStack) ? techStack : [techStack];
    return `
        <div class="tech-stack-carousel">
            ${stack.slice(0, 4).map(tech => `<span class="tech-tag-carousel">${tech}</span>`).join('')}
        </div>
    `;
}

function createProjectListItem(project) {
    const projectId = `project-${project.id}-${Math.random().toString(36).substr(2, 9)}`;
    
    return `
        <div class="project-item">
            <a href="projects/project-${project.id}.html" class="project-link">
                <div class="project-title-list">${project.title}</div>
                <div class="project-meta">
                    ${project.organizer ? `${project.organizer}` : ''}
                    ${project.event ? ` • ${project.event}` : ''}
                    ${project.result && Array.isArray(project.result) && project.result.length > 0 ? ` • ${project.result[0]}` : ''}
                </div>
                ${project.tech_stack ? createTechStackList(project.tech_stack) : ''}
                ${project.description || hasAdditionalInfo(project) ? `
                    <button class="expand-btn" onclick="toggleExpand(event, '${projectId}')">
                        ▼ Show details
                    </button>
                ` : ''}
            </a>
            ${project.description || hasAdditionalInfo(project) ? `
                <div class="project-expanded" id="${projectId}">
                    ${project.description ? `<div class="project-description-list">${project.description}</div>` : ''}
                    ${createAdditionalInfo(project)}
                    <a href="projects/project-${project.id}.html" class="see-more-link">
                        📖 See full details →
                    </a>
                </div>
            ` : ''}
        </div>
    `;
}

function createTechStackList(techStack) {
    if (!techStack) return '';
    
    const stack = Array.isArray(techStack) ? techStack : [techStack];
    return `
        <div class="tech-stack-list">
            ${stack.slice(0, 6).map(tech => `<span class="tech-tag-list">${tech}</span>`).join('')}
        </div>
    `;
}

function hasAdditionalInfo(project) {
    return project.team || (project.result && project.result.length > 1) || project.organizer || project.event;
}

function createAdditionalInfo(project) {
    let info = [];
    
    if (project.team) {
        const teamSize = parseInt(project.team);
        if (teamSize > 0) {
            info.push(`👥 Team of ${teamSize + 1} members`);
        } else {
            info.push(`👤 Individual project`);
        }
    }
    
    if (project.result && Array.isArray(project.result) && project.result.length > 1) {
        info.push(`🏆 ${project.result.join(' • ')}`);
    }
    
    if (project.event && project.organizer) {
        info.push(`🎯 ${project.event} by ${project.organizer}`);
    }
    
    return info.length > 0 ? `
        <div style="margin-bottom: 1rem; font-size: 0.8rem; color: #6b7280;">
            ${info.join('<br>')}
        </div>
    ` : '';
}

function toggleExpand(event, projectId) {
    event.preventDefault();
    event.stopPropagation();
    
    const expanded = document.getElementById(projectId);
    const button = event.target;
    
    if (expanded.classList.contains('show')) {
        expanded.classList.remove('show');
        button.textContent = '▼ Show details';
    } else {
        expanded.classList.add('show');
        button.textContent = '▲ Hide details';
    }
}

// New carousel navigation functions
function navigateCarousel(carouselId, direction, isAutomatic = false) {
    const carousel = document.getElementById(`${carouselId}-carousel`);
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.carousel-dot');
    const activeSlide = carousel.querySelector('.carousel-slide.active');
    
    if (!activeSlide || slides.length <= 1) return;
    
    let currentIndex = Array.from(slides).indexOf(activeSlide);
    let nextIndex;
    
    if (direction === 1) { // Next
        nextIndex = currentIndex + 1;
        if (nextIndex >= slides.length) nextIndex = 0;
    } else { // Previous
        nextIndex = currentIndex - 1;
        if (nextIndex < 0) nextIndex = slides.length - 1;
    }
    
    // Remove active class from current slide and dot
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Add active class to new slide and dot
    slides[nextIndex].classList.add('active');
    if (dots[nextIndex]) dots[nextIndex].classList.add('active');
    
    // Reset auto-rotation timer if this was a manual navigation
    if (!isAutomatic && carouselIntervals.has(carouselId)) {
        clearInterval(carouselIntervals.get(carouselId));
        const interval = setInterval(() => {
            navigateCarousel(carouselId, 1, true);
        }, 5000);
        carouselIntervals.set(carouselId, interval);
    }
}

function goToSlide(carouselId, slideIndex) {
    const carousel = document.getElementById(`${carouselId}-carousel`);
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.carousel-dot');
    
    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Add active class to selected slide and dot
    if (slides[slideIndex]) slides[slideIndex].classList.add('active');
    if (dots[slideIndex]) dots[slideIndex].classList.add('active');
    
    // Reset auto-rotation timer
    if (carouselIntervals.has(carouselId)) {
        clearInterval(carouselIntervals.get(carouselId));
        const interval = setInterval(() => {
            navigateCarousel(carouselId, 1, true);
        }, 5000);
        carouselIntervals.set(carouselId, interval);
    }
}

function goToCurrentProject(carouselId) {
    const carousel = document.getElementById(`${carouselId}-carousel`);
    if (!carousel) return;
    
    const activeSlide = carousel.querySelector('.carousel-slide.active');
    if (!activeSlide) return;
    
    const projectId = activeSlide.getAttribute('data-project-id');
    if (projectId) {
        window.location.href = `projects/project-${projectId}.html`;
    }
}

function goToProject(projectId) {
    window.location.href = `projects/project-${projectId}.html`;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', loadProjectsData);