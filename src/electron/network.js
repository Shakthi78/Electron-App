const { exec } = require('child_process');
const os = require('os');

const getNetworkInfo = () => {
    return new Promise((resolve) => {
        // Step 1: Check Wi-Fi using netsh
        console.log('Checking Wi-Fi connection...');
        exec('netsh wlan show interfaces', (err, stdout, stderr) => {
            if (err || stderr) {
                console.log('No Wi-Fi detected or error:', err || stderr);
                // Step 2: Fall back to Ethernet check
                const interfaces = os.networkInterfaces();
                // console.log('Network interfaces:', interfaces);

                let ethernetFound = false;
                for (const [name, nets] of Object.entries(interfaces)) {
                    if (nets) {
                        const activeNet = nets.find(net => net.family === 'IPv4' && !net.internal);
                        if (activeNet) {
                            // console.log('Ethernet detected:', name);
                            resolve({
                                type: 'Ethernet',
                                name: name // Use interface name (e.g., "Ethernet", "Local Area Connection")
                            });
                            ethernetFound = true;
                            break;
                        }
                    }
                }

                if (!ethernetFound) {
                    console.log('No active network connection');
                    resolve({
                        type: 'None',
                        name: 'Not connected'
                    });
                }
            } else {
                const lines = stdout.split('\n');
                const ssidLine = lines.find(line => line.includes('SSID'));
                const stateLine = lines.find(line => line.includes('State'));

                if (ssidLine && stateLine && stateLine.includes('connected')) {
                    const ssid = ssidLine.split(':')[1]?.trim();
                    console.log('Wi-Fi detected. SSID:', ssid);
                    resolve({
                        type: 'Wi-Fi',
                        name: ssid || 'Unknown Wi-Fi'
                    });
                } else {
                    console.log('Wi-Fi adapter found but not connected');
                    // Check Ethernet as fallback
                    const interfaces = os.networkInterfaces();
                    let ethernetFound = false;
                    for (const [name, nets] of Object.entries(interfaces)) {
                        if (nets) {
                            const activeNet = nets.find(net => net.family === 'IPv4' && !net.internal);
                            if (activeNet) {
                                console.log('Ethernet detected:', name);
                                resolve({
                                    type: 'Ethernet',
                                    name: name
                                });
                                ethernetFound = true;
                                break;
                            }
                        }
                    }

                    if (!ethernetFound) {
                        resolve({
                            type: 'None',
                            name: 'Not connected'
                        });
                    }
                }
            }
        });
    });
};

module.exports = getNetworkInfo