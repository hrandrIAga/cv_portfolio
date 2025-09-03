// Utility function to process styled text from JSON
function processStyledText(text) {
    if (!text) return '';
    
    return text
        // Convert line breaks to <br> tags
        .replace(/\n/g, '<br>')
        // Convert **bold** to <strong>
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Convert *italic* to <em>
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Convert [text](url) to <a href="url">text</a>
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color: #2563eb; text-decoration: underline;">$1</a>')
        // Convert double line breaks to paragraphs
        .replace(/(<br>\s*){2,}/g, '</p><p>');
}

// Get project ID from URL parameter or filename
function getProjectId() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project');
    
    if (projectId) {
        return projectId;
    }
    
    // Fallback: extract from filename if following pattern project-{id}.html
    const filename = window.location.pathname.split('/').pop();
    const match = filename.match(/project-(.+)\.html/);
    return match ? match[1] : null;
}

// Load and render project data
async function loadProject() {
    const projectId = getProjectId();
    
    if (!projectId) {
        showError('No project ID found in URL');
        return;
    }

    try {
        // Try to load the JSON file
        const response = await fetch(`../assets/docs/data/projects_data/${projectId}.json`);
        
        if (!response.ok) {
            throw new Error(`Project not found: ${projectId}`);
        }
        
        const projectData = await response.json();
        renderProject(projectData);
        
    } catch (error) {
        showError(`Error loading project: ${error.message}`);
    }
}

function renderProject(data) {
    document.getElementById('page-title').textContent = data.title || 'Project Title';
    
    // Safely access nested properties with fallbacks
    const safeGet = (obj, path, fallback = 'N/A') => {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : fallback;
        }, obj);
    };

    // Build meta items including results if available
    let metaItems = [];
    
    // Event
    const event = safeGet(data, 'abstract.event.0') || safeGet(data, 'abstract.event');
    if (event && event !== 'N/A') {
        metaItems.push(`<div class="meta-item">
            <span>🏆</span>
            <span>${event}</span>
        </div>`);
    }
    
    // Team size
    const teamSize = safeGet(data, 'abstract.team_size');
    if (teamSize && teamSize !== 'N/A') {
        metaItems.push(`<div class="meta-item">
            <span>👥</span>
            <span>${teamSize} team members</span>
        </div>`);
    }
    
    // Period
    const period = safeGet(data, 'abstract.period');
    if (period && period !== 'N/A') {
        metaItems.push(`<div class="meta-item">
            <span>⏱️</span>
            <span>${period}</span>
        </div>`);
    }
    
    // Project field
    const projectField = safeGet(data, 'index.project_field');
    if (projectField && projectField !== 'N/A') {
        metaItems.push(`<div class="meta-item">
            <span>🎯</span>
            <span>${projectField}</span>
        </div>`);
    }

    // Add results to header if available
    const results = safeGet(data, 'detail.results');
    if (results && Array.isArray(results) && results.length > 0) {
        metaItems.push(`<div class="meta-item" style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: white;">
            <span>🥇</span>
            <span>${results[0]}</span>
        </div>`);
    }
    
    const content = `
        <header class="header">
            <div class="container">
                <div class="header-content">
                    <h1 class="project-title">${data.title || 'Project Title'}</h1>
                    <div class="project-meta">
                        ${metaItems.join('')}
                    </div>
                </div>
            </div>
        </header>

        <div class="container">
            <div class="main-content">
                <div class="content-section">
                    <h2 class="section-title">📋 Project Overview</h2>
                    <div class="highlight-box">
                        <h3 style="margin-bottom: 1rem; font-size: 1.1rem;">Description</h3>
                        <div>${processStyledText(safeGet(data, 'abstract.description', 'No description available.'))}</div>
                    </div>
                    
                    <h3 style="margin: 2rem 0 1rem; font-size: 1.1rem; color: #475569;">🛠️ Tech Stack</h3>
                    <div class="tech-stack">
                        ${(safeGet(data, 'abstract.tech_stack', []) || []).map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                </div>

                <div class="content-section">
                    <h2 class="section-title">🎯 Problem & Solution</h2>
                    <div style="margin-bottom: 2rem;">
                        <h3 style="margin-bottom: 1rem; color: #475569;">🎯 Context & Motivation</h3>
                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 1.5rem; border-radius: 10px; border-left: 4px solid #94a3b8; color: #475569;">${processStyledText(safeGet(data, 'detail.context', 'Context not provided.'))}</div>
                    </div>
                    
                    <div style="margin-bottom: 2rem;">
                        <h3 style="margin-bottom: 1rem; color: #475569;">✅ Our Approach</h3>
                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 1.5rem; border-radius: 10px; border-left: 4px solid #94a3b8; color: #475569;">${processStyledText(safeGet(data, 'detail.approach', 'Approach not provided.'))}</div>
                    </div>

                    <div>
                        <h3 style="margin-bottom: 1rem; color: #475569;">🚀 Solution Details</h3>
                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 1.5rem; border-radius: 10px; border-left: 4px solid #94a3b8; color: #475569;">${processStyledText(safeGet(data, 'detail.solution_description', 'solution description not provided.'))}</div>
                    </div>
                </div>

                <div class="content-section">
                    <h2 class="section-title">⚖️ Analysis</h2>
                    <div class="pros-cons">
                        <div class="pros">
                            <h3 style="margin-bottom: 1rem; font-weight: 600;">Strengths</h3>
                            <div>${processStyledText(safeGet(data, 'detail.pros', 'Strengths not provided.'))}</div>
                        </div>
                        <div class="cons">
                            <h3 style="margin-bottom: 1rem; font-weight: 600;">Future improvements</h3>
                            <div>${processStyledText(safeGet(data, 'detail.cons_and_improvements_ideas', 'Improvement ideas not provided.'))}</div>
                        </div>
                    </div>
                </div>

                ${results && Array.isArray(results) && results.length > 0 ? `
                <div class="content-section">
                    <h2 class="section-title">🏆 Results & Recognition</h2>
                    <div style="text-align: center;">
                        <div class="results-badge">
                            <span>🥇</span>
                            <span>${results[0]}</span>
                        </div>
                    </div>
                </div>` : ''}

                ${generateResourcesSection(data.resources)}
            </div>
        </div>
    `;

    document.getElementById('project-content').innerHTML = content;
    document.getElementById('loading').style.display = 'none';
    document.getElementById('project-content').style.display = 'block';
}

