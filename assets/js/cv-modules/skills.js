// Skills module
import { fetchJSON } from '../main-cv.js';

export class SkillsModule {
    constructor() {
        this.data = [];
        this.containerId = 'skills-list';
    }

    // Load skills data
    async loadData() {
        try {
            console.log('📂 Attempting to load skills.json...');
            this.data = await fetchJSON('assets/docs/data/skills.json');
            console.log('✅ Skills data loaded:', this.data);
        } catch (error) {
            console.error('❌ Failed to load skills.json:', error);
            console.log('📄 Falling back to hardcoded skills data...');
            this.loadFallbackData();
        }
    }

    // Fallback data if JSON file is not available
    loadFallbackData() {
        this.data = [
            {
                category: "Programming Languages",
                skills: [
                    { name: "Python", level: 4 },
                    { name: "JavaScript", level: 3 },
                    { name: "SQL", level: 3 }
                ]
            },
            {
                category: "Tools & Technologies",
                skills: [
                    { name: "Git", level: 3 },
                    { name: "Docker", level: 2 }
                ]
            }
        ];
    }

    // Render skills section
    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`❌ Container with id '${this.containerId}' not found`);
            return;
        }

        container.innerHTML = '';
        
        // Create skills legend
        const legend = this.createSkillsLegend();
        container.appendChild(legend);
        
        // Create skill categories
        this.data.forEach(category => {
            const skillCategory = this.createSkillCategory(category);
            container.appendChild(skillCategory);
        });
    }

    // Create skills legend
    createSkillsLegend() {
        const legend = document.createElement('div');
        legend.className = 'skills-legend';
        
        const legendTitle = document.createElement('h3');
        legendTitle.textContent = 'Skill Level Legend';
        legend.appendChild(legendTitle);
        
        const legendItems = document.createElement('div');
        legendItems.className = 'legend-items';
        
        const levels = [
            { class: 'beginner', text: 'Beginner' },
            { class: 'beginner-medium', text: 'Beginner/Medium' },
            { class: 'medium-advanced', text: 'Medium/Advanced' },
            { class: 'advanced', text: 'Advanced' }
        ];
        
        levels.forEach(level => {
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            
            const legendColor = document.createElement('span');
            legendColor.className = `legend-color ${level.class}`;
            
            const legendText = document.createElement('span');
            legendText.textContent = level.text;
            
            legendItem.appendChild(legendColor);
            legendItem.appendChild(legendText);
            legendItems.appendChild(legendItem);
        });
        
        legend.appendChild(legendItems);
        return legend;
    }

    // Create skill category
    createSkillCategory(category) {
        const container = document.createElement('div');
        container.className = 'skills-category';
        
        const title = document.createElement('h3');
        title.textContent = category.category;
        container.appendChild(title);
        
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'skill-tags';
        
        category.skills.forEach(skill => {
            const skillItem = this.createSkillItem(skill);
            tagsContainer.appendChild(skillItem);
        });
        
        container.appendChild(tagsContainer);
        return container;
    }

    // Create individual skill item
    createSkillItem(skill) {
        const skillItem = document.createElement('div');
        skillItem.className = 'skill-item';
        
        const hasDetails = skill.details && skill.details.length > 0;
        if (hasDetails) {
            skillItem.classList.add('expandable');
            skillItem.addEventListener('click', function() {
                this.classList.toggle('expanded');
            });
        }
        
        const tag = document.createElement('div');
        tag.className = 'skill-tag';
        
        if (skill.level) {
            const levelClass = this.getSkillLevelClass(skill.level);
            tag.classList.add(levelClass);
        }
        
        tag.textContent = skill.name || skill;
        
        if (hasDetails) {
            const expandIndicator = document.createElement('span');
            expandIndicator.className = 'expand-indicator';
            expandIndicator.textContent = '▼';
            tag.appendChild(expandIndicator);
        }
        
        skillItem.appendChild(tag);
        
        if (hasDetails) {
            const skillDetails = this.createSkillDetails(skill);
            skillItem.appendChild(skillDetails);
        }
        
        return skillItem;
    }

    // Create skill details section
    createSkillDetails(skill) {
        const skillDetails = document.createElement('div');
        skillDetails.className = 'skill-details';
        
        const levelText = document.createElement('div');
        levelText.className = 'skill-level-text';
        levelText.textContent = this.getSkillLevelText(skill.level);
        skillDetails.appendChild(levelText);
        
        const detailsList = document.createElement('ul');
        detailsList.className = 'skill-details-list';
        
        skill.details.forEach(detail => {
            const detailItem = document.createElement('li');
            detailItem.textContent = detail;
            detailsList.appendChild(detailItem);
        });
        
        skillDetails.appendChild(detailsList);
        return skillDetails;
    }

    getSkillLevelClass(level) {
    switch(level) {
        case 1: return 'beginner';
        case 2: return 'beginner-medium';
        case 3: return 'medium-advanced';
        case 4: return 'advanced';
        default: return 'beginner';
    }
}

    getSkillLevelText(level) {
        switch(level) {
            case 1: return 'Beginner';
            case 2: return 'Beginner/Medium';
            case 3: return 'Medium/Advanced';
            case 4: return 'Advanced';
            default: return 'Beginner';
        }
    }
}
