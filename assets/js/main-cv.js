// Main CV application controller
import { ExperienceModule } from './cv-modules/experience.js';
import { EducationModule } from './cv-modules/education.js';
import { SkillsModule } from './cv-modules/skills.js';

// Main application class
class InteractiveCVApp {
    constructor() {
        this.experienceModule = new ExperienceModule();
        this.educationModule = new EducationModule();
        this.skillsModule = new SkillsModule();
    }

    // Initialize the page when DOM is loaded
    init() {
        console.log('🚀 Initializing Interactive CV App...');
        this.initializeTabs();
        this.loadAllData();
    }

    // Tab functionality
    initializeTabs() {
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

    // Load all data from modules
    async loadAllData() {
        console.log('📄 Starting to load all data...');
        
        try {
            // Load data from each module
            await Promise.all([
                this.experienceModule.loadData(),
                this.educationModule.loadData(),
                this.skillsModule.loadData()
            ]);
            
            // Render all sections
            this.renderAllSections();
            console.log('✅ All data loaded and rendered successfully');
            
        } catch (error) {
            console.error('❌ Error loading data:', error);
            console.log('📄 Some modules may have fallen back to hardcoded data');
            
            // Still try to render what we can
            this.renderAllSections();
        }
    }

    // Render all sections
    renderAllSections() {
        console.log('🎨 Rendering all sections...');
        this.experienceModule.render();
        this.educationModule.render();
        this.skillsModule.render();
    }
}

// Utility function for fetching JSON data
export async function fetchJSON(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} for ${url}`);
    }
    return await response.json();
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const app = new InteractiveCVApp();
    app.init();
});