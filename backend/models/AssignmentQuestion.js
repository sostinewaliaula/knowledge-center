import { query, queryOne } from '../config/database.js';

export class AssignmentQuestion {
  /**
   * Find all questions for an assignment
   */
  static async findAllByAssignment(assignmentId) {
    const sql = `
      SELECT *
      FROM assignment_questions
      WHERE assignment_id = ?
      ORDER BY order_index ASC, created_at ASC
    `;
    const questions = await query(sql, [assignmentId]);

    return questions.map(q => {
      if (q.options && typeof q.options === 'string') {
        try {
          q.options = JSON.parse(q.options);
        } catch {
          q.options = [];
        }
      }
      return q;
    });
  }

  /**
   * Find question by ID
   */
  static async findById(id) {
    const sql = 'SELECT * FROM assignment_questions WHERE id = ?';
    const question = await queryOne(sql, [id]);

    if (question && question.options && typeof question.options === 'string') {
      try {
        question.options = JSON.parse(question.options);
      } catch {
        question.options = [];
      }
    }

    return question;
  }

  /**
   * Create a new question
   * Questions are considered "live" immediately; no draft/publish status.
   */
  static async create(questionData) {
    const {
      assignment_id,
      question_text,
      question_type,
      options,
      correct_answer,
      points,
      order_index,
      explanation
    } = questionData;

    if (!assignment_id || !question_text) {
      throw new Error('assignment_id and question_text are required');
    }

    const optionsJson = options
      ? typeof options === 'string'
        ? options
        : JSON.stringify(options)
      : null;

    // Determine next order_index if not provided
    let order = order_index;
    if (order === undefined || order === null) {
      const maxOrderSql = 'SELECT MAX(order_index) as max_order FROM assignment_questions WHERE assignment_id = ?';
      const maxResult = await queryOne(maxOrderSql, [assignment_id]);
      order = (maxResult?.max_order || 0) + 1;
    }

    const sql = `
      INSERT INTO assignment_questions (
        assignment_id, question_text, question_type, options, correct_answer,
        points, order_index, explanation
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await query(sql, [
      assignment_id,
      question_text,
      question_type || 'multiple_choice',
      optionsJson,
      correct_answer || null,
      points || 1.0,
      order,
      explanation || null
    ]);

    const question = await queryOne(
      'SELECT * FROM assignment_questions WHERE assignment_id = ? AND question_text = ? ORDER BY created_at DESC LIMIT 1',
      [assignment_id, question_text]
    );

    if (question && question.options && typeof question.options === 'string') {
      try {
        question.options = JSON.parse(question.options);
      } catch {
        question.options = [];
      }
    }

    return question;
  }

  /**
   * Update question
   */
  static async update(id, questionData) {
    const updates = [];
    const values = [];

    const allowedFields = [
      'question_text',
      'question_type',
      'options',
      'correct_answer',
      'points',
      'order_index',
      'explanation'
    ];

    for (const field of allowedFields) {
      if (questionData[field] !== undefined) {
        if (field === 'options') {
          const optionsJson = questionData[field]
            ? typeof questionData[field] === 'string'
              ? questionData[field]
              : JSON.stringify(questionData[field])
            : null;
          updates.push(`${field} = ?`);
          values.push(optionsJson);
        } else {
          updates.push(`${field} = ?`);
          values.push(questionData[field]);
        }
      }
    }

    if (updates.length === 0) {
      return await this.findById(id);
    }

    values.push(id);
    const sql = `UPDATE assignment_questions SET ${updates.join(', ')} WHERE id = ?`;
    await query(sql, values);

    return await this.findById(id);
  }

  /**
   * Delete question
   */
  static async delete(id) {
    const sql = 'DELETE FROM assignment_questions WHERE id = ?';
    await query(sql, [id]);
    return { message: 'Question deleted successfully' };
  }

  /**
   * Reorder questions
   */
  static async reorder(assignmentId, questionOrders) {
    const promises = questionOrders.map(({ id, order_index }) =>
      query(
        'UPDATE assignment_questions SET order_index = ? WHERE id = ? AND assignment_id = ?',
        [order_index, id, assignmentId]
      )
    );

    await Promise.all(promises);
    return await this.findAllByAssignment(assignmentId);
  }
}


