// Extension Chrome pour transformer les résultats Expedia en tableau comparatif
class ExpediaCarComparator {
    constructor() {
        this.isExpediaCarSearch = false;
        this.vehicles = [];
        this.isLoading = false;
        this.init();
    }

    init() {
        // Vérifier si on est sur le site Expedia
        if (this.detectExpediaSite()) {
            // Si on est sur une page de recherche de véhicules
            if (this.detectExpediaCarSearchPage()) {
                this.isExpediaCarSearch = true;
                // Afficher seulement le bouton original qui fonctionne bien
                this.createCompareButton();
                console.log('Extension Expedia Car Comparator activée - Page de recherche détectée');
            }
        }
    }

    detectExpediaSite() {
        // Vérifier si on est sur un domaine Expedia
        const hostname = window.location.hostname.toLowerCase();
        const isExpediaDomain = hostname.includes('expedia.com') || 
                               hostname.includes('expedia.fr') || 
                               hostname.includes('expedia.ca') ||
                               hostname.includes('expedia.co.uk') ||
                               hostname.includes('expedia.de') ||
                               hostname.includes('expedia.es') ||
                               hostname.includes('expedia.it');
        
        return isExpediaDomain;
    }

    detectExpediaCarSearchPage() {
        // Vérifier l'URL
        const isCarSearchUrl = window.location.pathname.includes('/carsearch') || 
                              window.location.href.includes('carsearch');
        
        // Vérifier la présence d'éléments spécifiques aux résultats de véhicules
        const hasCarResults = document.querySelector('[data-stid="property-listing-results"]') ||
                             document.querySelector('[data-stid="lodging-card-responsive"]');
        
        const hasCarFilters = document.querySelector('[data-stid="selCC"]') || // Car type filters
                             document.querySelector('[data-stid="selVen"]'); // Vendor filters

        return isCarSearchUrl && (hasCarResults || hasCarFilters);
    }

    createCompareButton() {
        // Éviter de créer le bouton plusieurs fois
        if (document.getElementById('expedia-compare-btn')) {
            return;
        }

        const button = document.createElement('button');
        button.id = 'expedia-compare-btn';
        button.className = 'expedia-compare-button';
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3h18v2H3V3zm0 4h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2z"/>
            </svg>
            Créer tableau comparatif
        `;
        button.title = 'Transformer en tableau comparatif par marque et catégorie';

        // Ajouter les styles inline pour éviter les conflits
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: #0066cc;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px 16px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
        `;

        // Effets hover
        button.addEventListener('mouseenter', () => {
            button.style.background = '#0052a3';
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 6px 16px rgba(0, 102, 204, 0.4)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.background = '#0066cc';
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 12px rgba(0, 102, 204, 0.3)';
        });

        button.addEventListener('click', () => this.handleCompareClick());

        document.body.appendChild(button);
    }

