// Experience module
import { fetchJSON } from '../main-cv.js';

export class ExperienceModule {
    constructor() {
        this.data = [];
        this.containerId = 'experience-list';
    }

    // Load experience data
    async loadData() {
        try {
            console.log('📂 Attempting to load experience.json...');
            this.data = await fetchJSON('assets/docs/data/experience.json');
            console.log('✅ Experience data loaded:', this.data);
        } catch (error) {
            console.error('❌ Failed to load experience.json:', error);
            console.log('📄 Falling back to hardcoded experience data...');
            this.loadFallbackData();
        }
    }

    // Fallback data if JSON file is not available
    loadFallbackData() {
        this.data = [
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
    }

    // Render experience section
    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`❌ Container with id '${this.containerId}' not found`);
            return;
        }

        container.innerHTML = '';
        
        this.data.forEach(item => {
            const experienceItem = this.createExperienceItem(item);
            container.appendChild(experienceItem);
        });
    }

    // Create individual experience item
    createExperienceItem(data) {
        const item = document.createElement('div');
        item.className = 'content-item';
        
        const header = document.createElement('div');
        header.className = 'item-header';
        
        const info = document.createElement('div');
        info.className = 'item-info';
        
        const title = document.createElement('h3');
        
        // Handle title with URL
        if (data.company_url) {
            const titleLink = document.createElement('a');
            titleLink.href = data.company_url;
            titleLink.target = '_blank';
            titleLink.className = 'title-link';
            titleLink.textContent = data.title;
            title.appendChild(titleLink);
        } else {
            title.textContent = data.title;
        }
        
        info.appendChild(title);
        
        if (data.company) {
            const company = document.createElement('div');
            company.className = 'company';
            
            // Check if company has URL
            if (data.company_url) {
                const companyLink = document.createElement('a');
                companyLink.href = data.company_url;
                companyLink.target = '_blank';
                companyLink.className = 'company-link';
                companyLink.textContent = data.company;
                company.appendChild(companyLink);
            } else {
                company.textContent = data.company;
            }
            
            info.appendChild(company);
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
        
        // Add reference if available
        if (data.referee) {
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
        
        // Logo and expand icon container
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
        
        // Add context section if available
        if (data.context && Array.isArray(data.context) && data.context.length > 0) {
            const contextSection = this.createContextSection(data.context);
            detailsContent.appendChild(contextSection);
        }
        
        // Add main details
        if (data.details && Array.isArray(data.details)) {
            const detailsList = this.createDetailsList(data.details);
            detailsContent.appendChild(detailsList);
        }
        
        // Add results section if available
        if (data.results && Array.isArray(data.results) && data.results.length > 0) {
            const resultsSection = this.createResultsSection(data.results);
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

    // Create context section
    createContextSection(context) {
        const contextSection = document.createElement('div');
        contextSection.className = 'context-box';
        
        const contextTitle = document.createElement('h4');
        contextTitle.textContent = 'Context';
        contextSection.appendChild(contextTitle);
        
        context.forEach(contextItem => {
            const contextParagraph = document.createElement('p');
            contextParagraph.textContent = contextItem;
            contextSection.appendChild(contextParagraph);
        });
        
        return contextSection;
    }

    // Create details list with nested bullet points
    createDetailsList(details) {
        const list = document.createElement('ul');
        list.className = 'details-list';
        
        details.forEach(detail => {
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
        
        return list;
    }

    // Create results section
    createResultsSection(results) {
        const resultsSection = document.createElement('div');
        resultsSection.className = 'results-box';
        
        const resultsTitle = document.createElement('h4');
        resultsTitle.textContent = 'Key Results';
        resultsSection.appendChild(resultsTitle);
        
        const resultsList = document.createElement('ul');
        results.forEach(result => {
            const resultItem = document.createElement('li');
            resultItem.textContent = result;
            resultsList.appendChild(resultItem);
        });
        
        resultsSection.appendChild(resultsList);
        return resultsSection;
    }
}