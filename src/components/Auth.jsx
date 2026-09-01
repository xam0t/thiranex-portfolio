import { useState } from 'react'

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setMessage('')
    setIsSubmitting(true)

    try {
      const endpoint = isLogin
        ? '/api/auth/login'
        : '/api/auth/register'

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      )

      const responseText = await response.text()

      console.log('Server response:', responseText)

      let data

      try {
        data = JSON.parse(responseText)
      } catch (error) {
        throw new Error(
          'Server returned an invalid or empty response.'
        )
      }

      if (!response.ok) {
        throw new Error(
          data.message || 'Something went wrong.'
        )
      }

      if (isLogin) {
        localStorage.setItem('token', data.token)

        localStorage.setItem(
          'user',
          JSON.stringify(data.user)
        )

        onLogin(data.user)

      } else {
        setMessage(
          'Account created successfully! Please login.'
        )

        setIsLogin(true)

        setFormData({
          name: '',
          email: formData.email,
          password: ''
        })
      }

    } catch (error) {
      console.error('Authentication error:', error)

      setMessage(error.message)

    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h1>
          {isLogin
            ? 'Welcome Back'
            : 'Create Account'}
        </h1>

        <p>
          {isLogin
            ? 'Login to manage your tasks.'
            : 'Create an account to get started.'}
        </p>

        <form onSubmit={handleSubmit}>

          {!isLogin && (
            <div className="form-group">

              <label htmlFor="name">
                Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
              />

            </div>
          )}

          <div className="form-group">

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>

          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              minLength={6}
              required
            />

          </div>

          <button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Please wait...'
              : isLogin
                ? 'Login'
                : 'Create Account'}
          </button>

        </form>

        {message && (
          <p className="auth-message">
            {message}
          </p>
        )}

        <button
          type="button"
          className="switch-auth"
          onClick={() => {
            setIsLogin(!isLogin)
            setMessage('')
          }}
        >
          {isLogin
            ? "Don't have an account? Register"
            : 'Already have an account? Login'}
        </button>

      </div>

    </div>
  )
}

export default Auth