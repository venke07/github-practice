/**
 * Fetches and parses the .env file from the root directory.
 * @returns {Promise<Object>} An object containing the environment variables.
 */
export async function loadEnv() {
    try {
        const response = await fetch('.env');
        if (!response.ok) {
            console.warn('.env file not found or could not be loaded. Status:', response.status);
            return {};
        }

        const text = await response.text();
        const env = {};

        text.split('\n').forEach(line => {
            // Ignore comments and empty lines
            if (!line || line.startsWith('#')) return;

            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                const value = valueParts.join('=').trim();
                env[key.trim()] = value;
            }
        });

        return env;
    } catch (error) {
        console.error('Error loading .env file:', error);
        return {};
    }
}
