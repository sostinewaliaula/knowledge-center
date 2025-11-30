import { Template } from '../models/Template.js';
import { Course } from '../models/Course.js';
import { Module } from '../models/Module.js';
import { Lesson } from '../models/Lesson.js';
import { LearningPath } from '../models/LearningPath.js';

/**
 * Get all templates
 */
export const getTemplates = async (req, res, next) => {
  try {
    const { page, limit, search, type, isPublic } = req.query;
    const result = await Template.findAll(
      parseInt(page) || 1,
      parseInt(limit) || 20,
      search || '',
      type || 'all',
      isPublic !== undefined ? isPublic === 'true' : null
    );
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get template by ID
 */
export const getTemplateById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const template = await Template.findById(id);
    if (!template) {
      return res.status(404).json({ success: false, error: 'Template not found' });
    }
    res.json({ success: true, template });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new template
 */
export const createTemplate = async (req, res, next) => {
  try {
    const { name, description, type, template_data, thumbnail_url, is_public, source_id } = req.body;
    
    if (!name || !type) {
      return res.status(400).json({ success: false, error: 'Name and type are required' });
    }

    let templateData = template_data;

    // If source_id is provided, create template from existing item
    if (source_id && !template_data) {
      switch (type) {
        case 'course':
          const course = await Course.findById(source_id);
          if (!course) {
            return res.status(404).json({ success: false, error: 'Course not found' });
          }
          const modules = await Module.findByCourseId(source_id);
          const modulesWithLessons = await Promise.all(
            modules.map(async (module) => {
              const lessons = await Lesson.findByModuleId(module.id);
              return {
                ...module,
                lessons: lessons.map(l => ({
                  title: l.title,
                  description: l.description,
                  content_type: l.content_type,
                  content_url: l.content_url,
                  content_text: l.content_text,
                  duration_minutes: l.duration_minutes,
                  order_index: l.order_index,
                  is_required: l.is_required,
                  is_preview: l.is_preview
                }))
              };
            })
          );
          templateData = {
            course: {
              title: course.title,
              description: course.description,
              short_description: course.short_description,
              category_id: course.category_id,
              difficulty_level: course.difficulty_level,
              language: course.language
            },
            modules: modulesWithLessons.map(m => ({
              title: m.title,
              description: m.description,
              order_index: m.order_index,
              is_required: m.is_required,
              lessons: m.lessons
            }))
          };
          break;

        case 'learning-path':
          const learningPath = await LearningPath.findById(source_id);
          if (!learningPath) {
            return res.status(404).json({ success: false, error: 'Learning path not found' });
          }
          templateData = {
            learning_path: {
              title: learningPath.title,
              description: learningPath.description,
              category_id: learningPath.category_id,
              estimated_duration_hours: learningPath.estimated_duration_hours
            },
            courses: learningPath.courses || []
          };
          break;

        default:
          return res.status(400).json({ success: false, error: 'Creating template from source is only supported for courses and learning paths' });
      }
    }

    if (!templateData) {
      return res.status(400).json({ success: false, error: 'Template data is required' });
    }

    const template = await Template.create({
      name,
      description,
      type,
      template_data: templateData,
      thumbnail_url,
      is_public: is_public || false,
      created_by: req.user.id
    });

    res.status(201).json({ success: true, template });
  } catch (error) {
    next(error);
  }
};

/**
 * Update template
 */
export const updateTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const template = await Template.update(id, updates);
    if (!template) {
      return res.status(404).json({ success: false, error: 'Template not found' });
    }

    res.json({ success: true, template });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete template
 */
export const deleteTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Template.delete(id);
    res.json({ success: true, message: 'Template deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Use template to create a new item
 */
export const useTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const template = await Template.findById(id);
    if (!template) {
      return res.status(404).json({ success: false, error: 'Template not found' });
    }

    // Increment usage count
    await Template.incrementUsageCount(id);

    let result = {};

    switch (template.type) {
      case 'course':
        // Create course from template
        const courseData = template.template_data.course || {};
        const course = await Course.create({
          title: title || courseData.title || 'New Course',
          description: description || courseData.description,
          short_description: courseData.short_description,
          category_id: courseData.category_id,
          instructor_id: req.user.id,
          difficulty_level: courseData.difficulty_level || 'beginner',
          language: courseData.language || 'en',
          status: 'draft'
        });

        // Create modules and lessons
        if (template.template_data.modules) {
          for (const moduleData of template.template_data.modules) {
            const module = await Module.create({
              course_id: course.id,
              title: moduleData.title,
              description: moduleData.description,
              order_index: moduleData.order_index,
              is_required: moduleData.is_required !== undefined ? moduleData.is_required : true
            });

            // Create lessons
            if (moduleData.lessons) {
              for (const lessonData of moduleData.lessons) {
                await Lesson.create({
                  module_id: module.id,
                  title: lessonData.title,
                  description: lessonData.description,
                  content_type: lessonData.content_type || 'text',
                  content_url: lessonData.content_url,
                  content_text: lessonData.content_text,
                  duration_minutes: lessonData.duration_minutes || 0,
                  order_index: lessonData.order_index,
                  is_required: lessonData.is_required !== undefined ? lessonData.is_required : true,
                  is_preview: lessonData.is_preview || false
                });
              }
            }
          }
        }

        result = { course: await Course.findById(course.id) };
        break;

      case 'learning-path':
        // Create learning path from template
        const pathData = template.template_data.learning_path || {};
        const learningPath = await LearningPath.create({
          title: title || pathData.title || 'New Learning Path',
          description: description || pathData.description,
          category_id: pathData.category_id,
          estimated_duration_hours: pathData.estimated_duration_hours || 0,
          status: 'draft',
          created_by: req.user.id
        });

        // Add courses to learning path
        if (template.template_data.courses) {
          for (let i = 0; i < template.template_data.courses.length; i++) {
            const courseRef = template.template_data.courses[i];
            // Note: This assumes course IDs in template are still valid
            // In a real scenario, you might want to validate or create new courses
            if (courseRef.id) {
              await LearningPath.addCourseToPath(
                learningPath.id,
                courseRef.id,
                courseRef.is_required !== undefined ? courseRef.is_required : true
              );
            }
          }
        }

        result = { learningPath: await LearningPath.findById(learningPath.id) };
        break;

      default:
        return res.status(400).json({ success: false, error: 'Template type not supported for instantiation' });
    }

    res.status(201).json({
      success: true,
      message: `${template.type} created from template successfully`,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

