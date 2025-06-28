// Global variables
let elements = {};
let hashFunctions = {};

// Global variables for loading state
let isGeneratingHashes = false;
let totalHashAlgorithms = 5; // MD5, SHA-1, SHA-224, SHA-256, SHA-512
let completedHashes = 0;

// Hash History Management
const HISTORY_STORAGE_KEY = 'hashGen_history';
const MAX_HISTORY_ITEMS = 50; // Limit history to 50 items

// Initialize when DOM content is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    
    // Initialize theme
    initializeTheme();
    
    initializeApp();
    
    // Add modal close event listeners
    const modal = document.getElementById('historyModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeHashHistory();
            }
        });
    }
    
    // Add keyboard support for modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('historyModal');
            if (modal && modal.style.display !== 'none') {
                closeHashHistory();
            }
        }
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const navLinks = document.getElementById('navLinks');
            const menuToggle = document.getElementById('menuToggle');
            
            navLinks.classList.remove('show');
            const icon = menuToggle.querySelector('i');
            icon.className = 'fas fa-bars';
        });
    });
});

// Initialize the application
function initializeApp() {
    console.log('Initializing app...');
    
    // Verify if required libraries are available
    if (typeof CryptoJS === 'undefined') {
        console.error('CryptoJS library not loaded');
        showLibraryError();
        return;
    }

    // Cache DOM elements
    elements = {
        textInput: document.getElementById('textInput'),
        fileInput: document.getElementById('fileInput'),
        fileInfo: document.getElementById('fileInfo'),
        progressContainer: document.getElementById('progressContainer'),
        progressFill: document.getElementById('progressFill'),
        progressText: document.getElementById('progressText'),
        generateBtn: document.getElementById('generateBtn'),
        outputs: {
            md5: document.getElementById('md5Output'),
            sha1: document.getElementById('sha1Output'),
            sha224: document.getElementById('sha224Output'),
            sha256: document.getElementById('sha256Output'),
            sha512: document.getElementById('sha512Output')
        }
    };

    console.log('Elements cached:', elements);

    // Define hash functions
    hashFunctions = {
        md5: (data) => {
            try {
                if (data instanceof ArrayBuffer) {
                    const wordArray = CryptoJS.lib.WordArray.create(new Uint8Array(data));
                    return CryptoJS.MD5(wordArray).toString();
                } else {
                    return CryptoJS.MD5(data).toString();
                }
            } catch (error) {
                console.error('MD5 error:', error);
                return 'Error generating MD5 hash';
            }
        },
        sha1: (data) => {
            try {
                if (data instanceof ArrayBuffer) {
                    const wordArray = CryptoJS.lib.WordArray.create(new Uint8Array(data));
                    return CryptoJS.SHA1(wordArray).toString();
                } else {
                    return CryptoJS.SHA1(data).toString();
                }
            } catch (error) {
                console.error('SHA1 error:', error);
                return 'Error generating SHA1 hash';
            }
        },
        sha224: (data) => {
            try {
                if (data instanceof ArrayBuffer) {
                    const wordArray = CryptoJS.lib.WordArray.create(new Uint8Array(data));
                    return CryptoJS.SHA224(wordArray).toString();
            } else {
                    return CryptoJS.SHA224(data).toString();
                }
            } catch (error) {
                console.error('SHA224 error:', error);
                return 'Error generating SHA224 hash';
            }
        },
        sha256: (data) => {
            try {
                if (data instanceof ArrayBuffer) {
                    const wordArray = CryptoJS.lib.WordArray.create(new Uint8Array(data));
                    return CryptoJS.SHA256(wordArray).toString();
                } else {
                    return CryptoJS.SHA256(data).toString();
                }
            } catch (error) {
                console.error('SHA256 error:', error);
                return 'Error generating SHA256 hash';
            }
        },
        sha512: (data) => {
            try {
                if (data instanceof ArrayBuffer) {
                    const wordArray = CryptoJS.lib.WordArray.create(new Uint8Array(data));
                    return CryptoJS.SHA512(wordArray).toString();
            } else {
                    return CryptoJS.SHA512(data).toString();
                }
            } catch (error) {
                console.error('SHA512 error:', error);
                return 'Error generating SHA512 hash';
            }
        }
    };

    // Set up event listeners
    setupEventListeners();
    
    // Initialize tab functionality
    initializeTabs();
    
    console.log('App initialized successfully');
}

