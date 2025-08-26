// Education module
import { fetchJSON } from '../main-cv.js';

export class EducationModule {
    constructor() {
        this.data = [];
        this.containerId = 'education-list';
    }

    // Load education data
    async loadData() {
        try {
            console.log('📂 Attempting to load education.json...');
            this.data = await fetchJSON('assets/docs/data/education.json');
            console.log('✅ Education data loaded:', this.data);
        } catch (error) {
            console.error('❌ Failed to load education.json:', error);
            console.log('📄 Falling back to hardcoded education data...');
            this.loadFallbackData();
        }
    }

    // Fallback data if JSON file is not available
    loadFallbackData() {
        this.data = [
            {
                title: "Master's Degree Example",
                school: "University Example",
                period: "2023 - 2025",
                location: "City, Country",
                details: {
                    speciality: "Data Science",
                    coursework: ["Machine Learning", "Statistics", "Programming"],
                    grades: "GPA: 3.8/4.0"
                }
            }
        ];
    }

    // Render education section
    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`❌ Container with id '${this.containerId}' not found`);
            return;
        }

        container.innerHTML = '';
        
        this.data.forEach(item => {
            const educationItem = this.createEducationItem(item);
            container.appendChild(educationItem);
        });
    }

    // Create individual education item
    createEducationItem(data) {
        const item = document.createElement('div');
        item.className = 'content-item';
        
        const header = document.createElement('div');
        header.className = 'item-header';
        
        const info = document.createElement('div');
        info.className = 'item-info';
        
        const title = document.createElement('h3');
        
        // Handle title with URL
        if (data.school_url) {
            const titleLink = document.createElement('a');
            titleLink.href = data.school_url;
            titleLink.target = '_blank';
            titleLink.className = 'title-link';
            titleLink.textContent = data.title;
            title.appendChild(titleLink);
        } else {
            title.textContent = data.title;
        }
        
        info.appendChild(title);
        
        if (data.school) {
            const school = document.createElement('div');
            school.className = 'company';
            
            // Check if school has URL
            if (data.school_url) {
                const schoolLink = document.createElement('a');
                schoolLink.href = data.school_url;
                schoolLink.target = '_blank';
                schoolLink.className = 'company-link';
                schoolLink.textContent = data.school;
                school.appendChild(schoolLink);
            } else {
                school.textContent = data.school;
            }
            
            info.appendChild(school);
        }
        
        // Period and location info
        if (data.period) {
            const period = document.createElement('div');
            period.className = 'period';
            period.textContent = data.period;
            if (data.location) {
                period.textContent += ` | ${data.location}`;
            }
            info.appendChild(period);
        }
        
        // Add context for education items (displayed in non-expanded view)
        if (data.details && data.details.context && Array.isArray(data.details.context)) {
            const contextContainer = document.createElement('div');
            contextContainer.className = 'education-context-collapsed';
            
            data.details.context.forEach(contextLine => {
                const contextLine_elem = document.createElement('div');
                contextLine_elem.className = 'context-line-collapsed';
                contextLine_elem.textContent = contextLine.toLowerCase();
                contextContainer.appendChild(contextLine_elem);
            });
            
            info.appendChild(contextContainer);
        }
        
        // Expand icon container
        const headerRight = document.createElement('div');
        headerRight.className = 'header-right';
        
        const expandIcon = document.createElement('div');
        expandIcon.className = 'expand-icon';
        expandIcon.textContent = '▼';
        headerRight.appendChild(expandIcon);
        
        header.appendChild(info);
        header.appendChild(headerRight);
        
        // Details section
        const details = document.createElement('div');
        details.className = 'item-details';
        
        const detailsContent = document.createElement('div');
        detailsContent.className = 'item-details-content';
        
        // Handle education details
        if (data.details) {
            this.addEducationDetails(detailsContent, data.details);
        }
        
        // Add coursework for old format compatibility
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

    // Add education details to content
    addEducationDetails(detailsContent, details) {
        // Add speciality if available
        if (details.speciality) {
            const specialityDiv = document.createElement('div');
            specialityDiv.className = 'speciality';
            specialityDiv.innerHTML = `<strong>Speciality:</strong> ${details.speciality}`;
            detailsContent.appendChild(specialityDiv);
        }
        
        // Handle coursework
        if (details.coursework) {
            const courseworkSection = this.createCourseworkSection(details.coursework);
            detailsContent.appendChild(courseworkSection);
        }
        
        // Add research projects if available
        if (details['research projects']) {
            const researchSection = this.createResearchSection(details['research projects']);
            detailsContent.appendChild(researchSection);
        }
        
        // Add grades if available
        if (details.grades) {
            const gradesDiv = document.createElement('div');
            gradesDiv.className = 'grades-info';
            gradesDiv.innerHTML = `<strong>Academic Performance:</strong> <em>${details.grades}</em>`;
            detailsContent.appendChild(gradesDiv);
        }
    }

    // Create coursework section
    createCourseworkSection(coursework) {
        const courseworkSection = document.createElement('div');
        courseworkSection.className = 'coursework-section';
        
        const courseworkTitle = document.createElement('h4');
        courseworkTitle.textContent = 'Coursework';
        courseworkSection.appendChild(courseworkTitle);
        
        if (Array.isArray(coursework)) {
            // Simple list format
            const courseList = document.createElement('ul');
            courseList.className = 'simple-course-list';
            coursework.forEach(course => {
                const courseItem = document.createElement('li');
                courseItem.textContent = course;
                courseList.appendChild(courseItem);
            });
            courseworkSection.appendChild(courseList);
        } else if (typeof coursework === 'object') {
            // Dictionary format - create expandable bullet points
            const courseworkList = document.createElement('ul');
            courseworkList.className = 'coursework-main-list';
            
            Object.keys(coursework).forEach(category => {
                const categoryItem = this.createCourseworkCategory(category, coursework[category]);
                courseworkList.appendChild(categoryItem);
            });
            
            courseworkSection.appendChild(courseworkList);
        }
        
        return courseworkSection;
    }

    // Create coursework category
    createCourseworkCategory(category, courses) {
        const categoryItem = document.createElement('li');
        categoryItem.className = 'coursework-category-item';
        
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'coursework-category-header';
        categoryHeader.innerHTML = `<span class="category-name">${category}</span><span class="category-expand">▼</span>`;
        
        const categoryContent = document.createElement('div');
        categoryContent.className = 'coursework-category-content';
        
        const subCourseList = document.createElement('ul');
        subCourseList.className = 'coursework-sub-list';
        courses.forEach(course => {
            const courseItem = document.createElement('li');
            courseItem.className = 'coursework-sub-item';
            courseItem.textContent = course;
            subCourseList.appendChild(courseItem);
        });
        categoryContent.appendChild(subCourseList);
        
        categoryItem.appendChild(categoryHeader);
        categoryItem.appendChild(categoryContent);
        
        // Add click event for category expansion
        categoryHeader.addEventListener('click', function(e) {
            e.stopPropagation();
            categoryItem.classList.toggle('expanded');
        });
        
        return categoryItem;
    }

    // Create research projects section
    createResearchSection(researchProjects) {
        const researchSection = document.createElement('div');
        researchSection.className = 'research-section';
        
        const researchTitle = document.createElement('h4');
        researchTitle.textContent = 'Research Projects';
        researchSection.appendChild(researchTitle);
        
        Object.keys(researchProjects).forEach(projectTitle => {
            const project = researchProjects[projectTitle];
            const projectItem = this.createResearchProject(projectTitle, project);
            researchSection.appendChild(projectItem);
        });
        
        return researchSection;
    }

    // Create individual research project
    createResearchProject(projectTitle, project) {
        const projectItem = document.createElement('div');
        projectItem.className = 'research-project-highlight';
        
        const projectList = document.createElement('ul');
        projectList.className = 'research-project-list';
        
        const mainProjectItem = document.createElement('li');
        mainProjectItem.className = 'research-project-main';
        
        const titleLink = document.createElement('a');
        titleLink.href = project.article_url;
        titleLink.target = '_blank';
        titleLink.className = 'project-title-link';
        titleLink.textContent = projectTitle;
        mainProjectItem.appendChild(titleLink);
        
        // Sub-bullets for project details
        const projectSubList = document.createElement('ul');
        projectSubList.className = 'research-project-sub-list';
        
        const projectDetails = [
            { key: 'paper_type', label: 'Paper Type' },
            { key: 'time', label: 'Duration' },
            { key: 'prof', label: 'Supervisor' },
            { key: 'conference', label: 'Published at' }
        ];
        
        projectDetails.forEach(detail => {
            if (project[detail.key]) {
                const detailItem = document.createElement('li');
                detailItem.className = 'research-project-sub';
                detailItem.textContent = `${detail.label}: ${project[detail.key]}`;
                projectSubList.appendChild(detailItem);
            }
        });
        
        projectList.appendChild(mainProjectItem);
        projectList.appendChild(projectSubList);
        projectItem.appendChild(projectList);
        
        return projectItem;
    }
}