import axios from 'axios';

const API_URL = 'http://localhost:3001';

async function verify() {
    try {
        console.log('Verifying System Data Access...');

        // 1. Verify Login
        console.log('1. Attempting Login...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'admin@example.com',
            password: 'admin123'
        });

        if (loginRes.status === 201 || loginRes.status === 200) {
            console.log('✅ Login Successful');
        } else {
            console.error('❌ Login Failed:', loginRes.status);
            return;
        }

        const token = loginRes.data.access_token;
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // 2. Verify Sources
        console.log('2. Fetching Sources...');
        const sourcesRes = await axios.get(`${API_URL}/production/sources`, config);
        if (sourcesRes.data.length > 0) {
            console.log(`✅ Sources Verified: Found ${sourcesRes.data.length} sources`);
            console.log('   - Sample:', sourcesRes.data[0].name);
        } else {
            console.error('❌ No Sources Found');
        }

        // 3. Verify Reservoirs
        console.log('3. Fetching Reservoirs...');
        const reservationsRes = await axios.get(`${API_URL}/distribution/reservoirs`, config);
        if (reservationsRes.data.length > 0) {
            console.log(`✅ Reservoirs Verified: Found ${reservationsRes.data.length} reservoirs`);
            console.log('   - Sample:', reservationsRes.data[0].name);
        } else {
            console.error('❌ No Reservoirs Found');
        }

        // 4. Verify Tariffs
        console.log('4. Fetching Tariffs...');
        const tariffsRes = await axios.get(`${API_URL}/billing/tariffs`, config);
        if (tariffsRes.data.length > 0) {
            console.log(`✅ Tariffs Verified: Found ${tariffsRes.data.length} tariffs`);
            console.log('   - Sample category:', tariffsRes.data[0].category);
        } else {
            console.error('❌ No Tariffs Found');
        }

        console.log('\nVerification Complete!');

    } catch (error: any) {
        if (error.response) {
            console.error('❌ API Error:', error.response.status, error.response.data);
        } else {
            console.error('❌ Connection Error:', error.message);
        }
    }
}

verify();
