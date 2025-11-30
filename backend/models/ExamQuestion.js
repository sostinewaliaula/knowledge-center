import { query, queryOne } from '../config/database.js';

export class ExamQuestion {
  /**
   * Find all questions for an exam
   */
  static async findAllByExam(examId) {
    const sql = `
      SELECT *
      FROM exam_questions
      WHERE exam_id = ?
      ORDER BY order_index ASC, created_at ASC
    `;
    const questions = await query(sql, [examId]);
    
    // Parse JSON options if they exist
    return questions.map(q => {
      if (q.options && typeof q.options === 'string') {
        try {
          q.options = JSON.parse(q.options);
        } catch (e) {
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
    const sql = 'SELECT * FROM exam_questions WHERE id = ?';
    const question = await queryOne(sql, [id]);
    
    if (question && question.options && typeof question.options === 'string') {
      try {
        question.options = JSON.parse(question.options);
      } catch (e) {
        question.options = [];
      }
    }
    
    return question;
  }

  /**
   * Create a new question
   */
  static async create(questionData, userId = null) {
    const {
      exam_id,
      question_text,
      question_type,
      options,
      correct_answer,
      points,
      order_index,
      explanation,
      status = 'draft'
    } = questionData;

    // Ensure options is JSON string
    const optionsJson = options ? (typeof options === 'string' ? options : JSON.stringify(options)) : null;

    // Get next order_index if not provided
    let order = order_index;
    if (order === undefined || order === null) {
      const maxOrderSql = `SELECT MAX(order_index) as max_order FROM exam_questions WHERE exam_id = ?`;
      const maxResult = await queryOne(maxOrderSql, [exam_id]);
      order = (maxResult.max_order || 0) + 1;
    }

    const sql = `
      INSERT INTO exam_questions (
        exam_id, question_text, question_type, options, correct_answer,
        points, order_index, explanation, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await query(sql, [
      exam_id,
      question_text,
      question_type || 'multiple_choice',
      optionsJson,
      correct_answer || null,
      points || 1.00,
      order,
      explanation || null,
      status
    ]);
    
    // Fetch the newly created question
    const question = await queryOne(
      'SELECT * FROM exam_questions WHERE exam_id = ? AND question_text = ? ORDER BY created_at DESC LIMIT 1',
      [exam_id, question_text]
    );
    
    // Parse JSON options if they exist
    if (question && question.options && typeof question.options === 'string') {
      try {
        question.options = JSON.parse(question.options);
      } catch (e) {
        question.options = [];
      }
    }
    
    // Log history
    if (userId) {
      await this.logHistory(question.id, userId, 'created', null, {
        question_text: question.question_text,
        question_type: question.question_type,
        status: question.status
      }, 'Question created');
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
      'question_text', 'question_type', 'options', 'correct_answer',
      'points', 'order_index', 'explanation', 'status'
    ];

    for (const field of allowedFields) {
      if (questionData[field] !== undefined) {
        if (field === 'options') {
          // Ensure options is JSON string
          const optionsJson = questionData[field] 
            ? (typeof questionData[field] === 'string' ? questionData[field] : JSON.stringify(questionData[field]))
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

    // Get old data for history
    const oldQuestion = await this.findById(id);
    
    values.push(id);
    const sql = `UPDATE exam_questions SET ${updates.join(', ')} WHERE id = ?`;
    await query(sql, values);

    const updatedQuestion = await this.findById(id);
    
    // Log history if userId provided
    if (questionData.userId) {
      const changes = [];
      if (oldQuestion.question_text !== updatedQuestion.question_text) {
        changes.push('question text');
      }
      if (oldQuestion.question_type !== updatedQuestion.question_type) {
        changes.push('question type');
      }
      if (oldQuestion.status !== updatedQuestion.status) {
        changes.push('status');
      }
      if (oldQuestion.points !== updatedQuestion.points) {
        changes.push('points');
      }
      
      if (changes.length > 0) {
        await this.logHistory(
          id,
          questionData.userId,
          'updated',
          {
            question_text: oldQuestion.question_text,
            question_type: oldQuestion.question_type,
            status: oldQuestion.status,
            points: oldQuestion.points
          },
          {
            question_text: updatedQuestion.question_text,
            question_type: updatedQuestion.question_type,
            status: updatedQuestion.status,
            points: updatedQuestion.points
          },
          `Updated: ${changes.join(', ')}`
        );
      }
    }

    return updatedQuestion;
  }

  /**
   * Delete question
   */
  static async delete(id) {
    const sql = 'DELETE FROM exam_questions WHERE id = ?';
    await query(sql, [id]);
    return { message: 'Question deleted successfully' };
  }

  /**
   * Reorder questions
   */
  static async reorder(examId, questionOrders) {
    // questionOrders is an array of { id, order_index }
    const promises = questionOrders.map(({ id, order_index }) => {
      return query(`UPDATE exam_questions SET order_index = ? WHERE id = ? AND exam_id = ?`, 
        [order_index, id, examId]);
    });
    
    await Promise.all(promises);
    return await this.findAllByExam(examId);
  }

  /**
   * Publish a question
   */
  static async publish(id, userId = null) {
    const sql = 'UPDATE exam_questions SET status = ? WHERE id = ?';
    await query(sql, ['published', id]);
    
    if (userId) {
      await this.logHistory(id, userId, 'published', { status: 'draft' }, { status: 'published' }, 'Question published');
    }
    
    return await this.findById(id);
  }

  /**
   * Unpublish a question (set to draft)
   */
  static async unpublish(id, userId = null) {
    const sql = 'UPDATE exam_questions SET status = ? WHERE id = ?';
    await query(sql, ['draft', id]);
    
    if (userId) {
      await this.logHistory(id, userId, 'unpublished', { status: 'published' }, { status: 'draft' }, 'Question unpublished');
    }
    
    return await this.findById(id);
  }

  /**
   * Get question history
   */
  static async getHistory(questionId) {
    const sql = `
      SELECT h.*, u.name as changed_by_name, u.email as changed_by_email
      FROM exam_question_history h
      LEFT JOIN users u ON h.changed_by = u.id
      WHERE h.question_id = ?
      ORDER BY h.created_at DESC
    `;
    return await query(sql, [questionId]);
  }

  /**
   * Log question history
   */
  static async logHistory(questionId, userId, changeType, oldData, newData, changeSummary) {
    const sql = `
      INSERT INTO exam_question_history (
        question_id, changed_by, change_type, old_data, new_data, change_summary
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    await query(sql, [
      questionId,
      userId,
      changeType,
      oldData ? JSON.stringify(oldData) : null,
      newData ? JSON.stringify(newData) : null,
      changeSummary
    ]);
  }
}