// Initialize tab functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const targetTab = button.getAttribute('data-tab');
            
            // Prevent multiple rapid clicks
            if (button.classList.contains('active')) {
                return;
            }
            
            // Clean up any processing states before switching
            cleanupProcessingStates();
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.style.pointerEvents = 'auto';
            });
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                pane.style.display = 'none';
            });
            
            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            const targetPane = document.getElementById(`${targetTab}-tab`);
            if (targetPane) {
                targetPane.classList.add('active');
                targetPane.style.display = 'block';
            }
            
            // Ensure smooth transition
            requestAnimationFrame(() => {
                if (targetPane) {
                    targetPane.style.opacity = '1';
                    targetPane.style.transform = 'translateY(0)';
                }
            });
        });
    });
}

// Clean up processing states
function cleanupProcessingStates() {
    // Remove processing classes
    document.querySelectorAll('.processing').forEach(el => {
        el.classList.remove('processing');
    });
    
    // Reset opacity and pointer events
    Object.values(elements.outputs).forEach(output => {
        if (output) {
            output.style.opacity = '1';
            output.style.pointerEvents = 'auto';
        }
    });
    
    // Ensure tab navigation is always clickable
    const tabNavigation = document.querySelector('.tab-navigation');
    if (tabNavigation) {
        tabNavigation.style.pointerEvents = 'auto';
    }
    
    const tabContent = document.querySelector('.tab-content');
    if (tabContent) {
        tabContent.style.pointerEvents = 'auto';
    }
}

// Show library error
function showLibraryError() {
    const errorMessage = 'Error: Cryptographic library not available';
    if (elements.outputs) {
        Object.values(elements.outputs).forEach(output => {
            if (output) output.textContent = errorMessage;
        });
    }
}

// Update all hash outputs
function updateHashes(hashValue) {
    console.log('Updating hashes for:', hashValue);
    
    // Remove any existing processing states
    document.querySelectorAll('.processing').forEach(el => {
        el.classList.remove('processing');
    });
    
    // Check if it's a large file (ArrayBuffer)
    const isLargeFile = hashValue instanceof ArrayBuffer && hashValue.byteLength > 10 * 1024 * 1024; // 10MB
    
    if (isLargeFile) {
        console.log('Processing large file, using async processing...');
        updateHashesAsync(hashValue);
        return;
    }
    
    try {
        Object.keys(hashFunctions).forEach(type => {
            const hash = hashFunctions[type](hashValue);
            if (elements.outputs[type]) {
                elements.outputs[type].textContent = hash;
                elements.outputs[type].style.opacity = '1';
                elements.outputs[type].style.pointerEvents = 'auto';
                console.log(`${type}: ${hash}`);
            }
        });
    } catch (error) {
        console.error('Error updating hashes:', error);
        const errorMessage = 'Error generating hash. Please try again.';
        Object.values(elements.outputs).forEach(output => {
            if (output) {
                output.textContent = errorMessage;
                output.style.opacity = '1';
                output.style.pointerEvents = 'auto';
            }
        });
    }
}

// Async hash processing for large files
function updateHashesAsync(hashValue) {
    const hashTypes = Object.keys(hashFunctions);
    let completedCount = 0;
    
    // Show initial processing message
    Object.values(elements.outputs).forEach(output => {
        if (output) {
            output.textContent = 'Processing...';
            output.style.opacity = '0.7';
        }
    });
    
    // Process each hash type with a small delay to prevent UI blocking
    hashTypes.forEach((type, index) => {
        setTimeout(() => {
            try {
                const hash = hashFunctions[type](hashValue);
                if (elements.outputs[type]) {
                    elements.outputs[type].textContent = hash;
                    elements.outputs[type].style.opacity = '1';
                    console.log(`${type}: ${hash}`);
                }
            } catch (error) {
                console.error(`Error generating ${type} hash:`, error);
                if (elements.outputs[type]) {
                    elements.outputs[type].textContent = `Error generating ${type} hash`;
                    elements.outputs[type].style.opacity = '1';
                }
            }
            
            completedCount++;
            
            // Update progress in the progress bar if it's still visible
            if (elements.progressContainer && elements.progressContainer.style.display !== 'none') {
                const hashProgress = (completedCount / hashTypes.length) * 100;
                if (elements.progressFill) {
                    elements.progressFill.style.width = hashProgress + '%';
                }
                if (elements.progressText) {
                    elements.progressText.textContent = `Processing hashes: ${Math.round(hashProgress)}%`;
                }
            }
            
            // Hide progress when all hashes are complete
            if (completedCount === hashTypes.length) {
                setTimeout(() => {
                    // Remove any processing states
                    document.querySelectorAll('.processing').forEach(el => {
                        el.classList.remove('processing');
                    });
                    
                    if (elements.progressContainer) {
                        elements.progressContainer.style.display = 'none';
                    }
                    if (elements.generateBtn) {
                        elements.generateBtn.disabled = false;
                    }
                    
                    // Ensure all outputs are fully visible
                    Object.values(elements.outputs).forEach(output => {
                        if (output) {
                            output.style.opacity = '1';
                            output.style.pointerEvents = 'auto';
                        }
                    });
                }, 500);
            }
        }, index * 50); // 50ms delay between each hash type
    });
}

