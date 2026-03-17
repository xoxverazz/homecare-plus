import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar, ArrowRight } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

export default function Register() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    password: '',
    confirmPassword: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')

  const { register, isLoading } = useAuthStore()
  const navigate = useNavigate()

  // ───────────── VALIDATION ─────────────
  const validate = () => {
    const e = {}

    if (!form.firstName) e.firstName = 'Required'
    if (!form.lastName) e.lastName = 'Required'
    if (!form.email) e.email = 'Required'
    if (!form.phone) e.phone = 'Required'
    if (!form.dateOfBirth) e.dateOfBirth = 'Required'
    if (!form.gender) e.gender = 'Required'
    if (!form.password || form.password.length < 8)
      e.password = 'Minimum 8 characters'
    if (form.password !== form.confirmPassword)
      e.confirmPassword = 'Passwords do not match'

    setErrors(e)
    return Object.keys(e).length === 0
  }

  // ───────────── SUBMIT ─────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')

    if (!validate()) return

    // ✅ FIXED DATA FORMAT
    const data = {
      full_name: `${form.firstName} ${form.lastName}`,
      email: form.email,
      phone_number: String(form.phone),
      date_of_birth: new Date(form.dateOfBirth).toISOString().split('T')[0],
      gender: form.gender.charAt(0).toUpperCase() + form.gender.slice(1),
      password: form.password,
    }

    try {
      const result = await register(data)

      if (result.success) {
        navigate('/dashboard')
      } else {
        setApiError(result.message || 'Registration failed')
      }
    } catch (err) {
      console.error('Registration error:', err)

      // 🔥 Show exact backend error
      if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          setApiError(err.response.data.detail[0].msg)
        } else {
          setApiError(err.response.data.detail)
        }
      } else {
        setApiError('Something went wrong')
      }
    }
  }

  // ───────────── INPUT FIELD ─────────────
  const field = (name, label, type = 'text', icon, placeholder) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
        {label}
      </label>
      <div className="relative">
        {icon &&
          React.createElement(icon, {
            size: 16,
            className: 'absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400',
          })}
        <input
          type={type}
          value={form[name]}
          onChange={(e) => setForm({ ...form, [name]: e.target.value })}
          className={`input-field ${icon ? 'pl-10' : ''} ${
            errors[name] ? 'border-red-400 focus:ring-red-500' : ''
          }`}
          placeholder={placeholder}
        />
      </div>
      {errors[name] && (
        <p className="text-xs text-red-500 mt-1">{errors[name]}</p>
      )}
    </div>
  )

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
        Create your account
      </h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
        Join HomeCare+ for free
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {field('firstName', 'First Name', 'text', User, 'First name')}
          {field('lastName', 'Last Name', 'text', null, 'Last name')}
        </div>

        {field('email', 'Email Address', 'email', Mail, 'you@example.com')}
        {field('phone', 'Phone Number', 'tel', Phone, '+91 98765 43210')}

        <div className="grid grid-cols-2 gap-4">
          {field('dateOfBirth', 'Date of Birth', 'date', Calendar)}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Gender
            </label>
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="input-field"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not">Prefer not to say</option>
            </select>
            {errors.gender && (
              <p className="text-xs text-red-500 mt-1">{errors.gender}</p>
            )}
          </div>
        </div>

        {/* PASSWORD */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={`input-field pl-10 pr-10 ${
                errors.password ? 'border-red-400' : ''
              }`}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* CONFIRM PASSWORD */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Confirm Password</label>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            className="input-field"
          />
        </div>

        {/* API ERROR */}
        {apiError && (
          <div className="bg-red-100 text-red-600 text-sm p-2 rounded">
            {apiError}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full py-3"
        >
          {isLoading ? 'Creating...' : 'Create Account'}
        </button>
      </form>

      <p className="text-center mt-6 text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600">Sign in</Link>
      </p>
    </div>
  )
}
