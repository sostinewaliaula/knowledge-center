import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const checkTableStructure = async () => {
  try {
    const connection = await pool.getConnection();
    
    console.log('\n🔍 Checking Courses Table Structure\n');
    console.log('═══════════════════════════════════════\n');
    
    const [columns] = await connection.query('DESCRIBE courses');
    
    console.log('Courses Table Columns:\n');
    columns.forEach(col => {
      console.log(`  ${col.Field.padEnd(25)} - ${col.Type.padEnd(20)} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `(${col.Key})` : ''}`);
    });
    
    console.log('\n═══════════════════════════════════════\n');
    
    // Check if price or currency exist
    const hasPrice = columns.some(col => col.Field === 'price');
    const hasCurrency = columns.some(col => col.Field === 'currency');
    
    if (hasPrice || hasCurrency) {
      console.log('❌ ERROR: price or currency columns still exist!');
      if (hasPrice) console.log('   - Found: price column');
      if (hasCurrency) console.log('   - Found: currency column');
    } else {
      console.log('✅ SUCCESS: price and currency columns have been removed!');
      console.log('   Courses table is now for internal training only (no pricing)\n');
    }
    
    connection.release();
    process.exit(hasPrice || hasCurrency ? 1 : 0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
};

checkTableStructure();

