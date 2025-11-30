import { Assessment } from '../models/Assessment.js';
import { AssessmentQuestion } from '../models/AssessmentQuestion.js';

/**
 * Get all assessments
 */
export const getAssessments = async (req, res, next) => {
  try {
    const { page, limit, search, status, type } = req.query;
    const result = await Assessment.findAll(
      parseInt(page) || 1,
      parseInt(limit) || 20,
      search || '',
      status || 'all',
      type || 'all'
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
 * Get assessment by ID
 */
export const getAssessmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const assessment = await Assessment.findById(id);
    if (!assessment) {
      return res.status(404).json({ success: false, error: 'Assessment not found' });
    }

    // Fetch questions
    const questions = await AssessmentQuestion.findAllByAssessment(id);
    assessment.questions = questions;

    res.json({ success: true, assessment });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new assessment
 */
export const createAssessment = async (req, res, next) => {
  try {
    const {
      course_id,
      lesson_id,
      title,
      description,
      type,
      passing_score,
      time_limit_minutes,
      max_attempts,
      is_required,
      randomize_questions,
      show_results,
      status
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }

    const assessment = await Assessment.create({
      course_id,
      lesson_id,
      title,
      description,
      type,
      passing_score,
      time_limit_minutes,
      max_attempts,
      is_required,
      randomize_questions,
      show_results,
      status
    });

    res.status(201).json({ success: true, assessment });
  } catch (error) {
    next(error);
  }
};

/**
 * Update assessment
 */
export const updateAssessment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const assessment = await Assessment.update(id, updates);
    if (!assessment) {
      return res.status(404).json({ success: false, error: 'Assessment not found' });
    }

    res.json({ success: true, assessment });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete assessment
 */
export const deleteAssessment = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Assessment.delete(id);
    res.json({ success: true, message: 'Assessment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Question Controllers
 */

/**
 * Get all questions for an assessment
 */
export const getQuestions = async (req, res, next) => {
  try {
    const { assessmentId } = req.params;
    const questions = await AssessmentQuestion.findAllByAssessment(assessmentId);
    res.json({ success: true, questions });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new question
 */
export const createQuestion = async (req, res, next) => {
  try {
    const { assessmentId } = req.params;
    const questionData = {
      ...req.body,
      assessment_id: assessmentId
    };

    if (!questionData.question_text) {
      return res.status(400).json({ success: false, error: 'Question text is required' });
    }

    const question = await AssessmentQuestion.create(questionData, req.user.id);
    res.status(201).json({ success: true, question });
  } catch (error) {
    next(error);
  }
};

/**
 * Update question
 */
export const updateQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const updates = {
      ...req.body,
      userId: req.user.id
    };

    const question = await AssessmentQuestion.update(questionId, updates);
    if (!question) {
      return res.status(404).json({ success: false, error: 'Question not found' });
    }

    res.json({ success: true, question });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete question
 */
export const deleteQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    await AssessmentQuestion.delete(questionId);
    res.json({ success: true, message: 'Question deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Reorder questions
 */
export const reorderQuestions = async (req, res, next) => {
  try {
    const { assessmentId } = req.params;
    const { questionOrders } = req.body; // Array of { id, order_index }

    if (!Array.isArray(questionOrders)) {
      return res.status(400).json({ success: false, error: 'questionOrders must be an array' });
    }

    await AssessmentQuestion.reorder(assessmentId, questionOrders);
    res.json({ success: true, message: 'Questions reordered successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Publish question
 */
export const publishQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const question = await AssessmentQuestion.publish(questionId, req.user.id);
    if (!question) {
      return res.status(404).json({ success: false, error: 'Question not found' });
    }
    res.json({ success: true, question });
  } catch (error) {
    next(error);
  }
};

/**
 * Unpublish question
 */
export const unpublishQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const question = await AssessmentQuestion.unpublish(questionId, req.user.id);
    if (!question) {
      return res.status(404).json({ success: false, error: 'Question not found' });
    }
    res.json({ success: true, question });
  } catch (error) {
    next(error);
  }
};

/**
 * Get question history
 */
export const getQuestionHistory = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const history = await AssessmentQuestion.getHistory(questionId);
    res.json({ success: true, history });
  } catch (error) {
    next(error);
  }
};

