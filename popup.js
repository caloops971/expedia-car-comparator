// Script pour la popup de l'extension Expedia Car Comparator

document.addEventListener('DOMContentLoaded', async function() {
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');
    const vehicleCount = document.getElementById('vehicle-count');
    const refreshButton = document.getElementById('refresh-button');

    // Fonction pour mettre à jour le statut
    function updateStatus(isActive, text, count = '') {
        if (isActive) {
            statusDot.classList.remove('inactive');
            statusText.textContent = text;
        } else {
            statusDot.classList.add('inactive');
            statusText.textContent = text;
        }
        vehicleCount.textContent = count;
    }

    // Fonction pour vérifier le statut de la page active
    async function checkPageStatus() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab.url.includes('expedia.com') && !tab.url.includes('expedia.fr') && !tab.url.includes('expedia.ca')) {
                updateStatus(false, 'Page Expedia non détectée');
                return;
            }

            if (!tab.url.includes('carsearch')) {
                updateStatus(false, 'Page de recherche de véhicules non détectée');
                return;
            }

            // Injecter un script pour vérifier la présence de résultats
            const results = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => {
                    const vehicleCards = document.querySelectorAll('[data-stid="lodging-card-responsive"]');
                    const hasResults = vehicleCards.length > 0;
                    const hasFilters = document.querySelector('[data-stid="selCC"]') || 
                                     document.querySelector('[data-stid="selVen"]');
                    
                    return {
                        hasResults,
                        hasFilters,
                        vehicleCount: vehicleCards.length,
                        hasCompareButton: !!document.getElementById('expedia-compare-btn')
                    };
                }
            });

            const pageInfo = results[0].result;

            if (pageInfo.hasResults || pageInfo.hasFilters) {
                if (pageInfo.hasCompareButton) {
                    updateStatus(true, 'Extension active - Bouton disponible', 
                               `${pageInfo.vehicleCount} véhicules trouvés`);
                } else {
                    updateStatus(true, 'Page compatible détectée', 
                               `${pageInfo.vehicleCount} véhicules trouvés`);
                }
            } else {
                updateStatus(false, 'Aucun résultat de véhicule trouvé');
            }

        } catch (error) {
            console.error('Erreur lors de la vérification du statut:', error);
            updateStatus(false, 'Erreur de détection');
        }
    }

    // Fonction pour actualiser la détection
    async function refreshDetection() {
        refreshButton.disabled = true;
        refreshButton.textContent = '🔄 Actualisation...';

        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            // Réinjecter le content script
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['content.js']
            });

            // Attendre un peu puis vérifier le statut
            setTimeout(() => {
                checkPageStatus();
                refreshButton.disabled = false;
                refreshButton.textContent = '🔄 Actualiser la détection';
            }, 1000);

        } catch (error) {
            console.error('Erreur lors de l\'actualisation:', error);
            refreshButton.disabled = false;
            refreshButton.textContent = '🔄 Actualiser la détection';
            updateStatus(false, 'Erreur lors de l\'actualisation');
        }
    }

    // Event listeners
    refreshButton.addEventListener('click', refreshDetection);

    // Vérification initiale du statut
    await checkPageStatus();

    // Vérifier le statut toutes les 3 secondes
    setInterval(checkPageStatus, 3000);
});

// Fonction pour ouvrir les options (si nécessaire plus tard)
function openOptions() {
    chrome.runtime.openOptionsPage();
}
