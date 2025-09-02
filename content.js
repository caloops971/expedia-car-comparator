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
                this.createCompareButton();
                console.log('Extension Expedia Car Comparator activée - Page de recherche détectée');
            } else {
                // Sinon, afficher le bouton extraction multiple
                this.createMultiExtractionButton();
                console.log('Extension Expedia Car Comparator activée - Site Expedia détecté');
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

        button.addEventListener('click', () => this.showDurationSelector());

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
            right: '20px',
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
        const interface = document.createElement('div');
        interface.id = 'multi-extraction-interface';
        interface.className = 'multi-extraction-interface';
        
        interface.innerHTML = `
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
        
        document.body.appendChild(interface);
        
        // Détecter la localisation
        this.detectCurrentLocation();
        
        // Ajouter les événements
        this.addMultiExtractionEvents(interface);
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

    addMultiExtractionEvents(interface) {
        // Fermeture de l'interface
        const closeBtn = interface.querySelector('#close-multi-extraction');
        closeBtn.addEventListener('click', () => {
            interface.remove();
        });
        
        // Gestion des modes d'extraction
        const modeButtons = interface.querySelectorAll('.mode-button');
        modeButtons.forEach(button => {
            if (!button.disabled) {
                button.addEventListener('click', (e) => {
                    const mode = e.target.closest('.extraction-mode').dataset.mode;
                    this.handleExtractionMode(mode, interface);
                });
            }
        });
        
        // Fermeture en cliquant à l'extérieur
        interface.addEventListener('click', (e) => {
            if (e.target === interface) {
                interface.remove();
            }
        });
    }

    handleExtractionMode(mode, interface) {
        switch (mode) {
            case 'current-search':
                interface.remove();
                if (this.isOnCarSearchPage()) {
                    this.showDurationSelector();
                } else {
                    alert('Veuillez d\'abord effectuer une recherche de véhicules sur Expedia');
                }
                break;
                
            case 'multi-duration':
                interface.remove();
                this.showCustomDurationSelector();
                break;
                
            case 'custom-search':
                interface.remove();
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
                    
                    <div class="date-info">
                        <p>📅 Date de début : <span id="start-date-display">Extraction automatique</span></p>
                        <p class="note">Les tableaux seront générés pour chaque durée sélectionnée</p>
                    </div>
                </div>
                
                <div class="duration-selector-footer">
                    <button id="cancel-duration-selector" class="btn-secondary">Annuler</button>
                    <button id="generate-multi-tables" class="btn-primary">Générer les Tableaux</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Extraire et afficher la date de début
        const startDateInfo = this.extractStartDate();
        const startDateDisplay = document.getElementById('start-date-display');
        startDateDisplay.textContent = startDateInfo.display;
        
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

    addDurationSelectorEvents(modal, startDate) {
        // Fermeture du modal
        const closeBtn = modal.querySelector('#close-duration-selector');
        const cancelBtn = modal.querySelector('#cancel-duration-selector');
        
        closeBtn.addEventListener('click', () => modal.remove());
        cancelBtn.addEventListener('click', () => modal.remove());
        
        // Gestion durée personnalisée
        const customCheckbox = modal.querySelector('#custom-duration-checkbox');
        const customInput = modal.querySelector('#custom-duration-input');
        
        customCheckbox.addEventListener('change', (e) => {
            customInput.disabled = !e.target.checked;
            if (e.target.checked) {
                customInput.focus();
            }
        });
        
        // Génération des tableaux
        const generateBtn = modal.querySelector('#generate-multi-tables');
        generateBtn.addEventListener('click', () => {
            const selectedDurations = this.getSelectedDurations(modal);
            if (selectedDurations.length === 0) {
                alert('Veuillez sélectionner au moins une durée');
                return;
            }
            
            modal.remove();
            this.generateMultipleComparisons(startDate, selectedDurations);
        });
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

    async generateMultipleComparisons(startDate, durations) {
        // Créer le conteneur pour les multiples tableaux
        const multiTableContainer = document.createElement('div');
        multiTableContainer.id = 'multi-table-container';
        multiTableContainer.className = 'multi-table-container';
        
        const header = document.createElement('div');
        header.className = 'multi-table-header';
        header.innerHTML = `
            <h2>📊 Comparaison Multi-Durées</h2>
            <div class="multi-table-controls">
                <button id="print-all-tables" class="btn-print">🖨️ Imprimer Tout</button>
                <button id="close-multi-tables" class="btn-close">✕</button>
            </div>
        `;
        
        multiTableContainer.appendChild(header);
        
        // Créer les onglets
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'tabs-container';
        
        const tabsList = document.createElement('div');
        tabsList.className = 'tabs-list';
        
        const tabsContent = document.createElement('div');
        tabsContent.className = 'tabs-content';
        
        // Générer un tableau pour chaque durée
        for (let i = 0; i < durations.length; i++) {
            const duration = durations[i];
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + duration);
            
            // Créer l'onglet
            const tab = document.createElement('button');
            tab.className = `tab ${i === 0 ? 'active' : ''}`;
            tab.textContent = `${duration} jour${duration > 1 ? 's' : ''}`;
            tab.dataset.duration = duration;
            tabsList.appendChild(tab);
            
            // Créer le contenu de l'onglet
            const tabContent = document.createElement('div');
            tabContent.className = `tab-content ${i === 0 ? 'active' : ''}`;
            tabContent.dataset.duration = duration;
            tabContent.innerHTML = `
                <div class="loading-message">
                    <div class="spinner"></div>
                    <p>Génération du tableau pour ${duration} jour${duration > 1 ? 's' : ''}...</p>
                </div>
            `;
            tabsContent.appendChild(tabContent);
        }
        
        tabsContainer.appendChild(tabsList);
        tabsContainer.appendChild(tabsContent);
        multiTableContainer.appendChild(tabsContainer);
        
        document.body.appendChild(multiTableContainer);
        
        // Ajouter les événements pour les onglets et contrôles
        this.addMultiTableEvents(multiTableContainer);
        
        // Générer les tableaux un par un
        for (let i = 0; i < durations.length; i++) {
            const duration = durations[i];
            await this.generateSingleComparison(startDate, duration, i === 0);
        }
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

    async generateSingleComparison(startDate, duration, isFirst) {
        try {
            // Simuler la génération (en réalité, on utiliserait les données actuelles)
            // Pour cette démo, on va juste créer un tableau avec les données existantes
            const tableData = this.organizeForSimpleTable();
            const tableHtml = this.createSimpleTableHtml(tableData, duration);
            
            // Insérer le tableau dans l'onglet correspondant
            const tabContent = document.querySelector(`[data-duration="${duration}"]`);
            if (tabContent) {
                tabContent.innerHTML = tableHtml;
                
                // Ajouter les événements du tableau
                const table = tabContent.querySelector('.simple-comparison-table');
                if (table) {
                    this.highlightBestPrices(table, tableData.categories);
                }
            }
            
            console.log(`✅ Tableau généré pour ${duration} jour${duration > 1 ? 's' : ''}`);
            
        } catch (error) {
            console.error(`❌ Erreur génération tableau ${duration} jours:`, error);
            const tabContent = document.querySelector(`[data-duration="${duration}"]`);
            if (tabContent) {
                tabContent.innerHTML = `
                    <div class="error-message">
                        <p>❌ Erreur lors de la génération du tableau pour ${duration} jour${duration > 1 ? 's' : ''}</p>
                        <p class="error-details">${error.message}</p>
                    </div>
                `;
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