function generateResourcesSection(resources) {
    if (!resources) return '';
    
    const resourceConfig = {
        demo: { emoji: '🎬', label: 'Demo' },
        github: { emoji: '💻', label: 'GitHub Repository' },
        report: { emoji: '📄', label: 'Report' },
        pitch_slides: { emoji: '🎯', label: 'Pitch Slides' },
        photos: { emoji: '📸', label: 'Photos' }
    };
    
    let resourceItems = [];
    
    for (const [key, config] of Object.entries(resourceConfig)) {
        const resource = resources[key];
        if (!resource || !Array.isArray(resource)) continue;
        
        const [status, url] = resource;
        
        // Skip if unavailable
        if (status === 'unavailable') continue;
        
        if (status === 'pending') {
            resourceItems.push(`
                <div class="resource-item pending">
                    <span class="resource-emoji">${config.emoji}</span>
                    <span class="resource-label">${config.label}</span>
                    <span class="resource-status">🚧 Coming soon...</span>
                </div>
            `);
        } else if (status === 'available' && url) {
            if (key === 'photos') {
                resourceItems.push(generatePhotosSection(url, config));
            } else {
                resourceItems.push(`
                    <div class="resource-item available">
                        <span class="resource-emoji">${config.emoji}</span>
                        <span class="resource-label">${config.label}</span>
                        <a href="${url}" target="_blank" class="resource-link">
                            ${key === 'github' ? 'View Repository' : 'View/Download'} →
                        </a>
                    </div>
                `);
            }
        }
    }
    
    if (resourceItems.length === 0) return '';
    
    return `
        <div class="content-section">
            <h2 class="section-title">🎬 Resources & Links</h2>
            <div class="resources-grid">
                ${resourceItems.join('')}
            </div>
        </div>
    `;
}

function generatePhotosSection(folderPath, config) {
    // For now, we'll simulate photo detection since we can't actually scan folders in browser
    // You'll need to manually specify the number of photos or photo filenames in your JSON
    
    // This is a placeholder - in real implementation, you'd need to:
    // 1. Either list photo filenames in your JSON
    // 2. Or use a backend service to scan the folder
    // 3. Or manually specify photo count
    
    const photoCount = 3; // This should come from your JSON or folder scanning
    
    if (photoCount === 1) {
        return `
            <div class="resource-item photos single-photo">
                <span class="resource-emoji">${config.emoji}</span>
                <span class="resource-label">${config.label}</span>
                <div class="single-photo-container">
                    <img src="${folderPath}/photo1.jpg" alt="Project photo" class="single-photo-img" 
                         onerror="this.parentElement.innerHTML='<span class=&quot;photo-error&quot;>📷 Photo not found</span>'">
                </div>
            </div>
        `;
    } else if (photoCount > 1) {
        // Generate carousel
        let carouselSlides = '';
        for (let i = 1; i <= photoCount; i++) {
            carouselSlides += `
                <div class="carousel-slide" ${i === 1 ? 'style="display: block;"' : ''}>
                    <img src="${folderPath}/photo${i}.jpg" alt="Project photo ${i}" 
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY2NzM4NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPvCfk7cgUGhvdG8gbm90IGZvdW5kPC90ZXh0Pjwvc3ZnPg=='">
                </div>
            `;
        }
        
        return `
            <div class="resource-item photos carousel">
                <span class="resource-emoji">${config.emoji}</span>
                <span class="resource-label">${config.label} (${photoCount})</span>
                <div class="photo-carousel">
                    <div class="carousel-container">
                        ${carouselSlides}
                    </div>
                    <div class="carousel-controls">
                        <button class="carousel-btn prev" onclick="changeSlide(-1)">‹</button>
                        <span class="carousel-counter">1 / ${photoCount}</span>
                        <button class="carousel-btn next" onclick="changeSlide(1)">›</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    return `
        <div class="resource-item photos">
            <span class="resource-emoji">${config.emoji}</span>
            <span class="resource-label">${config.label}</span>
            <span class="resource-status">📷 No photos available</span>
        </div>
    `;
}

// Carousel functionality
let currentSlide = 1;
let totalSlides = 1;

function changeSlide(direction) {
    const slides = document.querySelectorAll('.carousel-slide');
    const counter = document.querySelector('.carousel-counter');
    
    if (slides.length === 0) return;
    
    totalSlides = slides.length;
    slides[currentSlide - 1].style.display = 'none';
    
    currentSlide += direction;
    
    if (currentSlide > totalSlides) currentSlide = 1;
    if (currentSlide < 1) currentSlide = totalSlides;
    
    slides[currentSlide - 1].style.display = 'block';
    if (counter) counter.textContent = `${currentSlide} / ${totalSlides}`;
}

function showError(message) {
    document.getElementById('loading').innerHTML = `
        <div class="error">
            <h3>⚠️ Error Loading Project</h3>
            <p>${message}</p>
            <p style="margin-top: 1rem;">
                <a href="../projects.html" style="color: #dc2626; text-decoration: underline;">← Back to Projects</a>
            </p>
        </div>
    `;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', loadProject);