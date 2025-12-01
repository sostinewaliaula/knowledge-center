import { Exam } from '../models/Exam.js';
import { ExamQuestion } from '../models/ExamQuestion.js';

/**
 * Get all exams
 */
export const getExams = async (req, res, next) => {
  try {
    const { page, limit, search, status } = req.query;
    const result = await Exam.findAll(
      parseInt(page) || 1,
      parseInt(limit) || 20,
      search || '',
      status || 'all'
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
 * Get exam by ID
 */
export const getExamById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exam = await Exam.findById(id);
    if (!exam) {
      return res.status(404).json({ success: false, error: 'Exam not found' });
    }

    // Fetch questions
    const questions = await ExamQuestion.findAllByExam(id);
    exam.questions = questions;

    res.json({ success: true, exam });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new exam
 */
export const createExam = async (req, res, next) => {
  try {
    const {
      course_id,
      lesson_id,
      title,
      description,
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

    const exam = await Exam.create({
      course_id,
      lesson_id,
      title,
      description,
      passing_score,
      time_limit_minutes,
      max_attempts,
      is_required,
      randomize_questions,
      show_results,
      status
    });

    res.status(201).json({ success: true, exam });
  } catch (error) {
    next(error);
  }
};

/**
 * Update exam
 */
export const updateExam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const exam = await Exam.update(id, updates);
    if (!exam) {
      return res.status(404).json({ success: false, error: 'Exam not found' });
    }

    res.json({ success: true, exam });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete exam
 */
export const deleteExam = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Exam.delete(id);
    res.json({ success: true, message: 'Exam deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Get exams by course ID
 */
export const getExamsByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const exams = await Exam.findByCourseId(courseId);
    res.json({ success: true, exams });
  } catch (error) {
    next(error);
  }
};

/**
 * Get exams by lesson ID
 */
export const getExamsByLesson = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const exams = await Exam.findByLessonId(lessonId);
    res.json({ success: true, exams });
  } catch (error) {
    next(error);
  }
};

/**
 * Question Controllers
 */

/**
 * Get all questions for an exam
 */
export const getQuestions = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const questions = await ExamQuestion.findAllByExam(examId);
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
    const { examId } = req.params;
    const questionData = {
      ...req.body,
      exam_id: examId
    };

    if (!questionData.question_text) {
      return res.status(400).json({ success: false, error: 'Question text is required' });
    }

    const question = await ExamQuestion.create(questionData, req.user.id);
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

    const question = await ExamQuestion.update(questionId, updates);
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
    await ExamQuestion.delete(questionId);
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
    const { examId } = req.params;
    const { questionOrders } = req.body; // Array of { id, order_index }

    if (!Array.isArray(questionOrders)) {
      return res.status(400).json({ success: false, error: 'questionOrders must be an array' });
    }

    await ExamQuestion.reorder(examId, questionOrders);
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
    const question = await ExamQuestion.publish(questionId, req.user.id);
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
    const question = await ExamQuestion.unpublish(questionId, req.user.id);
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
    const history = await ExamQuestion.getHistory(questionId);
    res.json({ success: true, history });
  } catch (error) {
    next(error);
  }
};