// Generate hashes for text input
function generateHashes() {
    const text = document.getElementById('textInput').value;
    
    if (!text.trim()) {
        // Clear all outputs if no text
        Object.keys(elements.outputs).forEach(key => {
            if (elements.outputs[key]) {
                elements.outputs[key].textContent = `Your ${key.toUpperCase()} hash will appear here...`;
            }
        });
        return;
    }

    // Generate hashes instantly for text input (no popup)
    const hashTypes = ['md5', 'sha1', 'sha224', 'sha256', 'sha512'];
    const generatedHashes = {};
    
    hashTypes.forEach((type) => {
        try {
            let hash;
            
            switch(type) {
                case 'md5':
                    hash = CryptoJS.MD5(text).toString();
                    break;
                case 'sha1':
                    hash = CryptoJS.SHA1(text).toString();
                    break;
                case 'sha224':
                    hash = CryptoJS.SHA224(text).toString();
                    break;
                case 'sha256':
                    hash = CryptoJS.SHA256(text).toString();
                    break;
                case 'sha512':
                    hash = CryptoJS.SHA512(text).toString();
                    break;
            }
            
            if (elements.outputs[type]) {
                elements.outputs[type].textContent = hash;
            }
            
            generatedHashes[type] = hash;
            
        } catch (error) {
            console.error(`Error generating ${type} hash:`, error);
            if (elements.outputs[type]) {
                elements.outputs[type].textContent = `Error generating ${type.toUpperCase()} hash`;
            }
        }
    });
    
    // Save to history
    if (Object.keys(generatedHashes).length > 0) {
        saveToHistory(text, generatedHashes, 'text');
    }
}

// Handle file upload
function handleFileUpload() {
    console.log('handleFileUpload called');
    if (!elements.fileInput || !elements.fileInfo || !elements.generateBtn) {
        console.error('File upload elements not found');
        return;
    }
    
    const file = elements.fileInput.files[0];
    if (file) {
        console.log('File selected:', file.name);
        
        // Check file size limit (50MB)
        const maxFileSize = 50 * 1024 * 1024; // 50MB in bytes
        if (file.size > maxFileSize) {
            alert(`File size (${formatFileSize(file.size)}) exceeds the maximum limit of 50MB. Please select a smaller file.`);
            
            // Clear the file input
            elements.fileInput.value = '';
            
            // Reset file info display
            elements.fileInfo.innerHTML = `
                <i class="fas fa-file"></i>
                <span>No file selected</span>
            `;
            elements.generateBtn.disabled = true;
            return;
        }
        
        // Clear text input when file is selected
        if (elements.textInput) {
            elements.textInput.value = '';
        }
        
        elements.fileInfo.innerHTML = `
            <i class="fas fa-file"></i>
            <span>${file.name} (${formatFileSize(file.size)})</span>
        `;
        elements.generateBtn.disabled = false;
    } else {
        elements.fileInfo.innerHTML = `
            <i class="fas fa-file"></i>
            <span>No file selected</span>
        `;
        elements.generateBtn.disabled = true;
    }
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Generate hashes from file
async function generateFileHashes() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select a file first.');
        return;
    }
    
    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
        alert('File size exceeds 50MB limit. Please select a smaller file.');
        return;
    }

    // Show loading popup
    showLoadingPopup();
    
    // Reset progress
    completedHashes = 0;
    
    try {
        const arrayBuffer = await file.arrayBuffer();
        const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
        
        // Generate first 5 hashes quickly (MD5, SHA-1, SHA-224, SHA-256, SHA-512)
        const fastHashTypes = ['md5', 'sha1', 'sha224', 'sha256', 'sha512'];
        const generatedHashes = {};
        
        fastHashTypes.forEach((type, index) => {
            setTimeout(() => {
                try {
                    let hash;
                    
                    switch(type) {
                        case 'md5':
                            hash = CryptoJS.MD5(wordArray).toString();
                            break;
                        case 'sha1':
                            hash = CryptoJS.SHA1(wordArray).toString();
                            break;
                        case 'sha224':
                            hash = CryptoJS.SHA224(wordArray).toString();
                            break;
                        case 'sha256':
                            hash = CryptoJS.SHA256(wordArray).toString();
                            break;
                        case 'sha512':
                            hash = CryptoJS.SHA512(wordArray).toString();
                            break;
                    }
                    
                    if (elements.outputs[type]) {
                        elements.outputs[type].textContent = hash;
                    }
                    
                    generatedHashes[type] = hash;
                    incrementHashProgress();
                    
        } catch (error) {
                    console.error(`Error generating ${type} hash:`, error);
                    if (elements.outputs[type]) {
                        elements.outputs[type].textContent = `Error generating ${type.toUpperCase()} hash`;
                    }
                    incrementHashProgress();
                }
                
                // Save to history when all hashes are complete
                if (Object.keys(generatedHashes).length === 5) {
                    saveToHistory(file.name, generatedHashes, 'file');
                }
            }, index * 5); // Very fast for all 5 hashes
        });
        
    } catch (error) {
        console.error('Error reading file:', error);
        hideLoadingPopup();
        alert('Error reading file. Please try again.');
    }
}

