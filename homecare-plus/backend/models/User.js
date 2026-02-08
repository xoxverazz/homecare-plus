// User Model
const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Create new user
  static async create(userData) {
    try {
      const { email, password, full_name, phone_number, date_of_birth, gender } = userData;
      
      // Hash password
      const password_hash = await bcrypt.hash(password, 10);
      
      const [result] = await pool.query(
        `INSERT INTO users (email, password_hash, full_name, phone_number, date_of_birth, gender) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [email, password_hash, full_name, phone_number, date_of_birth, gender]
      );
      
      return {
        success: true,
        userId: result.insertId,
        message: 'User created successfully'
      };
    } catch (error) {
      console.error('User creation error:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return {
          success: false,
          message: 'Email already exists'
        };
      }
      return {
        success: false,
        message: 'Failed to create user'
      };
    }
  }
  
  // Find user by email
  static async findByEmail(email) {
    try {
      const [users] = await pool.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('Find user error:', error);
      return null;
    }
  }
  
  // Find user by ID
  static async findById(userId) {
    try {
      const [users] = await pool.query(
        'SELECT user_id, email, full_name, phone_number, date_of_birth, gender, profile_picture, created_at FROM users WHERE user_id = ?',
        [userId]
      );
      
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('Find user by ID error:', error);
      return null;
    }
  }
  
  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
  
  // Update user profile
  static async updateProfile(userId, updates) {
    try {
      const allowedFields = ['full_name', 'phone_number', 'date_of_birth', 'gender', 'profile_picture'];
      const updateFields = [];
      const values = [];
      
      for (const [key, value] of Object.entries(updates)) {
        if (allowedFields.includes(key) && value !== undefined) {
          updateFields.push(`${key} = ?`);
          values.push(value);
        }
      }
      
      if (updateFields.length === 0) {
        return { success: false, message: 'No valid fields to update' };
      }
      
      values.push(userId);
      
      await pool.query(
        `UPDATE users SET ${updateFields.join(', ')} WHERE user_id = ?`,
        values
      );
      
      return {
        success: true,
        message: 'Profile updated successfully'
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: 'Failed to update profile'
      };
    }
  }
  
  // Update last login
  static async updateLastLogin(userId) {
    try {
      await pool.query(
        'UPDATE users SET last_login = NOW() WHERE user_id = ?',
        [userId]
      );
    } catch (error) {
      console.error('Update last login error:', error);
    }
  }
  
  // Create or update Google user
  static async createOrUpdateGoogleUser(googleProfile) {
    try {
      const { id, emails, displayName, photos } = googleProfile;
      const email = emails[0].value;
      const profile_picture = photos && photos.length > 0 ? photos[0].value : null;
      
      // Check if user exists
      const existingUser = await this.findByEmail(email);
      
      if (existingUser) {
        // Update Google ID and profile picture if needed
        await pool.query(
          'UPDATE users SET google_id = ?, profile_picture = ?, last_login = NOW() WHERE email = ?',
          [id, profile_picture, email]
        );
        return existingUser;
      } else {
        // Create new user
        const [result] = await pool.query(
          `INSERT INTO users (email, google_id, full_name, profile_picture, last_login) 
           VALUES (?, ?, ?, ?, NOW())`,
          [email, id, displayName, profile_picture]
        );
        
        return {
          user_id: result.insertId,
          email,
          full_name: displayName,
          google_id: id,
          profile_picture
        };
      }
    } catch (error) {
      console.error('Google user creation error:', error);
      throw error;
    }
  }
}

module.exports = User;
