const electronInstaller = require('electron-winstaller');

async function createInstaller() {
    try {
        console.log('Creating installer...');

        await electronInstaller.createWindowsInstaller({
            appDirectory: './dist/Guacamole Wrapper-win32-x64',
            outputDirectory: './dist/installer',
            authors: 'Saarthaksr7',
            exe: 'Guacamole Wrapper.exe',
            setupExe: 'GuacamoleWrapperSetup.exe',
            noMsi: true,
            title: 'Guacamole Wrapper'
        });

        console.log('✅ Installer created successfully!');
        console.log('Location: dist/installer/GuacamoleWrapperSetup.exe');
    } catch (error) {
        console.error('❌ Error creating installer:', error);
        process.exit(1);
    }
}

createInstaller();
