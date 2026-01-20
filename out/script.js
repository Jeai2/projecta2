
        // State
        let currentMode = 'general'; // 'general' or 'expert'

        // Elements
        const appWrapper = document.getElementById('app-wrapper');
        const navContainer = document.getElementById('nav-container');
        const mainContent = document.getElementById('main-content');
        const bodyEl = document.getElementById('body-el');
        
        // Mode Switcher Elements
        const toggleTrack = document.querySelector('.mode-toggle-track');
        const toggleThumb = document.querySelector('.mode-toggle-thumb');
        const modeLabel = document.getElementById('mode-label');
        const modeIcon = document.getElementById('mode-icon');

        // Templates
        const tplNavGeneral = document.getElementById('tpl-nav-general');
        const tplNavExpert = document.getElementById('tpl-nav-expert');
        const tplContentGeneral = document.getElementById('tpl-content-general');
        const tplContentExpert = document.getElementById('tpl-content-expert');

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            applyMode('general');
        });

        // Toggle Function
        function toggleAppMode() {
            const newMode = currentMode === 'general' ? 'expert' : 'general';
            applyMode(newMode);
        }

        // Apply Mode Logic
        function applyMode(mode) {
            currentMode = mode;
            
            // 1. Transition Animation Start (Fade Out Content)
            mainContent.style.opacity = '0';
            mainContent.style.transform = 'translateY(10px)';

            setTimeout(() => {
                // 2. Update Layout Structure & Inject Nav
                navContainer.innerHTML = ''; // Clear Nav
                mainContent.innerHTML = '';  // Clear Content

                if (mode === 'general') {
                    // --- GENERAL MODE SETUP ---
                    appWrapper.classList.remove('flex-row');
                    appWrapper.classList.add('flex-col'); // Top to Bottom
                    
                    // Inject Top Nav
                    navContainer.appendChild(tplNavGeneral.content.cloneNode(true));
                    
                    // Inject General Content
                    mainContent.appendChild(tplContentGeneral.content.cloneNode(true));

                    // Style Updates
                    bodyEl.classList.remove('bg-[#0f172a]');
                    bodyEl.classList.add('bg-brand-paper');
                    mainContent.classList.remove('bg-[#0f172a]');
                    mainContent.classList.add('bg-brand-paper/50');

                    // Switcher UI
                    toggleTrack.classList.remove('bg-brand-gold');
                    toggleTrack.classList.add('bg-gray-200');
                    toggleThumb.style.transform = 'translateX(0)';
                    toggleThumb.classList.remove('bg-gray-900');
                    toggleThumb.classList.add('bg-white');
                    modeLabel.innerText = "일반 모드";
                    modeLabel.classList.remove('text-brand-gold');
                    modeLabel.classList.add('text-gray-500');
                    modeIcon.innerText = "person";
                    modeIcon.classList.remove('text-brand-gold');
                    modeIcon.classList.add('text-gray-600');

                } else {
                    // --- EXPERT MODE SETUP ---
                    appWrapper.classList.remove('flex-col');
                    appWrapper.classList.add('flex-row'); // Left to Right
                    
                    // Inject Side Nav
                    navContainer.appendChild(tplNavExpert.content.cloneNode(true));
                    
                    // Inject Expert Content
                    mainContent.appendChild(tplContentExpert.content.cloneNode(true));

                    // Style Updates
                    bodyEl.classList.remove('bg-brand-paper');
                    bodyEl.classList.add('bg-[#0f172a]');
                    mainContent.classList.remove('bg-brand-paper/50');
                    mainContent.classList.add('bg-[#0f172a]');

                    // Switcher UI
                    toggleTrack.classList.remove('bg-gray-200');
                    toggleTrack.classList.add('bg-brand-gold');
                    toggleThumb.style.transform = 'translateX(24px)';
                    toggleThumb.classList.remove('bg-white');
                    toggleThumb.classList.add('bg-gray-900');
                    modeLabel.innerText = "전문가 모드";
                    modeLabel.classList.remove('text-gray-500');
                    modeLabel.classList.add('text-brand-gold');
                    modeIcon.innerText = "diamond";
                    modeIcon.classList.remove('text-gray-600');
                    modeIcon.classList.add('text-brand-gold');
                }

                // 3. Transition Animation End (Fade In Content)
                setTimeout(() => {
                    mainContent.style.opacity = '1';
                    mainContent.style.transform = 'translateY(0)';
                }, 50);

            }, 300); // Wait for fade out
        }

        function loadContent(contentId) {
            console.log(`Loading ${contentId}...`);
        }

        // Export Functionality
        function exportToZip() {
            const zip = new JSZip();

            // 1. Get CSS
            const styleTag = document.getElementById('custom-styles');
            const cssContent = styleTag ? styleTag.innerHTML : '';

            // 2. Get JS
            const scriptTag = document.getElementById('main-script');
            const jsContent = scriptTag ? scriptTag.innerHTML : '';

            // 3. Get HTML
            // We clone the document to modify it for export without touching the live page
            const clone = document.documentElement.cloneNode(true);
            
            // Remove the inline style and script we extracted
            const cloneStyle = clone.querySelector('#custom-styles');
            if(cloneStyle) cloneStyle.remove();
            
            const cloneScript = clone.querySelector('#main-script');
            if(cloneScript) cloneScript.remove();

            // Add links to external files
            const head = clone.querySelector('head');
            
            const linkTag = document.createElement('link');
            linkTag.rel = 'stylesheet';
            linkTag.href = 'style.css';
            head.appendChild(linkTag);

            const body = clone.querySelector('body');
            const scriptSrcTag = document.createElement('script');
            scriptSrcTag.src = 'script.js';
            body.appendChild(scriptSrcTag);

            const htmlContent = clone.outerHTML;

            // 4. Create Zip
            zip.file("index.html", htmlContent);
            zip.file("style.css", cssContent);
            zip.file("script.js", jsContent);
            zip.file("readme.txt", "화의명리 (Hwa-Ui) Source Code\n\n- index.html: Main structure\n- style.css: Custom styles\n- script.js: Application logic\n\nOpen index.html in your browser to run.");

            // 5. Download
            zip.generateAsync({type:"blob"})
            .then(function(content) {
                saveAs(content, "hwa-ui-source.zip");
            });
        }
    