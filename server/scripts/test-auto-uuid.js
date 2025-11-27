import pool from '../config/database.js';
import { randomUUID } from 'crypto';

async function testAutoUUID() {
  try {
    const connection = await pool.getConnection();
    console.log('🧪 Testing automatic UUID generation...\n');

    // Test 1: Insert without providing id (should auto-generate)
    console.log('Test 1: Inserting role WITHOUT providing id...');
    try {
      await connection.query(`
        INSERT INTO roles (name, display_name, description, is_system_role) 
        VALUES (?, ?, ?, ?)
      `, ['test-role-auto', 'Test Role Auto', 'Auto-generated UUID test', false]);
      
      const [newRole] = await connection.query(
        'SELECT id, name FROM roles WHERE name = ?',
        ['test-role-auto']
      );
      
      if (newRole.length > 0) {
        const id = newRole[0].id;
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        console.log(`  ✅ Success! Auto-generated ID: ${id}`);
        console.log(`  ✅ Is valid UUID: ${isUUID ? 'Yes' : 'No'}`);
        
        // Clean up
        await connection.query('DELETE FROM roles WHERE name = ?', ['test-role-auto']);
      }
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
      if (error.message.includes('Field \'id\' doesn\'t have a default value')) {
        console.log('  ⚠️  Table does not have DEFAULT (UUID()) - UUIDs must be provided');
      }
    }

    // Test 2: Insert with explicit id (should still work)
    console.log('\nTest 2: Inserting role WITH explicit id...');
    const explicitId = randomUUID();
    await connection.query(`
      INSERT INTO roles (id, name, display_name, description, is_system_role) 
      VALUES (?, ?, ?, ?, ?)
    `, [explicitId, 'test-role-explicit', 'Test Role Explicit', 'Explicit UUID test', false]);
    
    const [explicitRole] = await connection.query(
      'SELECT id, name FROM roles WHERE id = ?',
      [explicitId]
    );
    
    if (explicitRole.length > 0) {
      console.log(`  ✅ Success! Used explicit ID: ${explicitId}`);
      // Clean up
      await connection.query('DELETE FROM roles WHERE id = ?', [explicitId]);
    }

    console.log('\n✅ Testing complete!');
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testAutoUUID();