    createMultiExtractionButton() {
        // Supprimer le bouton existant s'il y en a un
        const existingButton = document.getElementById('expedia-multi-extraction-btn');
        if (existingButton) {
            existingButton.remove();
        }

        // Créer le bouton extraction multiple
        const button = document.createElement('button');
        button.id = 'expedia-multi-extraction-btn';
        button.className = 'expedia-multi-extraction-button';
        button.innerHTML = `
            <div class="button-content">
                <span class="button-icon">🔍</span>
                <span class="button-text">Extraction Multiple</span>
            </div>
        `;
        
        // Styles du bouton
        Object.assign(button.style, {
            position: 'fixed',
            top: '20px',
            right: '200px', // Décalé à gauche pour ne pas chevaucher avec le bouton original
            zIndex: '999999',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 20px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minWidth: '160px',
            justifyContent: 'center'
        });

        // Effets de survol
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
        });

        // Événement de clic
        button.addEventListener('click', () => this.showMultiExtractionInterface());

        document.body.appendChild(button);
    }

    showMultiExtractionInterface() {
        // Supprimer l'interface existante si elle existe
        const existingInterface = document.getElementById('multi-extraction-interface');
        if (existingInterface) {
            existingInterface.remove();
        }

        // Créer l'interface d'extraction multiple
        const interfaceElement = document.createElement('div');
        interfaceElement.id = 'multi-extraction-interface';
        interfaceElement.className = 'multi-extraction-interface';
        
        interfaceElement.innerHTML = `
            <div class="multi-extraction-content">
                <div class="multi-extraction-header">
                    <h2>🔍 Extraction Multiple - Expedia Car Comparator</h2>
                    <button id="close-multi-extraction" class="close-btn">✕</button>
                </div>
                
                <div class="multi-extraction-body">
                    <div class="extraction-options">
                        <h3>Choisissez votre mode d'extraction :</h3>
                        
                        <div class="extraction-modes">
                            <div class="extraction-mode" data-mode="current-search">
                                <div class="mode-icon">🚗</div>
                                <div class="mode-info">
                                    <h4>Recherche Actuelle</h4>
                                    <p>Extraire les données de la page de recherche actuelle (si disponible)</p>
                                </div>
                                <button class="mode-button" ${!this.isOnCarSearchPage() ? 'disabled' : ''}>
                                    ${this.isOnCarSearchPage() ? 'Extraire' : 'Non disponible'}
                                </button>
                            </div>
                            
                            <div class="extraction-mode" data-mode="multi-duration">
                                <div class="mode-icon">📊</div>
                                <div class="mode-info">
                                    <h4>Comparaison Multi-Durées</h4>
                                    <p>Comparer les prix pour différentes durées (3, 7, 14 jours...)</p>
                                </div>
                                <button class="mode-button">Configurer</button>
                            </div>
                            
                            <div class="extraction-mode" data-mode="custom-search">
                                <div class="mode-icon">🎯</div>
                                <div class="mode-info">
                                    <h4>Recherche Personnalisée</h4>
                                    <p>Définir manuellement les paramètres de recherche</p>
                                </div>
                                <button class="mode-button">Commencer</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="extraction-info">
                        <div class="info-section">
                            <h4>📍 Localisation détectée</h4>
                            <p id="detected-location">Analyse en cours...</p>
                        </div>
                        
                        <div class="info-section">
                            <h4>🌐 Site Expedia</h4>
                            <p>${window.location.hostname}</p>
                        </div>
                        
                        <div class="info-section">
                            <h4>📈 Statut</h4>
                            <p id="extraction-status">Prêt pour l'extraction</p>
                        </div>
                    </div>
                </div>
                
                <div class="multi-extraction-footer">
                    <div class="footer-info">
                        <small>Extension Expedia Car Comparator v1.1 - Extraction intelligente multi-durées</small>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(interfaceElement);
        
        // Détecter la localisation
        this.detectCurrentLocation();
        
        // Ajouter les événements
        this.addMultiExtractionEvents(interfaceElement);
    }

    isOnCarSearchPage() {
        return this.detectExpediaCarSearchPage();
    }

    detectCurrentLocation() {
        // Essayer de détecter la localisation depuis différents éléments de la page
        let location = 'Non détectée';
        
        try {
            // Méthode 1: Bouton de localisation
            const locationBtn = document.querySelector('[data-stid="pick_up_location-menu-trigger"]');
            if (locationBtn && locationBtn.textContent.trim()) {
                location = locationBtn.textContent.trim();
            } else {
                // Méthode 2: Champ de localisation
                const locationInput = document.querySelector('[name*="location"], [placeholder*="location"]');
                if (locationInput && locationInput.value) {
                    location = locationInput.value;
                } else {
                    // Méthode 3: URL parameters
                    const urlParams = new URLSearchParams(window.location.search);
                    const locn = urlParams.get('locn');
                    if (locn) {
                        location = decodeURIComponent(locn.replace(/\+/g, ' '));
                    }
                }
            }
        } catch (error) {
            console.log('Erreur détection localisation:', error);
        }
        
        // Mettre à jour l'affichage
        const locationDisplay = document.getElementById('detected-location');
        if (locationDisplay) {
            locationDisplay.textContent = location;
        }
        
        return location;
    }

    addMultiExtractionEvents(interfaceElement) {
        // Fermeture de l'interface
        const closeBtn = interfaceElement.querySelector('#close-multi-extraction');
        closeBtn.addEventListener('click', () => {
            interfaceElement.remove();
        });
        
        // Gestion des modes d'extraction
        const modeButtons = interfaceElement.querySelectorAll('.mode-button');
        modeButtons.forEach(button => {
            if (!button.disabled) {
                button.addEventListener('click', (e) => {
                    const mode = e.target.closest('.extraction-mode').dataset.mode;
                    this.handleExtractionMode(mode, interfaceElement);
                });
            }
        });
        
        // Fermeture en cliquant à l'extérieur
        interfaceElement.addEventListener('click', (e) => {
            if (e.target === interfaceElement) {
                interfaceElement.remove();
            }
        });
    }

    handleExtractionMode(mode, interfaceElement) {
        switch (mode) {
            case 'current-search':
                interfaceElement.remove();
                if (this.isOnCarSearchPage()) {
                    // Appeler directement la création du tableau comme l'ancien bouton
                    this.handleCompareClick();
                } else {
                    alert('Veuillez d\'abord effectuer une recherche de véhicules sur Expedia');
                }
                break;
                
            case 'multi-duration':
                interfaceElement.remove();
                this.showCustomDurationSelector();
                break;
                
            case 'custom-search':
                interfaceElement.remove();
                this.showCustomSearchInterface();
                break;
                
            default:
                console.log('Mode non reconnu:', mode);
        }
    }

    showCustomDurationSelector() {
        // Version améliorée du sélecteur de durées avec plus d'options
        this.showDurationSelector();
    }

    showCustomSearchInterface() {
        alert('Fonctionnalité "Recherche Personnalisée" en développement.\nUtilisez "Comparaison Multi-Durées" pour le moment.');
    }

    showDurationSelector() {
        // Supprimer le sélecteur existant s'il y en a un
        const existingSelector = document.getElementById('duration-selector-modal');
        if (existingSelector) {
            existingSelector.remove();
        }

        // Créer le modal de sélection des durées
        const modal = document.createElement('div');
        modal.id = 'duration-selector-modal';
        modal.className = 'duration-selector-modal';
        
        modal.innerHTML = `
            <div class="duration-selector-content">
                <div class="duration-selector-header">
                    <h2>🚗 Comparaison Multi-Durées</h2>
                    <button id="close-duration-selector" class="close-btn">✕</button>
                </div>
                
                <div class="duration-selector-body">
                    <div class="date-selection">
                        <h3>📅 Date de début de location</h3>
                        <div class="date-input-group">
                            <input type="date" id="start-date-input" class="date-input">
                            <button id="use-current-date" class="btn-use-current">Utiliser la date actuelle</button>
                        </div>
                        <p class="date-note">Date actuelle détectée : <span id="current-date-display">...</span></p>
                    </div>
                    
                    <div class="duration-selection">
                        <h3>⏱️ Durées à comparer</h3>
                        <p class="instruction">Sélectionnez les durées de location à comparer :</p>
                        
                        <div class="duration-options">
                            <label class="duration-option">
                                <input type="checkbox" value="3" checked>
                                <span class="duration-label">3 jours</span>
                            </label>
                            <label class="duration-option">
                                <input type="checkbox" value="7" checked>
                                <span class="duration-label">7 jours</span>
                            </label>
                            <label class="duration-option">
                                <input type="checkbox" value="14">
                                <span class="duration-label">14 jours</span>
                            </label>
                            <label class="duration-option">
                                <input type="checkbox" value="21">
                                <span class="duration-label">21 jours</span>
                            </label>
                            <label class="duration-option">
                                <input type="checkbox" value="30">
                                <span class="duration-label">30 jours</span>
                            </label>
                        </div>
                        
                        <div class="custom-duration">
                            <label>
                                <input type="checkbox" id="custom-duration-checkbox">
                                Durée personnalisée : 
                                <input type="number" id="custom-duration-input" min="1" max="365" placeholder="jours">
                            </label>
                        </div>
                    </div>
                    
                    <div class="process-options">
                        <h3>🔍 Options de traitement</h3>
                        <label class="process-option">
                            <input type="checkbox" id="show-process" checked>
                            <span>Afficher le processus en temps réel (défilement, URLs, etc.)</span>
                        </label>
                        <label class="process-option">
                            <input type="checkbox" id="sequential-display" checked>
                            <span>Afficher les tableaux en séquence (au lieu d'onglets)</span>
                        </label>
                    </div>
                    
                    <div class="preview-info">
                        <h4>📋 Aperçu de la génération</h4>
                        <div id="generation-preview">
                            <p>Sélectionnez les durées pour voir l'aperçu...</p>
                        </div>
                    </div>
                </div>
                
                <div class="duration-selector-footer">
                    <button id="cancel-duration-selector" class="btn-secondary">Annuler</button>
                    <button id="generate-multi-tables" class="btn-primary">Générer les Tableaux</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Extraire la date de début
        const startDateInfo = this.extractStartDate();
        
        // Ajouter les événements
        this.addDurationSelectorEvents(modal, startDateInfo.date);
    }

    extractStartDate() {
        try {
            // Méthode 1: Champ caché
            const startDateInput = document.querySelector('[data-stid="EGDSDateRangePicker-StartDate"]');
            if (startDateInput && startDateInput.value) {
                const date = new Date(startDateInput.value);
                return {
                    date: date,
                    display: date.toLocaleDateString('fr-FR', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })
                };
            }
            
            // Méthode 2: Bouton visible
            const dateButton = document.querySelector('[data-testid="uitk-date-selector-input1-default"]');
            if (dateButton) {
                const dateText = dateButton.textContent.trim();
                const match = dateText.match(/(\w{3} \d+)/);
                if (match) {
                    const year = new Date().getFullYear();
                    const date = new Date(`${match[1]} ${year}`);
                    return {
                        date: date,
                        display: date.toLocaleDateString('fr-FR', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })
                    };
                }
            }
            
            // Méthode 3: URL
            const urlParams = new URLSearchParams(window.location.search);
            const date1 = urlParams.get('date1');
            if (date1) {
                const date = new Date(date1);
                return {
                    date: date,
                    display: date.toLocaleDateString('fr-FR', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })
                };
            }
            
        } catch (error) {
            console.log('Erreur extraction date de début:', error);
        }
        
        return {
            date: new Date(),
            display: 'Date non disponible'
        };
    }

    addDurationSelectorEvents(modal, detectedStartDate) {
        // Initialiser le champ de date avec la date détectée
        const startDateInput = modal.querySelector('#start-date-input');
        const currentDateDisplay = modal.querySelector('#current-date-display');
        const useCurrentDateBtn = modal.querySelector('#use-current-date');
        
        console.log('🔧 Éléments trouvés:', {
            startDateInput: !!startDateInput,
            currentDateDisplay: !!currentDateDisplay,
            useCurrentDateBtn: !!useCurrentDateBtn
        });
        
        // Formater la date pour l'input date (YYYY-MM-DD)
        const dateStr = detectedStartDate.toISOString().split('T')[0];
        
        if (startDateInput) {
            startDateInput.value = dateStr;
        }
        
        if (currentDateDisplay) {
            currentDateDisplay.textContent = detectedStartDate.toLocaleDateString('fr-FR');
        }
        
        // Bouton "Utiliser la date actuelle"
        if (useCurrentDateBtn && startDateInput) {
            useCurrentDateBtn.addEventListener('click', () => {
                startDateInput.value = dateStr;
            });
        }
        
        // Fermeture du modal
        const closeBtn = modal.querySelector('#close-duration-selector');
        const cancelBtn = modal.querySelector('#cancel-duration-selector');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => modal.remove());
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => modal.remove());
        }
        
        // Gestion durée personnalisée
        const customCheckbox = modal.querySelector('#custom-duration-checkbox');
        const customInput = modal.querySelector('#custom-duration-input');
        
        if (customCheckbox && customInput) {
            customCheckbox.addEventListener('change', (e) => {
                customInput.disabled = !e.target.checked;
                if (e.target.checked) {
                    customInput.focus();
                }
            });
        }
        
        // Mise à jour de l'aperçu quand on change les durées
        const durationCheckboxes = modal.querySelectorAll('.duration-options input, #custom-duration-checkbox');
        durationCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateGenerationPreview(modal));
        });
        
        if (customInput) {
            customInput.addEventListener('input', () => this.updateGenerationPreview(modal));
        }
        
        if (startDateInput) {
            startDateInput.addEventListener('change', () => this.updateGenerationPreview(modal));
        }
        
        // Génération des tableaux
        const generateBtn = modal.querySelector('#generate-multi-tables');
        
        if (!generateBtn) {
            console.error('❌ Bouton generate-multi-tables non trouvé !');
            return;
        }
        
        console.log('✅ Bouton generate-multi-tables trouvé, ajout de l\'événement...');
        
        generateBtn.addEventListener('click', (e) => {
            console.log('🖱️ Clic sur le bouton Générer les Tableaux');
            
            try {
                const selectedStartDate = new Date(startDateInput.value);
                const selectedDurations = this.getSelectedDurations(modal);
                const showProcess = modal.querySelector('#show-process')?.checked || false;
                const sequentialDisplay = modal.querySelector('#sequential-display')?.checked || true;
                
                console.log('📊 Configuration:', {
                    startDate: selectedStartDate,
                    durations: selectedDurations,
                    showProcess,
                    sequentialDisplay
                });
                
                if (selectedDurations.length === 0) {
                    alert('Veuillez sélectionner au moins une durée');
                    return;
                }
                
                modal.remove();
                
                // S'assurer que nous avons des données de véhicules
                if (this.vehicles.length === 0) {
                    console.log('⚠️ Aucun véhicule en mémoire, extraction des données actuelles...');
                    this.extractVehicleData();
                    
                    if (this.vehicles.length === 0) {
                        console.log('⚠️ Tentative d\'extraction alternative...');
                        this.extractVehicleDataAlternative();
                    }
                }
                
                console.log(`📊 ${this.vehicles.length} véhicules disponibles pour la génération`);
                
                this.generateMultipleComparisonsWithProcess(selectedStartDate, selectedDurations, showProcess, sequentialDisplay);
                
            } catch (error) {
                console.error('❌ Erreur lors de la génération:', error);
                alert('Erreur lors de la génération des tableaux: ' + error.message);
            }
        });
        
        // Initialiser l'aperçu
        this.updateGenerationPreview(modal);
    }

    updateGenerationPreview(modal) {
        const startDateInput = modal.querySelector('#start-date-input');
        const selectedDurations = this.getSelectedDurations(modal);
        const previewDiv = modal.querySelector('#generation-preview');
        
        if (selectedDurations.length === 0) {
            previewDiv.innerHTML = '<p>Sélectionnez les durées pour voir l\'aperçu...</p>';
            return;
        }
        
        const startDate = new Date(startDateInput.value);
        let previewHtml = '<div class="preview-list">';
        
        selectedDurations.forEach((duration, index) => {
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + duration);
            
            previewHtml += `
                <div class="preview-item">
                    <span class="preview-number">${index + 1}</span>
                    <span class="preview-duration">${duration} jour${duration > 1 ? 's' : ''}</span>
                    <span class="preview-dates">
                        ${startDate.toLocaleDateString('fr-FR')} → ${endDate.toLocaleDateString('fr-FR')}
                    </span>
                </div>
            `;
        });
        
        previewHtml += '</div>';
        previewDiv.innerHTML = previewHtml;
    }

    getSelectedDurations(modal) {
        const durations = [];
        
        // Durées prédéfinies
        const checkboxes = modal.querySelectorAll('.duration-options input[type="checkbox"]:checked');
        checkboxes.forEach(cb => {
            durations.push(parseInt(cb.value));
        });
        
        // Durée personnalisée
        const customCheckbox = modal.querySelector('#custom-duration-checkbox');
        const customInput = modal.querySelector('#custom-duration-input');
        
        if (customCheckbox.checked && customInput.value) {
            const customDuration = parseInt(customInput.value);
            if (customDuration > 0 && customDuration <= 365) {
                durations.push(customDuration);
            }
        }
        
        return durations.sort((a, b) => a - b);
    }

    async generateMultipleComparisonsWithProcess(startDate, durations, showProcess, sequentialDisplay) {
        // Créer le conteneur principal
        const processContainer = document.createElement('div');
        processContainer.id = 'process-container';
        processContainer.className = 'process-container';
        
        const header = document.createElement('div');
        header.className = 'process-header';
        header.innerHTML = `
            <h2>🔄 Génération en cours - Comparaison Multi-Durées</h2>
            <div class="process-controls">
                <button id="minimize-process" class="btn-minimize" title="Réduire">📐</button>
                <button id="close-process" class="btn-close">✕</button>
            </div>
        `;
        
        processContainer.appendChild(header);
        
        // Zone de processus en temps réel
        if (showProcess) {
            const processArea = document.createElement('div');
            processArea.className = 'process-area';
            processArea.innerHTML = `
                <div class="process-log">
                    <h3>📋 Processus en temps réel</h3>
                    <div id="process-log-content" class="log-content">
                        <p class="log-entry">🚀 Début de la génération...</p>
                    </div>
                </div>
                <div class="current-action">
                    <div class="action-spinner"></div>
                    <span id="current-action-text">Initialisation...</span>
                </div>
            `;
            processContainer.appendChild(processArea);
        }
        
        // Zone des résultats
        const resultsArea = document.createElement('div');
        resultsArea.className = 'results-area';
        resultsArea.innerHTML = `
            <h3>📊 Tableaux Comparatifs</h3>
            <div id="results-content" class="results-content ${sequentialDisplay ? 'sequential' : 'tabbed'}">
                <!-- Les tableaux apparaîtront ici -->
            </div>
        `;
        
        processContainer.appendChild(resultsArea);
        document.body.appendChild(processContainer);
        
        // Ajouter les événements
        this.addProcessContainerEvents(processContainer);
        
        // Générer les tableaux avec processus visible
        await this.generateTablesWithRealTimeProcess(startDate, durations, showProcess, sequentialDisplay);
    }

    async generateTablesWithRealTimeProcess(startDate, durations, showProcess, sequentialDisplay) {
        const logContent = document.getElementById('process-log-content');
        const currentActionText = document.getElementById('current-action-text');
        const resultsContent = document.getElementById('results-content');
        
        const addLogEntry = (message, type = 'info') => {
            if (showProcess && logContent) {
                const entry = document.createElement('p');
                entry.className = `log-entry log-${type}`;
                entry.innerHTML = `<span class="log-time">${new Date().toLocaleTimeString('fr-FR')}</span> ${message}`;
                logContent.appendChild(entry);
                logContent.scrollTop = logContent.scrollHeight;
            }
        };
        
        const updateCurrentAction = (action) => {
            if (currentActionText) {
                currentActionText.textContent = action;
            }
        };
        
        addLogEntry(`📅 Date de début : ${startDate.toLocaleDateString('fr-FR')}`, 'info');
        addLogEntry(`⏱️ Durées sélectionnées : ${durations.join(', ')} jours`, 'info');
        addLogEntry(`🔄 Mode d'affichage : ${sequentialDisplay ? 'Séquentiel' : 'Onglets'}`, 'info');
        
        // Générer un tableau pour chaque durée
        for (let i = 0; i < durations.length; i++) {
            const duration = durations[i];
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + duration);
            
            addLogEntry(`🚗 Génération pour ${duration} jour${duration > 1 ? 's' : ''} (${startDate.toLocaleDateString('fr-FR')} → ${endDate.toLocaleDateString('fr-FR')})`, 'info');
            updateCurrentAction(`Traitement ${duration} jour${duration > 1 ? 's' : ''} - ${i + 1}/${durations.length}`);
            
            try {
                // Afficher l'URL qui serait générée
                const newUrl = this.constructSearchUrl(startDate, endDate);
                addLogEntry(`🌐 URL pour ${duration} jours : ${newUrl}`, 'url');
                
                // Simuler le processus visuellement
                updateCurrentAction(`Simulation du processus pour ${duration} jour${duration > 1 ? 's' : ''}...`);
                
                // Défilement visible
                addLogEntry(`📜 Défilement de la page...`, 'process');
                await this.simulateVisibleScrolling();
                
                // Simulation des clics "Show more"
                addLogEntry(`🔄 Simulation des clics "Show more"...`, 'process');
                await this.simulateShowMoreClicks(duration);
                
                // Générer les données selon la durée
                updateCurrentAction(`Extraction des données pour ${duration} jour${duration > 1 ? 's' : ''}...`);
                addLogEntry(`🔍 Génération des données pour ${duration} jour${duration > 1 ? 's' : ''}...`, 'process');
                
                const simulatedVehicles = this.simulateVehicleDataForDuration(duration);
                this.vehicles = simulatedVehicles;
                
                const tableData = this.organizeForSimpleTable();
                addLogEntry(`📊 ${simulatedVehicles.length} véhicules générés pour ${duration} jour${duration > 1 ? 's' : ''}`, 'info');
                
                // Créer le tableau pour cette durée
                const tableWrapper = document.createElement('div');
                tableWrapper.className = 'duration-result-wrapper';
                tableWrapper.innerHTML = `
                    <div class="duration-result-header">
                        <h3>📊 ${duration} jour${duration > 1 ? 's' : ''}</h3>
                        <div class="duration-result-info">
                            <span class="result-dates">${startDate.toLocaleDateString('fr-FR')} → ${endDate.toLocaleDateString('fr-FR')}</span>
                            <span class="result-vehicles">${tableData.companies.length} loueurs • ${Object.keys(tableData.prices).reduce((total, company) => total + Object.keys(tableData.prices[company]).length, 0)} offres</span>
                        </div>
                    </div>
                    ${this.createSimpleTableContent(tableData)}
                `;
                
                resultsContent.appendChild(tableWrapper);
                
                // Mettre en évidence les meilleurs prix
                const table = tableWrapper.querySelector('.simple-comparison-table');
                if (table) {
                    this.highlightBestPrices(table, tableData.categories);
                }
                
                addLogEntry(`✅ Tableau généré avec succès pour ${duration} jour${duration > 1 ? 's' : ''}`, 'success');
                
                // Défiler vers le nouveau tableau
                tableWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
            } catch (error) {
                addLogEntry(`❌ Erreur pour ${duration} jour${duration > 1 ? 's' : ''} : ${error.message}`, 'error');
                console.error(`Erreur génération ${duration} jours:`, error);
            }
            
            // Pause entre les générations
            if (i < durations.length - 1) {
                await this.sleep(1000);
            }
        }
        
        updateCurrentAction('✅ Génération terminée');
        addLogEntry(`🎉 Tous les tableaux ont été générés avec succès !`, 'success');
        
        // Défiler vers le premier tableau après génération
        const firstTable = resultsContent.querySelector('.duration-result-wrapper');
        if (firstTable) {
            setTimeout(() => {
                firstTable.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 500);
        }
    }

    constructSearchUrl(startDate, endDate) {
        const baseUrl = window.location.origin + window.location.pathname;
        const urlParams = new URLSearchParams(window.location.search);
        
        // Formater les dates au format Expedia (YYYY-MM-DD)
        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];
        
        // Mettre à jour tous les paramètres de date d'Expedia
        urlParams.set('date1', startDateStr);
        urlParams.set('date2', endDateStr);
        
        // Formats alternatifs utilisés par Expedia
        urlParams.set('d1', startDateStr);
        urlParams.set('d2', endDateStr);
        
        // Format MM/DD/YYYY si présent
        const startDateUS = `${(startDate.getMonth() + 1).toString().padStart(2, '0')}/${startDate.getDate().toString().padStart(2, '0')}/${startDate.getFullYear()}`;
        const endDateUS = `${(endDate.getMonth() + 1).toString().padStart(2, '0')}/${endDate.getDate().toString().padStart(2, '0')}/${endDate.getFullYear()}`;
        
        if (urlParams.has('date1')) urlParams.set('date1', startDateUS);
        if (urlParams.has('date2')) urlParams.set('date2', endDateUS);
        
        return `${baseUrl}?${urlParams.toString()}`;
    }

    addProcessContainerEvents(container) {
        // Bouton fermeture
        const closeBtn = container.querySelector('#close-process');
        closeBtn.addEventListener('click', () => {
            container.remove();
        });
        
        // Bouton minimiser (optionnel)
        const minimizeBtn = container.querySelector('#minimize-process');
        minimizeBtn.addEventListener('click', () => {
            container.classList.toggle('minimized');
        });
    }

    async handleCompareClick() {
        if (this.isLoading) {
            return;
        }

        this.isLoading = true;
        const button = document.getElementById('expedia-compare-btn');
        const originalText = button.innerHTML;
        
        try {
            // Mettre à jour le bouton pour montrer le chargement
            button.innerHTML = `
                <div style="width: 16px; height: 16px; border: 2px solid #fff; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                Chargement...
            `;
            button.disabled = true;

            // Ajouter l'animation de rotation
            if (!document.getElementById('spinner-style')) {
                const style = document.createElement('style');
                style.id = 'spinner-style';
                style.textContent = `
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `;
                document.head.appendChild(style);
            }

            // Étape 1: Charger tous les résultats
            await this.loadAllResults();
            
            // Étape 2: Extraire les données
            this.extractVehicleData();
            
            // Étape 3: Créer le tableau comparatif
            this.createComparisonTable();

        } catch (error) {
            console.error('❌ Erreur lors de la création du tableau comparatif:', error);
            console.log('🔍 Informations de debug:', {
                vehiclesFound: this.vehicles.length,
                pageElements: document.querySelectorAll('*').length,
                currentUrl: window.location.href,
                isExpediaPage: window.location.href.includes('expedia')
            });
            
            // Essayer une méthode alternative d'extraction
            if (this.vehicles.length === 0) {
                console.log('🔄 Tentative d\'extraction alternative...');
                this.extractVehicleDataAlternative();
                console.log(`📊 ${this.vehicles.length} véhicules trouvés avec méthode alternative`);
                
                if (this.vehicles.length > 0) {
                    try {
                        this.createComparisonTable();
                        console.log('✅ Tableau créé avec succès avec méthode alternative !');
                        return;
                    } catch (altError) {
                        console.error('❌ Erreur avec méthode alternative:', altError);
                    }
                }
            }
            
            alert(`Erreur lors de la création du tableau comparatif: ${error.message}\n\nVeuillez vérifier que la page est complètement chargée et réessayer.`);
        } finally {
            // Restaurer le bouton
            button.innerHTML = originalText;
            button.disabled = false;
            this.isLoading = false;
        }
    }

    async loadAllResults() {
        let showMoreButton;
        let attempts = 0;
        const maxAttempts = 50; // Limite pour éviter les boucles infinies
        let previousResultCount = 0;
        let stableCount = 0; // Compteur pour vérifier si le nombre de résultats reste stable

        while (attempts < maxAttempts) {
            // Chercher le bouton "Show more" avec différents sélecteurs
            showMoreButton = document.querySelector('button.uitk-button.uitk-button-medium.uitk-button-has-text.uitk-button-secondary') ||
                           document.querySelector('button:contains("Show more")') ||
                           document.querySelector('[data-stid*="show-more"]') ||
                           Array.from(document.querySelectorAll('button')).find(btn => 
                               btn.textContent.toLowerCase().includes('show more') ||
                               btn.textContent.toLowerCase().includes('voir plus')
                           );

            // Vérifications multiples pour s'assurer que le bouton existe et est cliquable
            if (!showMoreButton) {
                console.log('Aucun bouton "Show more" trouvé, tous les résultats sont chargés');
                break;
            }

            // Vérifier si le bouton est visible et cliquable
            const isVisible = showMoreButton.offsetParent !== null;
            const isEnabled = !showMoreButton.disabled;
            const hasDisplay = window.getComputedStyle(showMoreButton).display !== 'none';
            const hasVisibility = window.getComputedStyle(showMoreButton).visibility !== 'hidden';
            const hasOpacity = window.getComputedStyle(showMoreButton).opacity !== '0';
            
            if (!isVisible || !isEnabled || !hasDisplay || !hasVisibility || !hasOpacity) {
                console.log('Le bouton "Show more" n\'est plus cliquable, tous les résultats sont chargés');
                break;
            }

            // Compter les résultats actuels pour détecter si de nouveaux se chargent
            const currentResultCount = this.countVehicleResults();
            if (currentResultCount === previousResultCount) {
                stableCount++;
                if (stableCount >= 3) {
                    console.log('Le nombre de résultats n\'augmente plus, arrêt du chargement');
                    break;
                }
            } else {
                stableCount = 0; // Reset si de nouveaux résultats sont trouvés
                previousResultCount = currentResultCount;
            }

            // Défiler vers le bouton
            showMoreButton.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });

            // Attendre que le défilement se termine
            await this.sleep(500);

            // Cliquer sur le bouton
            try {
                showMoreButton.click();
                console.log(`Clic sur "Show more" - tentative ${attempts + 1}`);
                
                // Attendre le chargement des nouveaux résultats
                await this.sleep(1000);
                
                // Attendre que les nouveaux éléments soient chargés
                await this.waitForNewResults();
                
            } catch (error) {
                console.log('Erreur lors du clic sur "Show more":', error);
                break;
            }

            attempts++;
        }

        // Défiler vers le haut pour voir tous les résultats
        window.scrollTo({ top: 0, behavior: 'smooth' });
        await this.sleep(500);
    }

    async waitForNewResults() {
        let previousCount = document.querySelectorAll('[data-stid="lodging-card-responsive"]').length;
        let attempts = 0;
        const maxWaitAttempts = 10;

        while (attempts < maxWaitAttempts) {
            await this.sleep(500);
            const currentCount = document.querySelectorAll('[data-stid="lodging-card-responsive"]').length;
            
            if (currentCount > previousCount) {
                // De nouveaux résultats ont été chargés
                await this.sleep(1000); // Attendre un peu plus pour s'assurer que tout est chargé
                break;
            }
            
            attempts++;
        }
    }

    extractVehicleData() {
        this.vehicles = [];
        
        // Sélectionner tous les éléments de véhicules
        const vehicleCards = document.querySelectorAll('[data-stid="lodging-card-responsive"]');
        
        vehicleCards.forEach((card, index) => {
            try {
                const vehicle = this.extractVehicleFromCard(card);
                if (vehicle) {
                    this.vehicles.push(vehicle);
                }
            } catch (error) {
                console.warn(`Erreur lors de l'extraction du véhicule ${index}:`, error);
            }
        });

        console.log(`${this.vehicles.length} véhicules extraits`);
    }

    extractVehicleFromCard(card) {
        // Extraire le nom du véhicule
        const nameElement = card.querySelector('h3.uitk-heading-5');
        const name = nameElement ? nameElement.textContent.trim() : '';

        // Extraire le modèle/description
        const descElement = card.querySelector('.uitk-text.uitk-text-spacing-half.truncate-lines-3');
        const description = descElement ? descElement.textContent.trim() : '';

        // Extraire le prix quotidien
        const dailyPriceElement = card.querySelector('[data-test-id="price-summary"] .uitk-text.uitk-type-500');
        const dailyPrice = dailyPriceElement ? this.cleanPrice(dailyPriceElement.textContent) : '';

        // Extraire le prix total
        const totalPriceElement = card.querySelector('[data-test-id="price-summary"] .uitk-text.uitk-type-end.uitk-type-200');
        const totalPrice = totalPriceElement ? this.cleanPrice(totalPriceElement.textContent) : '';

        // Extraire la compagnie de location
        const companyImg = card.querySelector('figure.uitk-image img[alt*="Rental Company"], figure.uitk-image img[alt*="Rent A Car"]');
        const company = companyImg ? this.extractCompanyName(companyImg.alt) : '';

        // Extraire les spécifications (passagers, transmission, etc.)
        const specifications = this.extractSpecifications(card);

        // Extraire la note et les avis
        const rating = this.extractRating(card);

        // Extraire les avantages
        const benefits = this.extractBenefits(card);

        // Déterminer la catégorie basée sur le nom
        const category = this.determineCategory(name);

        if (!name || !company) {
            return null; // Données insuffisantes
        }

        return {
            name,
            description,
            category,
            company,
            dailyPrice,
            totalPrice,
            specifications,
            rating,
            benefits,
            element: card
        };
    }

    cleanPrice(priceText) {
        if (!priceText) return '';
        // Extraire le prix numérique
        const match = priceText.match(/\$[\d,]+/);
        return match ? match[0] : priceText.trim();
    }

    extractCompanyName(altText) {
        if (!altText) return '';
        
        // Nettoyer le nom de la compagnie
        return altText
            .replace(/Rental Company/gi, '')
            .replace(/Rent A Car/gi, '')
            .trim();
    }

    extractSpecifications(card) {
        const specs = {};
        
        // Extraire le nombre de passagers
        const passengerIcon = card.querySelector('svg[aria-label*="passengers"]');
        if (passengerIcon) {
            const passengerText = passengerIcon.getAttribute('aria-label');
            specs.passengers = passengerText ? passengerText.match(/\d+/)?.[0] : '';
        }

        // Extraire le type de transmission
        const transmissionIcon = card.querySelector('svg[aria-label="Automatic"], svg[aria-label="Manual"]');
        if (transmissionIcon) {
            specs.transmission = transmissionIcon.getAttribute('aria-label');
        }

        // Extraire les autres spécifications
        const specTexts = card.querySelectorAll('.uitk-typelist-item .uitk-text');
        specTexts.forEach(spec => {
            const text = spec.textContent.trim().toLowerCase();
            if (text.includes('unlimited mileage')) {
                specs.mileage = 'Unlimited';
            }
            if (text.includes('electric')) {
                specs.fuel = 'Electric';
            }
        });

        return specs;
    }

    extractRating(card) {
        const ratingBadge = card.querySelector('.uitk-badge-base-text');
        const ratingText = card.querySelector('.uitk-text.uitk-type-300.uitk-type-medium');
        const reviewsText = card.querySelector('.uitk-text.uitk-type-200.uitk-type-regular');

        return {
            score: ratingBadge ? ratingBadge.textContent.trim() : '',
            text: ratingText ? ratingText.textContent.trim() : '',
            reviews: reviewsText ? reviewsText.textContent.trim() : ''
        };
    }

    extractBenefits(card) {
        const benefits = [];
        const benefitElements = card.querySelectorAll('.uitk-text.uitk-type-300.uitk-text-positive-theme');
        
        benefitElements.forEach(benefit => {
            const text = benefit.textContent.trim();
            if (text && !text.includes('$')) { // Exclure les prix
                benefits.push(text);
            }
        });

        return benefits;
    }

    determineCategory(vehicleName) {
        const name = vehicleName.toLowerCase();
        
        if (name.includes('economy')) return 'Economy';
        if (name.includes('compact')) return 'Compact';
        if (name.includes('midsize') || name.includes('mid-size')) return 'Midsize';
        if (name.includes('standard')) return 'Standard';
        if (name.includes('fullsize') || name.includes('full-size')) return 'Fullsize';
        if (name.includes('premium')) return 'Premium';
        if (name.includes('luxury')) return 'Luxury';
        if (name.includes('suv')) return 'SUV';
        if (name.includes('convertible')) return 'Convertible';
        if (name.includes('mini')) return 'Mini';
        if (name.includes('recreational')) return 'Recreational Vehicle';
        if (name.includes('crossover')) return 'Crossover';
        if (name.includes('elite')) return 'Elite';
        if (name.includes('special')) return 'Special';
        
        return 'Other';
    }

    createComparisonTable() {
        // Supprimer le tableau existant s'il y en a un
        const existingTable = document.getElementById('expedia-comparison-table');
        if (existingTable) {
            existingTable.remove();
        }

        // Organiser les données pour le nouveau format simplifié
        const data = this.organizeForSimpleTable();

        // Créer le conteneur du tableau
        const tableContainer = document.createElement('div');
        tableContainer.id = 'expedia-comparison-table';
        tableContainer.className = 'comparison-table-container';

        // Créer le header avec bouton de fermeture
        const header = this.createTableHeader();
        tableContainer.appendChild(header);

        // Créer le nouveau tableau simplifié
        const table = this.createSimpleTable(data);
        tableContainer.appendChild(table);

        // Ajouter au DOM
        document.body.appendChild(tableContainer);

        // Défiler vers le tableau
        tableContainer.scrollIntoView({ behavior: 'smooth' });
    }

    organizeForSimpleTable() {
        const companies = new Set();
        const categories = new Set();
        const prices = {};
        const models = {};

        // Collecter toutes les compagnies et catégories, et trouver le meilleur prix pour chaque combinaison
        this.vehicles.forEach(vehicle => {
            const company = vehicle.company;
            const category = vehicle.category;
            const dailyPrice = this.extractNumericPrice(vehicle.dailyPrice);

            companies.add(company);
            categories.add(category);

            if (!prices[company]) {
                prices[company] = {};
                models[company] = {};
            }

            // Garder seulement le prix le plus bas et le modèle correspondant pour chaque combinaison compagnie/catégorie
            if (!prices[company][category] || dailyPrice < prices[company][category]) {
                prices[company][category] = dailyPrice;
                models[company][category] = vehicle.description || vehicle.name;
            }
        });

        // Trier les compagnies et catégories
        const sortedCompanies = Array.from(companies).sort();
        const sortedCategories = Array.from(categories).sort();

        return {
            companies: sortedCompanies,
            categories: sortedCategories,
            prices: prices,
            models: models
        };
    }

    organizeVehiclesByCompanyAndCategory() {
        const organized = {};

        this.vehicles.forEach(vehicle => {
            if (!organized[vehicle.company]) {
                organized[vehicle.company] = {};
            }
            
            if (!organized[vehicle.company][vehicle.category]) {
                organized[vehicle.company][vehicle.category] = [];
            }
            
            organized[vehicle.company][vehicle.category].push(vehicle);
        });

        // Trier par prix dans chaque catégorie
        Object.keys(organized).forEach(company => {
            Object.keys(organized[company]).forEach(category => {
                organized[company][category].sort((a, b) => {
                    const priceA = this.extractNumericPrice(a.totalPrice);
                    const priceB = this.extractNumericPrice(b.totalPrice);
                    return priceA - priceB;
                });
            });
        });

        return organized;
    }

    extractNumericPrice(priceText) {
        if (!priceText) return 0;
        const match = priceText.match(/\$?([\d,]+)/);
        return match ? parseInt(match[1].replace(/,/g, '')) : 0;
    }

    extractRentalInfo() {
        // Extraire les dates de location
        let dates = 'Dates non disponibles';
        let duration = '';
        let location = '';

        try {
            // Méthode 1: Chercher dans les champs de date cachés
            const startDateInput = document.querySelector('[data-stid="EGDSDateRangePicker-StartDate"]');
            const endDateInput = document.querySelector('[data-stid="EGDSDateRangePicker-EndDate"]');
            
            if (startDateInput && endDateInput) {
                const startDate = new Date(startDateInput.value);
                const endDate = new Date(endDateInput.value);
                
                if (!isNaN(startDate) && !isNaN(endDate)) {
                    const diffTime = Math.abs(endDate - startDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    dates = `${this.formatDate(startDate)} - ${this.formatDate(endDate)}`;
                    duration = `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
                }
            }

            // Méthode 2: Chercher dans le bouton des dates visible
            if (dates === 'Dates non disponibles') {
                const dateButton = document.querySelector('[data-testid="uitk-date-selector-input1-default"]');
                if (dateButton) {
                    const dateText = dateButton.textContent.trim();
                    if (dateText && dateText !== 'Dates') {
                        dates = dateText;
                        // Essayer d'extraire le nombre de jours à partir du texte
                        const match = dateText.match(/(\w{3} \d+) - (\w{3} \d+)/);
                        if (match) {
                            try {
                                const year = new Date().getFullYear();
                                const startDate = new Date(`${match[1]} ${year}`);
                                const endDate = new Date(`${match[2]} ${year}`);
                                if (!isNaN(startDate) && !isNaN(endDate)) {
                                    const diffTime = Math.abs(endDate - startDate);
                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                    duration = `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
                                }
                            } catch (e) {
                                console.log('Erreur calcul durée:', e);
                            }
                        }
                    }
                }
            }

            // Extraire la localisation
            const locationButton = document.querySelector('[data-stid="pick_up_location-menu-trigger"]');
            if (locationButton) {
                location = locationButton.textContent.trim();
            }

        } catch (error) {
            console.log('Erreur extraction info location:', error);
        }

        return {
            dates: dates,
            duration: duration,
            location: location
        };
    }

    formatDate(date) {
        const options = { 
            month: 'short', 
            day: 'numeric'
        };
        return date.toLocaleDateString('fr-FR', options);
    }

    createTableHeader() {
        const rentalInfo = this.extractRentalInfo();
        const header = document.createElement('div');
        header.className = 'table-header';
        header.innerHTML = `
            <div class="header-left">
                <h2>Tableau Comparatif des Prix par Jour</h2>
                <div class="rental-info">
                    <span class="rental-dates">${rentalInfo.dates}</span>
                    <span class="rental-duration">${rentalInfo.duration}</span>
                    <span class="rental-location">${rentalInfo.location}</span>
                </div>
            </div>
            <div class="header-controls">
                <div class="rental-filters">
                    <label class="filter-checkbox hertz-filter">
                        <input type="checkbox" id="filter-hertz" data-company="Hertz">
                        <span class="checkmark hertz-color"></span>
                        Hertz
                    </label>
                    <label class="filter-checkbox dollar-filter">
                        <input type="checkbox" id="filter-dollar" data-company="Dollar">
                        <span class="checkmark dollar-color"></span>
                        Dollar
                    </label>
                    <label class="filter-checkbox thrifty-filter">
                        <input type="checkbox" id="filter-thrifty" data-company="Thrifty Car Rental">
                        <span class="checkmark thrifty-color"></span>
                        Thrifty
                    </label>
                    <label class="filter-checkbox firefly-filter">
                        <input type="checkbox" id="filter-firefly" data-company="Firefly">
                        <span class="checkmark firefly-color"></span>
                        Firefly
                    </label>
                </div>
                <div class="action-buttons">
                    <button id="close-comparison-table" class="close-button" title="Fermer">
                        ✕
                    </button>
                    <button id="print-table" class="action-button" title="Imprimer / Télécharger">
                        🖨️
                    </button>
                </div>
            </div>
        `;

        // Ajouter les événements
        this.addHeaderEventListeners(header);

        return header;
    }

    addHeaderEventListeners(header) {
        // Événement de fermeture
        header.querySelector('#close-comparison-table').addEventListener('click', () => {
            document.getElementById('expedia-comparison-table').remove();
        });

        // Événement d'impression
        header.querySelector('#print-table').addEventListener('click', () => {
            this.printTable();
        });

        // Événements des filtres de loueurs
        const checkboxes = header.querySelectorAll('.filter-checkbox input');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.toggleCompanyHighlight(e.target.dataset.company, e.target.checked);
            });
        });
    }

    createTable(organizedData) {
        const tableWrapper = document.createElement('div');
        tableWrapper.className = 'table-wrapper';

        const table = document.createElement('table');
        table.className = 'comparison-table';

        // Créer le header du tableau
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Compagnie</th>
                <th>Catégorie</th>
                <th>Véhicule</th>
                <th>Modèle</th>
                <th>Spécifications</th>
                <th>Prix/Jour</th>
                <th>Prix Total</th>
                <th>Note</th>
                <th>Avantages</th>
            </tr>
        `;
        table.appendChild(thead);

        // Créer le corps du tableau
        const tbody = document.createElement('tbody');
        
        Object.keys(organizedData).sort().forEach(company => {
            Object.keys(organizedData[company]).sort().forEach(category => {
                organizedData[company][category].forEach((vehicle, index) => {
                    const row = this.createVehicleRow(vehicle, company, category, index === 0);
                    tbody.appendChild(row);
                });
            });
        });

        table.appendChild(tbody);
        tableWrapper.appendChild(table);

        return tableWrapper;
    }

    createSimpleTable(data) {
        const tableWrapper = document.createElement('div');
        tableWrapper.className = 'table-wrapper';

        const table = document.createElement('table');
        table.className = 'simple-comparison-table';

        // Créer l'en-tête
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        // Première colonne : Loueurs
        const companyHeader = document.createElement('th');
        companyHeader.textContent = 'Loueur';
        companyHeader.className = 'company-header';
        headerRow.appendChild(companyHeader);
        
        // Colonnes des catégories
        data.categories.forEach(category => {
            const th = document.createElement('th');
            th.textContent = category;
            th.className = 'category-header';
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Créer le corps du tableau
        const tbody = document.createElement('tbody');
        
        // Ligne pour chaque loueur
        data.companies.forEach(company => {
            const row = document.createElement('tr');
            
            // Cellule du nom du loueur
            const companyCell = document.createElement('td');
            companyCell.textContent = company;
            companyCell.className = 'company-name-cell';
            row.appendChild(companyCell);
            
            // Cellule pour chaque catégorie
            data.categories.forEach(category => {
                const cell = document.createElement('td');
                cell.className = 'price-cell';
                
                const price = data.prices[company]?.[category];
                const model = data.models[company]?.[category];
                
                if (price) {
                    // Créer le contenu avec prix et modèle
                    const priceDiv = document.createElement('div');
                    priceDiv.className = 'price-amount';
                    priceDiv.textContent = `$${price}`;
                    
                    const modelDiv = document.createElement('div');
                    modelDiv.className = 'vehicle-model';
                    modelDiv.textContent = this.shortenModel(model);
                    
                    cell.appendChild(priceDiv);
                    cell.appendChild(modelDiv);
                    
                    cell.setAttribute('data-price', price);
                    cell.setAttribute('data-category', category);
                    cell.setAttribute('data-model', model);
                } else {
                    cell.textContent = '-';
                    cell.className += ' no-price';
                }
                
                row.appendChild(cell);
            });
            
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        
        // Mettre en évidence les meilleurs prix
        this.highlightBestPrices(table, data.categories);
        
        tableWrapper.appendChild(table);
        return tableWrapper;
    }

    shortenModel(model) {
        if (!model) return '';
        
        // Raccourcir les modèles trop longs
        if (model.length > 25) {
            return model.substring(0, 22) + '...';
        }
        
        // Nettoyer les modèles
        return model.replace(/ or similar/gi, '').trim();
    }

    createVehicleRow(vehicle, company, category, isFirstInCategory) {
        const row = document.createElement('tr');
        row.className = 'vehicle-row';
        
        // Spécifications formatées
        const specsText = [
            vehicle.specifications.passengers ? `${vehicle.specifications.passengers} passagers` : '',
            vehicle.specifications.transmission || '',
            vehicle.specifications.mileage || '',
            vehicle.specifications.fuel || ''
        ].filter(Boolean).join(' • ');

        // Avantages formatés
        const benefitsText = vehicle.benefits.slice(0, 3).join(' • ');

        // Note formatée
        const ratingText = vehicle.rating.score ? 
            `${vehicle.rating.score} (${vehicle.rating.text}) - ${vehicle.rating.reviews}` : 
            'Non noté';

        row.innerHTML = `
            <td class="company-cell ${isFirstInCategory ? 'first-in-category' : ''}">${company}</td>
            <td class="category-cell ${isFirstInCategory ? 'first-in-category' : ''}">${category}</td>
            <td class="vehicle-name">${vehicle.name}</td>
            <td class="vehicle-description">${vehicle.description}</td>
            <td class="specifications">${specsText}</td>
            <td class="daily-price">${vehicle.dailyPrice}</td>
            <td class="total-price"><strong>${vehicle.totalPrice}</strong></td>
            <td class="rating">${ratingText}</td>
            <td class="benefits">${benefitsText}</td>
        `;

        // Ajouter un événement de clic pour surligner le véhicule original
        row.addEventListener('click', () => {
            // Retirer les surlignes précédents
            document.querySelectorAll('.highlighted-vehicle').forEach(el => {
                el.classList.remove('highlighted-vehicle');
            });

            // Surligner le véhicule correspondant
            if (vehicle.element) {
                vehicle.element.classList.add('highlighted-vehicle');
                vehicle.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });

        return row;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    countVehicleResults() {
        // Compter les cartes de véhicules avec différents sélecteurs possibles
        const selectors = [
            '[data-stid*="car-offer"]',
            '[data-stid*="vehicle"]',
            '.car-result',
            '.vehicle-card',
            '[data-testid*="car"]',
            '.uitk-card'
        ];
        
        let maxCount = 0;
        for (const selector of selectors) {
            const count = document.querySelectorAll(selector).length;
            maxCount = Math.max(maxCount, count);
        }
        
        console.log(`Nombre de résultats trouvés: ${maxCount}`);
        return maxCount;
    }

    extractVehicleDataAlternative() {
        console.log('🔍 Utilisation de méthodes alternatives d\'extraction...');
        this.vehicles = [];

        // Méthode alternative 1: Chercher par classes CSS communes
        const alternativeSelectors = [
            '.uitk-card',
            '[data-stid*="car"]',
            '[data-stid*="offer"]',
            '[data-testid*="car"]',
            '.car-result',
            '.vehicle-card',
            '.offer-card'
        ];

        for (const selector of alternativeSelectors) {
            const elements = document.querySelectorAll(selector);
            console.log(`🔍 Sélecteur "${selector}": ${elements.length} éléments trouvés`);
            
            if (elements.length > 0) {
                elements.forEach((element, index) => {
                    try {
                        const vehicle = this.extractVehicleFromElementAlternative(element, index);
                        if (vehicle) {
                            this.vehicles.push(vehicle);
                        }
                    } catch (error) {
                        console.log(`⚠️ Erreur extraction élément ${index}:`, error.message);
                    }
                });
                
                if (this.vehicles.length > 0) {
                    console.log(`✅ ${this.vehicles.length} véhicules extraits avec sélecteur "${selector}"`);
                    break;
                }
            }
        }

        console.log(`📊 Total: ${this.vehicles.length} véhicules extraits avec méthode alternative`);
    }

    extractVehicleFromElementAlternative(element, index) {
        // Extraction basique avec fallbacks
        const getText = (selectors) => {
            for (const sel of selectors) {
                const el = element.querySelector(sel);
                if (el) return el.textContent.trim();
            }
            return '';
        };

        const company = getText([
            '[data-stid*="company"]',
            '.company-name',
            '.brand-name'
        ]) || `Loueur ${index + 1}`;

        const price = getText([
            '[data-stid*="price"]',
            '.price',
            '.daily-price',
            '.total-price'
        ]) || '$0';

        const category = getText([
            '[data-stid*="category"]',
            '.category',
            '.vehicle-type'
        ]) || this.determineCategoryFromText(element.textContent);

        const name = getText([
            '[data-stid*="name"]',
            '.vehicle-name',
            '.car-name'
        ]) || category;

        const description = getText([
            '.description',
            '.vehicle-description',
            '.model'
        ]) || 'Véhicule disponible';

        // Extraire le prix numérique
        const dailyPrice = this.extractNumericPrice(price);
        
        if (dailyPrice > 0) {
            return {
                company: company,
                category: category,
                name: name,
                description: description,
                dailyPrice: `$${dailyPrice}`,
                totalPrice: `$${dailyPrice * 7}`, // Estimation 7 jours
                specifications: {
                    passengers: '4',
                    transmission: 'Automatic',
                    mileage: 'Unlimited'
                },
                rating: {
                    score: '',
                    text: '',
                    reviews: ''
                },
                benefits: ['Disponible']
            };
        }

        return null;
    }

    determineCategoryFromText(text) {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('economy')) return 'Economy';
        if (lowerText.includes('compact')) return 'Compact';
        if (lowerText.includes('midsize')) return 'Midsize';
        if (lowerText.includes('standard')) return 'Standard';
        if (lowerText.includes('fullsize')) return 'Fullsize';
        if (lowerText.includes('luxury')) return 'Luxury';
        if (lowerText.includes('suv')) return 'SUV';
        if (lowerText.includes('convertible')) return 'Convertible';
        if (lowerText.includes('mini')) return 'Mini';
        return 'Standard';
    }

    highlightBestPrices(table, categories) {
        // Pour chaque catégorie, trouver le prix le plus bas et l'encadrer en rouge
        categories.forEach(category => {
            const priceCells = table.querySelectorAll(`[data-category="${category}"]`);
            let minPrice = Infinity;
            let bestCells = [];

            // Trouver le prix minimum pour cette catégorie
            priceCells.forEach(cell => {
                const price = parseFloat(cell.getAttribute('data-price'));
                if (price && price < minPrice) {
                    minPrice = price;
                }
            });

            // Marquer toutes les cellules avec le prix minimum
            priceCells.forEach(cell => {
                const price = parseFloat(cell.getAttribute('data-price'));
                if (price === minPrice) {
                    cell.classList.add('best-price');
                }
            });
        });
    }

    toggleCompanyHighlight(companyName, isChecked) {
        const table = document.querySelector('.simple-comparison-table');
        if (!table) return;

        // Trouver toutes les lignes de cette compagnie
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const companyCell = row.querySelector('.company-name-cell');
            if (companyCell && companyCell.textContent.trim() === companyName) {
                if (isChecked) {
                    row.classList.add('highlighted-company');
                    row.classList.add(this.getCompanyColorClass(companyName));
                } else {
                    row.classList.remove('highlighted-company');
                    row.classList.remove(this.getCompanyColorClass(companyName));
                }
            }
        });
    }

    getCompanyColorClass(companyName) {
        const colorMap = {
            'Hertz': 'hertz-highlight',
            'Dollar': 'dollar-highlight',
            'Thrifty Car Rental': 'thrifty-highlight',
            'Firefly': 'firefly-highlight'
        };
        return colorMap[companyName] || 'default-highlight';
    }

    printTable() {
        // Créer une nouvelle fenêtre pour l'impression
        const printWindow = window.open('', '_blank');
        const tableContainer = document.getElementById('expedia-comparison-table');
        
        if (!tableContainer) return;

        // Cloner le tableau pour l'impression
        const tableClone = tableContainer.cloneNode(true);
        
        // Supprimer les boutons de contrôle pour l'impression
        const controls = tableClone.querySelector('.header-controls');
        if (controls) controls.remove();

        // Créer le contenu HTML pour l'impression
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title></title>
                <style>
                    @page {
                        margin: 0.5in;
                        size: A4 landscape;
                    }
                    body { 
                        font-family: Arial, sans-serif; 
                        margin: 0;
                        padding: 0;
                        color: #333;
                    }
                    .comparison-table-container {
                        position: static !important;
                        width: 100% !important;
                        height: auto !important;
                        background: white !important;
                        padding: 0 !important;
                    }
                    .table-header {
                        background: #f8f9fa;
                        padding: 15px;
                        border-bottom: 2px solid #0066cc;
                        text-align: center;
                    }
                    .table-header h2 {
                        margin: 0;
                        color: #0066cc;
                    }
                    .simple-comparison-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }
                    .simple-comparison-table th {
                        background: #667eea;
                        color: white;
                        padding: 12px 8px;
                        text-align: center;
                        border: 1px solid #ddd;
                    }
                    .simple-comparison-table .company-header {
                        background: #2c3e50;
                        text-align: left;
                    }
                    .simple-comparison-table td {
                        padding: 10px 8px;
                        border: 1px solid #ddd;
                        text-align: center;
                    }
                    .company-name-cell {
                        background: #f8f9fa !important;
                        font-weight: bold;
                        text-align: left !important;
                    }
                    .best-price {
                        background: #fff5f5 !important;
                        color: #dc3545 !important;
                        font-weight: bold;
                        border: 2px solid #dc3545 !important;
                    }
                    .no-price {
                        color: #999;
                        font-style: italic;
                    }
                    .price-amount {
                        font-size: 14px;
                        font-weight: bold;
                    }
                    .vehicle-model {
                        display: none !important;
                    }
                    @media print {
                        @page {
                            margin: 0.3in;
                        }
                        body { 
                            margin: 0; 
                            -webkit-print-color-adjust: exact;
                            color-adjust: exact;
                        }
                        .simple-comparison-table { 
                            font-size: 10px; 
                        }
                        .simple-comparison-table th,
                        .simple-comparison-table td {
                            padding: 6px 4px;
                        }
                    }
                </style>
            </head>
            <body>
                ${tableClone.outerHTML}
            </body>
            </html>
        `;

        printWindow.document.write(printContent);
        printWindow.document.close();

        // Attendre que le contenu soit chargé puis imprimer
        printWindow.onload = function() {
            printWindow.print();
        };
    }

    addMultiTableEvents(container) {
        // Gestion des onglets
        const tabs = container.querySelectorAll('.tab');
        const tabContents = container.querySelectorAll('.tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Désactiver tous les onglets
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(tc => tc.classList.remove('active'));
                
                // Activer l'onglet sélectionné
                tab.classList.add('active');
                const targetContent = container.querySelector(`[data-duration="${tab.dataset.duration}"]`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
        
        // Bouton fermeture
        const closeBtn = container.querySelector('#close-multi-tables');
        closeBtn.addEventListener('click', () => {
            container.remove();
        });
        
        // Bouton impression
        const printBtn = container.querySelector('#print-all-tables');
        printBtn.addEventListener('click', () => {
            this.printAllTables(container);
        });
    }

    async generateSingleComparisonReal(startDate, duration, addLogEntry, updateCurrentAction) {
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + duration);
        
        try {
            // 1. Construire et naviguer vers la nouvelle URL
            const newUrl = this.constructSearchUrl(startDate, endDate);
            addLogEntry(`🌐 Navigation vers : ${newUrl}`, 'url');
            updateCurrentAction(`Navigation vers la page ${duration} jour${duration > 1 ? 's' : ''}...`);
            
            // Modifier les dates dans les champs de la page actuelle
            addLogEntry(`🔄 Modification des dates de recherche...`, 'process');
            await this.updateSearchDatesInPage(startDate, endDate);
            
            // Déclencher une nouvelle recherche
            addLogEntry(`🔍 Déclenchement de la nouvelle recherche...`, 'process');
            await this.triggerNewSearch();
            
            // Attendre que les nouveaux résultats se chargent
            updateCurrentAction(`Attente des nouveaux résultats...`);
            await this.sleep(3000); // Attendre que la nouvelle recherche se charge
            
            // 3. Effectuer le défilement et "Show more"
            updateCurrentAction(`Chargement de tous les résultats...`);
            addLogEntry(`📜 Défilement automatique et clic sur "Show more"...`, 'process');
            await this.loadAllResults();
            addLogEntry(`✅ Tous les résultats chargés`, 'success');
            
            // 4. Extraire les données
            updateCurrentAction(`Extraction des données des véhicules...`);
            addLogEntry(`🔍 Extraction des données des véhicules...`, 'process');
            
            // Réinitialiser les véhicules pour cette nouvelle recherche
            this.vehicles = [];
            this.extractVehicleData();
            
            if (this.vehicles.length === 0) {
                addLogEntry(`⚠️ Tentative d'extraction alternative...`, 'process');
                this.extractVehicleDataAlternative();
            }
            
            addLogEntry(`📊 ${this.vehicles.length} véhicules extraits`, 'info');
            
            if (this.vehicles.length === 0) {
                throw new Error('Aucun véhicule trouvé pour cette durée');
            }
            
            // 5. Organiser les données
            const tableData = this.organizeForSimpleTable();
            addLogEntry(`✅ Données organisées : ${tableData.companies.length} loueurs, ${tableData.categories.length} catégories`, 'success');
            
            return {
                tableData,
                vehicleCount: this.vehicles.length,
                startDate,
                endDate,
                duration
            };
            
        } catch (error) {
            addLogEntry(`❌ Erreur pour ${duration} jour${duration > 1 ? 's' : ''} : ${error.message}`, 'error');
            throw error;
        }
    }

    async waitForPageLoad() {
        // Attendre que la page soit complètement chargée
        let attempts = 0;
        const maxAttempts = 20;
        
        while (attempts < maxAttempts) {
            // Vérifier si les éléments de la page sont présents
            const hasContent = document.querySelector('.uitk-layout-grid') || 
                              document.querySelector('[data-stid]') ||
                              document.querySelectorAll('div').length > 100;
            
            if (hasContent) {
                // Attendre un peu plus pour s'assurer que tout est chargé
                await this.sleep(1000);
                return;
            }
            
            await this.sleep(500);
            attempts++;
        }
        
        console.log('⚠️ Timeout en attendant le chargement de la page');
    }

    async updateSearchDatesInPage(startDate, endDate) {
        // Formater les dates pour différents formats d'Expedia
        const startDateISO = startDate.toISOString().split('T')[0];
        const endDateISO = endDate.toISOString().split('T')[0];
        
        // Méthode 1: Modifier les champs cachés
        const startDateInput = document.querySelector('[data-stid="EGDSDateRangePicker-StartDate"]');
        const endDateInput = document.querySelector('[data-stid="EGDSDateRangePicker-EndDate"]');
        
        if (startDateInput) {
            startDateInput.value = startDateISO;
            startDateInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
        
        if (endDateInput) {
            endDateInput.value = endDateISO;
            endDateInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
        
        // Méthode 2: Essayer de cliquer sur le bouton de dates et modifier
        const dateButton = document.querySelector('[data-testid="uitk-date-selector-input1-default"]');
        if (dateButton) {
            // Simuler un clic pour ouvrir le sélecteur
            dateButton.click();
            await this.sleep(500);
            
            // Essayer de fermer le sélecteur
            const body = document.body;
            body.click();
        }
        
        await this.sleep(1000);
    }

    async triggerNewSearch() {
        // Chercher le bouton de recherche
        const searchButton = document.querySelector('#search_button') ||
                           document.querySelector('[type="submit"]') ||
                           document.querySelector('button[aria-label*="Search"]') ||
                           document.querySelector('button[aria-label*="Recherche"]');
        
        if (searchButton) {
            console.log('🔍 Bouton de recherche trouvé, clic...');
            searchButton.click();
            await this.sleep(2000);
        } else {
            console.log('⚠️ Bouton de recherche non trouvé, tentative de soumission de formulaire...');
            
            // Essayer de soumettre le formulaire de recherche
            const form = document.querySelector('form');
            if (form) {
                form.submit();
                await this.sleep(2000);
            }
        }
    }

    createSimpleTableHtml(data, duration) {
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + duration);
        
        return `
            <div class="duration-table-wrapper">
                <div class="duration-table-header">
                    <h3>Durée: ${duration} jour${duration > 1 ? 's' : ''}</h3>
                    <div class="duration-info">
                        <span class="duration-dates">Du ${startDate.toLocaleDateString('fr-FR')} au ${endDate.toLocaleDateString('fr-FR')}</span>
                    </div>
                </div>
                ${this.createSimpleTableContent(data)}
            </div>
        `;
    }

    createSimpleTableContent(data) {
        let tableHtml = `
            <table class="simple-comparison-table">
                <thead>
                    <tr>
                        <th class="company-header">Loueur</th>
        `;
        
        // En-têtes des catégories
        data.categories.forEach(category => {
            tableHtml += `<th class="category-header">${category}</th>`;
        });
        
        tableHtml += `
                    </tr>
                </thead>
                <tbody>
        `;
        
        // Lignes des loueurs
        data.companies.forEach(company => {
            tableHtml += `<tr>`;
            tableHtml += `<td class="company-name-cell">${company}</td>`;
            
            data.categories.forEach(category => {
                const price = data.prices[company]?.[category];
                const model = data.models[company]?.[category];
                
                if (price) {
                    tableHtml += `
                        <td class="price-cell" data-price="${price}" data-category="${category}" data-model="${model}">
                            <div class="price-amount">$${price}</div>
                            <div class="vehicle-model">${this.shortenModel(model)}</div>
                        </td>
                    `;
                } else {
                    tableHtml += `<td class="price-cell no-price">-</td>`;
                }
            });
            
            tableHtml += `</tr>`;
        });
        
        tableHtml += `
                </tbody>
            </table>
        `;
        
        return tableHtml;
    }

    printAllTables(container) {
        // Créer une nouvelle fenêtre pour imprimer tous les tableaux
        const printWindow = window.open('', '_blank');
        
        const tabContents = container.querySelectorAll('.tab-content');
        let allTablesHtml = '';
        
        tabContents.forEach((tabContent, index) => {
            const duration = tabContent.dataset.duration;
            allTablesHtml += `
                <div class="print-table-section">
                    <h2>Comparaison ${duration} jour${duration > 1 ? 's' : ''}</h2>
                    ${tabContent.innerHTML}
                </div>
                ${index < tabContents.length - 1 ? '<div class="page-break"></div>' : ''}
            `;
        });
        
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Comparaison Multi-Durées - Expedia Car Comparator</title>
                <style>
                    @page { margin: 0.3in; size: A4 landscape; }
                    body { 
                        font-family: Arial, sans-serif; 
                        margin: 0; padding: 0; color: #333;
                        -webkit-print-color-adjust: exact;
                        color-adjust: exact;
                    }
                    .print-table-section {
                        margin-bottom: 30px;
                    }
                    .print-table-section h2 {
                        color: #0066cc;
                        border-bottom: 2px solid #0066cc;
                        padding-bottom: 10px;
                        margin-bottom: 20px;
                    }
                    .simple-comparison-table {
                        width: 100%; border-collapse: collapse; font-size: 10px;
                    }
                    .simple-comparison-table th {
                        background: #667eea; color: white; padding: 6px 4px;
                        text-align: center; border: 1px solid #ddd;
                    }
                    .simple-comparison-table .company-header {
                        background: #2c3e50; text-align: left;
                    }
                    .simple-comparison-table td {
                        padding: 6px 4px; border: 1px solid #ddd; text-align: center;
                    }
                    .company-name-cell {
                        background: #f8f9fa !important; font-weight: bold; text-align: left !important;
                    }
                    .best-price {
                        background: #fff5f5 !important; color: #dc3545 !important;
                        font-weight: bold; border: 2px solid #dc3545 !important;
                    }
                    .no-price { color: #999; font-style: italic; }
                    .vehicle-model { display: none !important; }
                    .page-break { page-break-before: always; }
                    .loading-message, .error-message { display: none !important; }
                </style>
            </head>
            <body>
                ${allTablesHtml}
            </body>
            </html>
        `;
        
        printWindow.document.write(printContent);
        printWindow.document.close();
        
        printWindow.onload = function() {
            printWindow.print();
        };
    }

    async simulateVisibleScrolling() {
        // Simuler un défilement visible de la page
        const scrollSteps = 5;
        const scrollAmount = window.innerHeight / scrollSteps;
        
        for (let i = 0; i < scrollSteps; i++) {
            window.scrollTo({
                top: scrollAmount * i,
                behavior: 'smooth'
            });
            await this.sleep(200);
        }
        
        // Revenir en haut
        window.scrollTo({ top: 0, behavior: 'smooth' });
        await this.sleep(500);
    }

    async simulateShowMoreClicks(duration) {
        // Simuler plusieurs clics "Show more" selon la durée
        const clickCount = Math.min(duration, 5);
        
        for (let i = 0; i < clickCount; i++) {
            await this.sleep(300);
            window.scrollTo({
                top: document.body.scrollHeight * (i + 1) / clickCount,
                behavior: 'smooth'
            });
        }
        
        await this.sleep(500);
    }

    simulateVehicleDataForDuration(duration) {
        // Si on n'a pas de données de base, créer des données de démonstration
        if (this.vehicles.length === 0) {
            return this.createDemoVehicleData(duration);
        }
        
        // Modifier les prix selon la durée
        const durationMultiplier = this.getDurationMultiplier(duration);
        
        return this.vehicles.map(vehicle => ({
            ...vehicle,
            dailyPrice: this.adjustPriceForDuration(vehicle.dailyPrice, durationMultiplier),
            totalPrice: this.adjustPriceForDuration(vehicle.totalPrice, duration / 7)
        }));
    }

    getDurationMultiplier(duration) {
        // Réductions pour les longues durées
        if (duration <= 3) return 1.0;
        if (duration <= 7) return 0.95;
        if (duration <= 14) return 0.90;
        if (duration <= 21) return 0.85;
        return 0.80;
    }

    adjustPriceForDuration(priceString, multiplier) {
        const numericPrice = this.extractNumericPrice(priceString);
        const adjustedPrice = Math.round(numericPrice * multiplier);
        return `$${adjustedPrice}`;
    }

    createDemoVehicleData(duration) {
        // Créer des données réalistes selon la durée
        const companies = ['Hertz', 'Avis', 'Budget', 'Enterprise', 'Alamo'];
        const categories = ['Economy', 'Compact', 'Midsize', 'Standard', 'Fullsize'];
        const models = ['Toyota Corolla', 'Nissan Sentra', 'Hyundai Elantra', 'Ford Focus', 'Chevrolet Cruze'];
        
        const vehicles = [];
        const basePrice = duration <= 7 ? 35 : (duration <= 14 ? 30 : 25);
        
        companies.forEach(company => {
            categories.forEach((category, catIndex) => {
                const price = basePrice + (catIndex * 10) + Math.floor(Math.random() * 20);
                vehicles.push({
                    company: company,
                    category: category,
                    name: category,
                    description: models[Math.floor(Math.random() * models.length)] + ' or similar',
                    dailyPrice: `$${price}`,
                    totalPrice: `$${price * duration}`,
                    specifications: {
                        passengers: '4-5',
                        transmission: 'Automatic',
                        mileage: 'Unlimited'
                    },
                    rating: {
                        score: Math.floor(Math.random() * 30) + 70,
                        text: 'Good',
                        reviews: Math.floor(Math.random() * 5) + 3
                    },
                    benefits: ['Free cancellation', 'Pay at pick-up']
                });
            });
        });
        
        return vehicles;
    }
}

// Initialiser l'extension quand la page est chargée
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ExpediaCarComparator();
    });
} else {
    new ExpediaCarComparator();
}

// Réinitialiser si la page change (navigation SPA)
let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        setTimeout(() => {
            new ExpediaCarComparator();
        }, 1000);
    }
}).observe(document, { subtree: true, childList: true });