// Copy hash to clipboard
function copyHash(elementId) {
    console.log('copyHash called for:', elementId);
    const element = document.getElementById(elementId);
    if (!element) {
        console.error('Element not found:', elementId);
        return;
    }
    
    const text = element.textContent;
    console.log('Text to copy:', text);
    
    if (text.includes('will appear here') || text === 'Please enter some text...') {
        console.log('No valid hash to copy');
        return;
    }

    const copyBtn = element.closest('.hash-card').querySelector('.copy-btn i');
    if (!copyBtn) {
        console.error('Copy button not found');
        return;
    }

    // Create temporary textarea
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'fixed';
    textArea.style.left = '0';
    textArea.style.top = '0';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();

    if (navigator.userAgent.match(/ipad|iphone|ipod/i)) {
        textArea.setSelectionRange(0, textArea.value.length);
    }

    let copySuccess = false;
    
    // Try Clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showCopySuccess(copyBtn);
            copySuccess = true;
        }).catch(() => {
            try {
                copySuccess = document.execCommand('copy');
                if (copySuccess) {
                    showCopySuccess(copyBtn);
                } else {
                    showCopyError(copyBtn);
                    fallbackPrompt(text);
                }
            } catch (err) {
                showCopyError(copyBtn);
                fallbackPrompt(text);
            }
        }).finally(() => {
            document.body.removeChild(textArea);
        });
        return;
    } else {
        // Fallback to execCommand
        try {
            copySuccess = document.execCommand('copy');
            if (copySuccess) {
                showCopySuccess(copyBtn);
            } else {
                showCopyError(copyBtn);
                fallbackPrompt(text);
            }
        } catch (err) {
            showCopyError(copyBtn);
            fallbackPrompt(text);
        }
        document.body.removeChild(textArea);
    }
}

// Show copy success
function showCopySuccess(copyBtn) {
    copyBtn.className = 'fas fa-check';
    copyBtn.style.color = 'var(--success)';
    setTimeout(() => {
        copyBtn.className = 'fas fa-copy';
        copyBtn.style.color = '';
    }, 1500);
}

// Show copy error
function showCopyError(copyBtn) {
    copyBtn.className = 'fas fa-times';
    copyBtn.style.color = 'var(--error)';
    setTimeout(() => {
        copyBtn.className = 'fas fa-copy';
        copyBtn.style.color = '';
    }, 1500);
}

// Fallback prompt
function fallbackPrompt(text) {
    window.prompt('Copy the hash value manually:', text);
}

