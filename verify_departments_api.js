

const BASE_URL = 'http://localhost:3000/api';
let token = '';

async function login() {
    console.log('Logging in...');
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: 'verify_admin@test.com',
            password: 'password123' // Assuming default or reset password
        })
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Login failed: ${response.status} ${response.statusText} - ${text}`);
    }

    const data = await response.json();
    token = data.token;
    console.log('Login successful');
}

async function createDepartment() {
    console.log('Creating department...');
    const response = await fetch(`${BASE_URL}/departments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name: 'Test Department',
            description: 'Created via verification script',
            manager_id: null // Optional
        })
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Create department failed: ${err}`);
    }

    const data = await response.json();
    console.log('Department created:', data.id);
    return data.id;
}

async function updateDepartment(id) {
    console.log('Updating department...');
    const response = await fetch(`${BASE_URL}/departments/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            name: 'Updated Test Department',
            description: 'Updated description'
        })
    });

    if (!response.ok) {
        throw new Error(`Update department failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Department updated:', data.name);
}

async function deleteDepartment(id) {
    console.log('Deleting department...');
    const response = await fetch(`${BASE_URL}/departments/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Delete department failed: ${response.statusText}`);
    }

    console.log('Department deleted successfully');
}

async function verify() {
    try {
        await login();
        const deptId = await createDepartment();
        await updateDepartment(deptId);
        await deleteDepartment(deptId);
        console.log('Verification passed!');
    } catch (error) {
        console.log('Verification failed:', error.message);
        process.exit(1);
    }
}

verify();
