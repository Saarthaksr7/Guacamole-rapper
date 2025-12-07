// Load current settings when window opens
async function loadSettings() {
    try {
        const settings = await window.electronAPI.getSettings();

        document.getElementById('target-url').value = settings.targetUrl;
        document.getElementById('hardware-acceleration').checked = settings.hardwareAcceleration;
        document.getElementById('network-priority').checked = settings.networkPriority;

        // Store original hardware acceleration value
        window.originalHardwareAcceleration = settings.hardwareAcceleration;
    } catch (error) {
        console.error('Failed to load settings:', error);
        showNotification('Failed to load settings', 'error');
    }
}

// Handle form submission
document.getElementById('settings-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const targetUrl = document.getElementById('target-url').value.trim();
    const hardwareAcceleration = document.getElementById('hardware-acceleration').checked;
    const networkPriority = document.getElementById('network-priority').checked;

    // Validate URL
    if (!isValidUrl(targetUrl)) {
        showNotification('Please enter a valid URL', 'error');
        return;
    }

    try {
        const result = await window.electronAPI.saveSettings({
            targetUrl,
            hardwareAcceleration,
            networkPriority
        });

        if (result.success) {
            showNotification('Settings saved successfully!', 'success');

            if (result.restartRequired) {
                // Show restart section
                document.getElementById('restart-section').classList.remove('hidden');
                showNotification('Restart required for hardware acceleration change', 'warning');
            } else {
                // Close settings window after a short delay
                setTimeout(() => {
                    window.close();
                }, 1000);
            }
        }
    } catch (error) {
        console.error('Failed to save settings:', error);
        showNotification('Failed to save settings', 'error');
    }
});

// Handle cancel button
document.getElementById('cancel-btn').addEventListener('click', () => {
    window.close();
});

// Handle restart button
document.getElementById('restart-btn').addEventListener('click', async () => {
    await window.electronAPI.restartApp();
});

// Handle repository link
document.getElementById('repo-link').addEventListener('click', async (e) => {
    e.preventDefault();
    await window.electronAPI.openExternal('https://github.com/Saarthaksr7/Guacamole-rapper');
});

// Monitor hardware acceleration toggle for restart warning
document.getElementById('hardware-acceleration').addEventListener('change', (e) => {
    const changed = e.target.checked !== window.originalHardwareAcceleration;
    const warning = document.getElementById('restart-warning');

    if (changed) {
        warning.classList.remove('hidden');
    } else {
        warning.classList.add('hidden');
    }
});

// Utility function to validate URL
function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

// Utility function to show notifications
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Fade in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Initialize
loadSettings();