// Toggle FAB menu
function toggleFabMenu() {
    const fabMenu = document.getElementById('fabMenu');
    const fabButton = document.getElementById('fabButton');
    
    if (fabMenu && fabButton) {
        fabMenu.classList.toggle('active');
        
        // Close menu when clicking outside
        if (fabMenu.classList.contains('active')) {
            // Add click outside listener
            setTimeout(() => {
                document.addEventListener('click', closeFabMenuOnClickOutside);
            }, 0);
        } else {
            document.removeEventListener('click', closeFabMenuOnClickOutside);
        }
    }
}

// Close FAB menu when clicking outside
function closeFabMenuOnClickOutside(event) {
    const fabContainer = document.querySelector('.fab-container');
    const fabMenu = document.getElementById('fabMenu');
    
    if (fabContainer && !fabContainer.contains(event.target)) {
        fabMenu.classList.remove('active');
        document.removeEventListener('click', closeFabMenuOnClickOutside);
    }
}

// Compare input hash with generated hash
function compareHashes(hashType) {
    const compareInput = document.getElementById(hashType + 'Compare');
    const compareResult = document.getElementById(hashType + 'Comparison');
    const output = document.getElementById(hashType + 'Output');
    if (!compareInput || !compareResult || !output) return;

    const computedHash = output.textContent.trim().toLowerCase();
    const compareHash = compareInput.value.trim().toLowerCase();

    if (!compareHash) {
        compareResult.innerHTML = '<i class="fas fa-question-circle"></i><span>No comparison yet</span>';
        compareResult.className = 'comparison-result';
        return;
    }

    if (computedHash.includes('will appear here') || computedHash === 'please enter some text...') {
        compareResult.innerHTML = '<i class="fas fa-exclamation-circle"></i><span>Generate a hash first</span>';
        compareResult.className = 'comparison-result';
        return;
    }

    const isMatch = computedHash === compareHash;
    compareResult.innerHTML = `<i class="fas fa-${isMatch ? 'check' : 'times'}-circle"></i><span>Hashes ${isMatch ? 'match!' : 'do not match'}</span>`;
    compareResult.className = `comparison-result ${isMatch ? 'match' : 'mismatch'}`;
}

// Update all hash comparisons
function updateComparisons() {
    Object.keys(hashFunctions).forEach(type => {
        const compareInput = document.getElementById(type + 'Compare');
        if (compareInput && compareInput.value) {
            compareHashes(type);
        }
    });
}

// Set up event listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Text input event listener
    if (elements.textInput) {
        elements.textInput.addEventListener('input', function() {
            // Clear file input when text is entered
            if (elements.fileInput) {
                elements.fileInput.value = '';
            }
            if (elements.fileInfo) {
                elements.fileInfo.innerHTML = '<i class="fas fa-file"></i><span>No file selected</span>';
            }
            if (elements.generateBtn) {
                elements.generateBtn.disabled = true;
            }
            
            generateHashes();
        });
    }

    // File input events
    if (elements.fileInput) {
        elements.fileInput.addEventListener('change', handleFileUpload);
        console.log('File input listeners added');
    }

    // Read More button functionality
    document.querySelectorAll('.read-more-btn').forEach(button => {
        button.addEventListener('click', function() {
            const content = this.previousElementSibling;
            const text = this.querySelector('.read-more-text');
            
            if (content.classList.contains('expanded')) {
                content.classList.remove('expanded');
                text.textContent = 'Read More';
            } else {
                content.classList.add('expanded');
                text.textContent = 'Show Less';
            }
        });
    });

    // Compare input fields
    Object.keys(hashFunctions).forEach(type => {
        const compareInput = document.getElementById(type + 'Compare');
        if (compareInput) {
            compareInput.addEventListener('input', function() {
                compareHashes(type);
            });
        }
    });

    console.log('Event listeners setup complete');
} 

// Loading popup functions
function showLoadingPopup() {
    const overlay = document.getElementById('loadingOverlay');
    const progressText = document.getElementById('loadingProgress');
    const progressFill = document.getElementById('loadingProgressFill');
    
    isGeneratingHashes = true;
    completedHashes = 0;
    
    overlay.style.display = 'flex';
    setTimeout(() => {
        overlay.classList.add('show');
    }, 10);
    
    updateLoadingProgress();
    
    // Add a safety timeout to prevent the popup from getting stuck
    setTimeout(() => {
        if (isGeneratingHashes) {
            console.warn('Loading popup timeout - forcing close');
            hideLoadingPopup();
        }
    }, 10000); // 10 second timeout
}

