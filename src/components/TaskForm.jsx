import { useState } from 'react'

function TaskForm({ task, onTaskCreated, onTaskUpdated, onCancel }) {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'Todo',
    priority: task?.priority || 'Medium',
    dueDate: task?.dueDate
      ? task.dueDate.substring(0, 10)
      : ''
  })

  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEditing = Boolean(task)

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')

    if (formData.title.trim().length < 2) {
      setError(
        'Task title must contain at least 2 characters.'
      )
      return
    }

    try {
      setIsSubmitting(true)

      const token = localStorage.getItem('token')

      const url = isEditing
        ? `${import.meta.env.VITE_API_URL}/api/tasks/${task._id}`
        : `${import.meta.env.VITE_API_URL}/api/tasks`

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },

        body: JSON.stringify({
          ...formData,
          title: formData.title.trim(),
          description: formData.description.trim(),
          dueDate: formData.dueDate || null
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to save task.'
        )
      }

      if (isEditing) {
        onTaskUpdated(data.task)
      } else {
        onTaskCreated(data.task)
      }

    } catch (error) {
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="task-form-container">

      <div className="task-form-card">

        <div className="task-form-header">

          <h2>
            {isEditing
              ? 'Edit Task'
              : 'Create New Task'}
          </h2>

          <button
            type="button"
            onClick={onCancel}
          >
            ✕
          </button>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label htmlFor="title">
              Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              placeholder="Enter task title"
              value={formData.title}
              onChange={handleChange}
              required
            />

          </div>


          <div className="form-group">

            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              placeholder="Enter task description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />

          </div>


          <div className="form-row">

            <div className="form-group">

              <label htmlFor="status">
                Status
              </label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Todo">
                  Todo
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Completed">
                  Completed
                </option>

              </select>

            </div>


            <div className="form-group">

              <label htmlFor="priority">
                Priority
              </label>

              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >

                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>

              </select>

            </div>

          </div>


          <div className="form-group">

            <label htmlFor="dueDate">
              Due Date
            </label>

            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
            />

          </div>


          {error && (
            <p className="error-message">
              {error}
            </p>
          )}


          <div className="form-actions">

            <button
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Saving...'
                : isEditing
                  ? 'Save Changes'
                  : 'Create Task'}
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}

export default TaskForm