const API_URL = 'http://localhost:3000/api';

async function verifyMoveLogic() {
    try {
        // 1. Login to get token
        console.log('Logging in...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@caavagroup.com', password: 'password123' })
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.statusText}`);
        const { token } = await loginRes.json();
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        // 2. Create two groups
        console.log('Creating Group A...');
        const groupARes = await fetch(`${API_URL}/user-groups`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ name: 'Test Group A', description: 'Test Group A' })
        });
        const groupA = await groupARes.json();
        console.log('Group A created:', groupA.id);

        console.log('Creating Group B...');
        const groupBRes = await fetch(`${API_URL}/user-groups`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ name: 'Test Group B', description: 'Test Group B' })
        });
        const groupB = await groupBRes.json();
        console.log('Group B created:', groupB.id);

        // 3. Find a user to test with
        const usersRes = await fetch(`${API_URL}/users?limit=1`, { headers });
        const { users } = await usersRes.json();
        const testUser = users[0];
        console.log('Test User:', testUser.id, testUser.name);

        // 4. Add to Group A
        console.log(`Adding user ${testUser.id} to Group A (${groupA.id})...`);
        await fetch(`${API_URL}/user-groups/${groupA.id}/members`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ userId: testUser.id })
        });

        // 5. Verify in Group A
        console.log('Verifying membership in Group A...');
        const membersARes = await fetch(`${API_URL}/user-groups/${groupA.id}/members`, { headers });
        const membersA = await membersARes.json();
        const inA = membersA.some(m => m.id === testUser.id);
        console.log('User in Group A:', inA);
        if (!inA) throw new Error('User failed to join Group A');

        // 6. Add to Group B
        console.log(`Adding user ${testUser.id} to Group B (${groupB.id})...`);
        await fetch(`${API_URL}/user-groups/${groupB.id}/members`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ userId: testUser.id })
        });

        // 7. Verify in Group B AND NOT in Group A
        console.log('Verifying membership in Group B...');
        const membersBRes = await fetch(`${API_URL}/user-groups/${groupB.id}/members`, { headers });
        const membersB = await membersBRes.json();
        const inB = membersB.some(m => m.id === testUser.id);
        console.log('User in Group B:', inB);
        if (!inB) throw new Error('User failed to join Group B');

        console.log('Verifying ABSENCE in Group A...');
        const membersA2Res = await fetch(`${API_URL}/user-groups/${groupA.id}/members`, { headers });
        const membersA2 = await membersA2Res.json();
        const inA2 = membersA2.some(m => m.id === testUser.id);
        console.log('User in Group A:', inA2);
        if (inA2) throw new Error('User was NOT removed from Group A!');

        console.log('SUCCESS: Move logic verified!');

        // Cleanup
        console.log('Cleaning up...');
        await fetch(`${API_URL}/user-groups/${groupA.id}`, { method: 'DELETE', headers });
        await fetch(`${API_URL}/user-groups/${groupB.id}`, { method: 'DELETE', headers });

    } catch (err) {
        console.error('Verification Failed:', err);
        process.exit(1);
    }
}

verifyMoveLogic();