function hideLoadingPopup() {
    const overlay = document.getElementById('loadingOverlay');
    
    isGeneratingHashes = false;
    completedHashes = 0;
    
    overlay.classList.remove('show');
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 300);
}

function updateLoadingProgress() {
    if (!isGeneratingHashes) return;
    
    const progressText = document.getElementById('loadingProgress');
    const progressFill = document.getElementById('loadingProgressFill');
    
    const percentage = Math.round((completedHashes / totalHashAlgorithms) * 100);
    
    // Simple, professional progress messages
    let message = '';
    if (completedHashes === 0) {
        message = 'Starting...';
    } else if (completedHashes < totalHashAlgorithms) {
        message = `${completedHashes} of ${totalHashAlgorithms} complete`;
    } else {
        message = 'Complete';
    }
    
    progressText.textContent = message;
    progressFill.style.width = `${percentage}%`;
}

function incrementHashProgress() {
    completedHashes++;
    updateLoadingProgress();
    
    if (completedHashes >= totalHashAlgorithms) {
        // Close popup immediately when all hashes are complete
        setTimeout(() => {
            hideLoadingPopup();
        }, 100); // Reduced delay to 100ms for faster response
    }
}

// Save hash to history
function saveToHistory(input, hashes, inputType = 'text') {
    try {
        const history = getHistory();
        const historyItem = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            input: input,
            inputType: inputType,
            hashes: hashes
        };
        
        // Add to beginning of array (most recent first)
        history.unshift(historyItem);
        
        // Limit history size
        if (history.length > MAX_HISTORY_ITEMS) {
            history.splice(MAX_HISTORY_ITEMS);
        }
        
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
        console.error('Error saving to history:', error);
    }
}

// Get history from localStorage
function getHistory() {
    try {
        const history = localStorage.getItem(HISTORY_STORAGE_KEY);
        return history ? JSON.parse(history) : [];
    } catch (error) {
        console.error('Error reading history:', error);
        return [];
    }
}

// Clear all history
function clearHistory() {
    if (confirm('Are you sure you want to clear all hash history? This action cannot be undone.')) {
        try {
            localStorage.removeItem(HISTORY_STORAGE_KEY);
            renderHistory();
            showToast('History cleared successfully');
        } catch (error) {
            console.error('Error clearing history:', error);
            showToast('Error clearing history', 'error');
        }
    }
}

// Export history
function exportHistory() {
    try {
        const history = getHistory();
        if (history.length === 0) {
            showToast('No history to export', 'error');
            return;
        }
        
        const content = JSON.stringify(history, null, 2);
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hash-history-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('History exported successfully');
    } catch (error) {
        console.error('Error exporting history:', error);
        showToast('Error exporting history', 'error');
    }
}

// Show hash history modal
function showHashHistory() {
    const modal = document.getElementById('historyModal');
    const fabMenu = document.getElementById('fabMenu');
    
    // Close FAB menu
    if (fabMenu) {
        fabMenu.classList.remove('active');
    }
    
    // Show modal
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    renderHistory();
}

