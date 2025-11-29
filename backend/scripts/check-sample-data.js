import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const checkSampleData = async () => {
  try {
    const connection = await pool.getConnection();
    
    console.log('\n📊 Sample Data Overview\n');
    console.log('═══════════════════════════════════════\n');
    
    // Count tables
    const [roles] = await connection.query('SELECT COUNT(*) as count FROM roles');
    const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
    const [categories] = await connection.query('SELECT COUNT(*) as count FROM categories');
    const [tags] = await connection.query('SELECT COUNT(*) as count FROM tags');
    const [courses] = await connection.query('SELECT COUNT(*) as count FROM courses');
    const [departments] = await connection.query('SELECT COUNT(*) as count FROM departments');
    const [userGroups] = await connection.query('SELECT COUNT(*) as count FROM user_groups');
    const [learningPaths] = await connection.query('SELECT COUNT(*) as count FROM learning_paths');
    const [enrollments] = await connection.query('SELECT COUNT(*) as count FROM enrollments');
    const [badges] = await connection.query('SELECT COUNT(*) as count FROM badges');
    const [notifications] = await connection.query('SELECT COUNT(*) as count FROM notifications');
    const [compliance] = await connection.query('SELECT COUNT(*) as count FROM compliance_requirements');
    
    console.log('Data Summary:');
    console.log(`  ✅ Roles: ${roles[0].count}`);
    console.log(`  ✅ Users: ${users[0].count}`);
    console.log(`  ✅ Categories: ${categories[0].count}`);
    console.log(`  ✅ Tags: ${tags[0].count}`);
    console.log(`  ✅ Courses: ${courses[0].count}`);
    console.log(`  ✅ Departments: ${departments[0].count}`);
    console.log(`  ✅ User Groups: ${userGroups[0].count}`);
    console.log(`  ✅ Learning Paths: ${learningPaths[0].count}`);
    console.log(`  ✅ Enrollments: ${enrollments[0].count}`);
    console.log(`  ✅ Badges: ${badges[0].count}`);
    console.log(`  ✅ Notifications: ${notifications[0].count}`);
    console.log(`  ✅ Compliance Requirements: ${compliance[0].count}\n`);
    
    // Show some courses
    console.log('Sample Courses:\n');
    const [sampleCourses] = await connection.query(`
      SELECT c.title, c.slug, cat.name as category
      FROM courses c
      LEFT JOIN categories cat ON c.category_id = cat.id
      ORDER BY c.created_at DESC
      LIMIT 10
    `);
    
    sampleCourses.forEach(course => {
      console.log(`  📚 ${course.title}`);
      console.log(`     Category: ${course.category || 'N/A'}\n`);
    });
    
    // Show Oracle-related courses
    console.log('Oracle Product Courses:\n');
    const [oracleCourses] = await connection.query(`
      SELECT c.title, c.slug
      FROM courses c
      WHERE c.title LIKE '%Oracle%' OR c.title LIKE '%Toad%' OR c.title LIKE '%WebLogic%' OR c.title LIKE '%JDeveloper%'
      ORDER BY c.title
    `);
    
    oracleCourses.forEach(course => {
      console.log(`  🔷 ${course.title}`);
    });
    
    console.log('\n');
    
    // Show onboarding courses
    console.log('Onboarding Courses:\n');
    const [onboardingCourses] = await connection.query(`
      SELECT c.title, c.slug
      FROM courses c
      LEFT JOIN categories cat ON c.category_id = cat.id
      WHERE cat.slug = 'onboarding' OR c.title LIKE '%Onboarding%'
      ORDER BY c.title
    `);
    
    onboardingCourses.forEach(course => {
      console.log(`  🎓 ${course.title}`);
    });
    
    console.log('\n');
    
    // Show departments
    console.log('Departments:\n');
    const [depts] = await connection.query('SELECT name, description FROM departments ORDER BY name');
    depts.forEach(dept => {
      console.log(`  🏢 ${dept.name}`);
      if (dept.description) {
        console.log(`     ${dept.description.substring(0, 60)}...\n`);
      }
    });
    
    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
};

checkSampleData();