// Close hash history modal
function closeHashHistory() {
    const modal = document.getElementById('historyModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Render history in modal
function renderHistory() {
    const historyList = document.getElementById('historyList');
    const historyEmpty = document.getElementById('historyEmpty');
    const history = getHistory();
    
    if (history.length === 0) {
        historyList.style.display = 'none';
        historyEmpty.style.display = 'block';
        return;
    }
    
    historyList.style.display = 'block';
    historyEmpty.style.display = 'none';
    
    historyList.innerHTML = history.map(item => {
        const date = new Date(item.timestamp);
        const timeString = date.toLocaleString();
        const inputPreview = item.input.length > 100 ? 
            item.input.substring(0, 100) + '...' : item.input;
        
        const hashesHTML = Object.entries(item.hashes).map(([type, hash]) => `
            <div class="history-hash-item">
                <span class="history-hash-label">${type.toUpperCase()}</span>
                <span class="history-hash-value">${hash}</span>
                <button class="history-hash-copy" onclick="copyHistoryHash('${hash}')" title="Copy hash">
                    <i class="fas fa-copy"></i>
                </button>
            </div>
        `).join('');
        
        return `
            <div class="history-item">
                <div class="history-item-header">
                    <span class="history-item-title">
                        <i class="fas fa-${item.inputType === 'file' ? 'file' : 'keyboard'}"></i>
                        ${item.inputType === 'file' ? 'File Upload' : 'Text Input'}
                    </span>
                    <span class="history-item-time">${timeString}</span>
                </div>
                <div class="history-item-input">${inputPreview}</div>
                <div class="history-hashes">
                    ${hashesHTML}
                </div>
            </div>
        `;
    }).join('');
}

// Copy hash from history
function copyHistoryHash(hash) {
    try {
        navigator.clipboard.writeText(hash).then(() => {
            showToast('Hash copied to clipboard');
        }).catch(() => {
            fallbackPrompt(hash);
        });
    } catch (error) {
        fallbackPrompt(hash);
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10001;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.875rem;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Mobile menu toggle
function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    const menuToggle = document.getElementById('menuToggle');
    const icon = menuToggle.querySelector('i');
    
    navLinks.classList.toggle('show');
    
    if (navLinks.classList.contains('show')) {
        icon.className = 'fas fa-times';
    } else {
        icon.className = 'fas fa-bars';
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    const navLinks = document.getElementById('navLinks');
    const menuToggle = document.getElementById('menuToggle');
    
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove('show');
        const icon = menuToggle.querySelector('i');
        icon.className = 'fas fa-bars';
    }
});

// Theme Toggle Functions
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    const themeToggle = document.getElementById('themeToggle');
    
    if (theme === 'dark') {
        themeToggle.textContent = 'Light Mode';
        themeToggle.title = 'Switch to light mode';
    } else {
        themeToggle.textContent = 'Dark Mode';
        themeToggle.title = 'Switch to dark mode';
    }
}

function exportHashes(format) {
    // Close the FAB menu
    const fabMenu = document.getElementById('fabMenu');
    if (fabMenu) {
        fabMenu.classList.remove('active');
        document.removeEventListener('click', closeFabMenuOnClickOutside);
    }
    
    // Original export logic
    const hashes = {};
    const hashTypes = ['md5', 'sha1', 'sha224', 'sha256', 'sha512'];
    
    hashTypes.forEach(type => {
        const outputElement = elements.outputs[type];
        if (outputElement && outputElement.textContent && !outputElement.textContent.includes('will appear here') && !outputElement.textContent.includes('Please enter')) {
            hashes[type] = outputElement.textContent;
        }
    });
    
    if (Object.keys(hashes).length === 0) {
        alert('No hashes to export. Please generate some hashes first.');
        return;
    }
    
    let content = '';
    let filename = 'hashes';
    
    if (format === 'txt') {
        content = Object.entries(hashes)
            .map(([type, hash]) => `${type.toUpperCase()}: ${hash}`)
            .join('\n');
        filename += '.txt';
    } else if (format === 'json') {
        content = JSON.stringify(hashes, null, 2);
        filename += '.json';
    } else if (format === 'pdf') {
        // Generate PDF using jsPDF
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Set title
            doc.setFontSize(20);
            doc.setFont('helvetica', 'bold');
            doc.text('Cryptographic Hash Report', 20, 30);
            
            // Add timestamp
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 45);
            
            // Add hash results
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('Hash Results:', 20, 65);
            
            let yPosition = 80;
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            
            Object.entries(hashes).forEach(([type, hash]) => {
                const hashType = type.toUpperCase();
                const hashValue = hash;
                
                // Check if we need a new page
                if (yPosition > 250) {
                    doc.addPage();
                    yPosition = 20;
                }
                
                // Add hash type
                doc.setFont('helvetica', 'bold');
                doc.text(`${hashType}:`, 20, yPosition);
                
                // Add hash value (with word wrapping)
                doc.setFont('helvetica', 'normal');
                const hashLines = doc.splitTextToSize(hashValue, 170);
                doc.text(hashLines, 20, yPosition + 7);
                
                yPosition += 20 + (hashLines.length * 5);
            });
            
            // Add footer
            doc.setFontSize(10);
            doc.setFont('helvetica', 'italic');
            doc.text('Generated by HashGen - Cryptographic Hash Generator', 20, 280);
            
            // Save the PDF
            doc.save('hashes.pdf');
            return;
        } catch (error) {
            console.error('PDF generation error:', error);
            alert('Error generating PDF. Please try again.');
            return;
        }
    }
    
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
} 