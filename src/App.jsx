import { useEffect, useState } from 'react'
import Auth from './components/Auth'
import TaskForm from './components/TaskForm'
import './App.css'

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')

    return savedUser ? JSON.parse(savedUser) : null
  })

  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  // Login
  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser)
    setError('')
  }

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    setUser(null)
    setTasks([])
    setEditingTask(null)
    setShowTaskForm(false)
    setError('')
  }

  // Fetch tasks
  useEffect(() => {
    if (!user) {
      return
    }

    const fetchTasks = async () => {
      try {
        setIsLoading(true)
        setError('')

        const token = localStorage.getItem('token')

        if (!token) {
          handleLogout()
          return
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/tasks`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        const data = await response.json()

        // Token invalid/expired
        if (response.status === 401) {
          handleLogout()
          return
        }

        if (!response.ok) {
          throw new Error(
            data.message || 'Unable to fetch tasks.'
          )
        }

        setTasks(data.tasks)

      } catch (error) {
        console.error('Fetch tasks error:', error)

        setError(
          'Unable to connect to the server. Please make sure the backend is running.'
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [user])

  // Create task
  const handleTaskCreated = (newTask) => {
    setTasks((previousTasks) => [
      newTask,
      ...previousTasks
    ])

    setShowTaskForm(false)
    setError('')
  }

  // Update task
  const handleTaskUpdated = (updatedTask) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task._id === updatedTask._id
          ? updatedTask
          : task
      )
    )

    setEditingTask(null)
    setError('')
  }

  // Delete task
  const handleDeleteTask = async (taskId) => {
    const shouldDelete = window.confirm(
      'Are you sure you want to delete this task?'
    )

    if (!shouldDelete) {
      return
    }

    try {
      setError('')

      const token = localStorage.getItem('token')

      if (!token) {
        handleLogout()
        return
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tasks/${taskId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      if (response.status === 401) {
        handleLogout()
        return
      }

      if (!response.ok) {
        throw new Error(
          data.message || 'Unable to delete task.'
        )
      }

      setTasks((previousTasks) =>
        previousTasks.filter(
          (task) => task._id !== taskId
        )
      )

    } catch (error) {
      console.error('Delete task error:', error)

      setError(
        error.message || 'Unable to delete task.'
      )
    }
  }

  // Statistics
  const totalTasks = tasks.length

  const todoTasks = tasks.filter(
    (task) => task.status === 'Todo'
  ).length

  const inProgressTasks = tasks.filter(
    (task) => task.status === 'In Progress'
  ).length

  const completedTasks = tasks.filter(
    (task) => task.status === 'Completed'
  ).length

  // Search + status filtering
  const filteredTasks = tasks.filter((task) => {
    const search = searchTerm.toLowerCase()

    const matchesSearch =
      task.title.toLowerCase().includes(search) ||
      (task.description || '')
        .toLowerCase()
        .includes(search)

    const matchesStatus =
      statusFilter === 'All' ||
      task.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Login screen
  if (!user) {
    return <Auth onLogin={handleLogin} />
  }

  return (
    <div className="app">

      {/* Navbar */}
      <header className="navbar">

        <h2>Task Manager</h2>

        <div className="navbar-right">

          <span>
            Welcome, {user.name}
          </span>

          <button onClick={handleLogout}>
            Logout
          </button>

        </div>

      </header>


      {/* Dashboard */}
      <main className="dashboard">

        <div className="dashboard-header">

          <div>

            <p className="dashboard-label">
              DASHBOARD
            </p>

            <h1>
              Your Tasks
            </h1>

            <p>
              Manage and track your tasks.
            </p>

          </div>

          <button
            className="add-task-button"
            onClick={() => {
              setEditingTask(null)
              setShowTaskForm(true)
            }}
          >
            + Add Task
          </button>

        </div>


        {/* Search */}
        <div className="search-container">

          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />

        </div>


        {/* Filters */}
        <div className="filter-container">

          {[
            'All',
            'Todo',
            'In Progress',
            'Completed'
          ].map((status) => (

            <button
              key={status}
              className={
                statusFilter === status
                  ? 'filter-button active'
                  : 'filter-button'
              }
              onClick={() =>
                setStatusFilter(status)
              }
            >
              {status}
            </button>

          ))}

        </div>


        {/* Statistics */}
        <div className="stats-grid">

          <div className="stat-card">
            <span>Total Tasks</span>
            <strong>{totalTasks}</strong>
          </div>

          <div className="stat-card">
            <span>Todo</span>
            <strong>{todoTasks}</strong>
          </div>

          <div className="stat-card">
            <span>In Progress</span>
            <strong>{inProgressTasks}</strong>
          </div>

          <div className="stat-card">
            <span>Completed</span>
            <strong>{completedTasks}</strong>
          </div>

        </div>


        {/* Add/Edit form */}
        {(showTaskForm || editingTask) && (
          <TaskForm
            task={editingTask}

            onTaskCreated={handleTaskCreated}

            onTaskUpdated={handleTaskUpdated}

            onCancel={() => {
              setShowTaskForm(false)
              setEditingTask(null)
            }}
          />
        )}


        {/* Error */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        {/* Loading */}
        {isLoading && (
          <p>
            Loading tasks...
          </p>
        )}


        {/* Empty state */}
        {!isLoading &&
          !error &&
          tasks.length === 0 && (
            <div className="empty-state">

              <h2>
                No tasks yet
              </h2>

              <p>
                Create your first task to get started.
              </p>

              <button
                onClick={() =>
                  setShowTaskForm(true)
                }
              >
                Create Task
              </button>

            </div>
          )}


        {/* No search/filter results */}
        {!isLoading &&
          !error &&
          tasks.length > 0 &&
          filteredTasks.length === 0 && (
            <div className="empty-state">

              <h2>
                No matching tasks
              </h2>

              <p>
                Try changing your search or filter.
              </p>

            </div>
          )}


        {/* Task list */}
        {!isLoading &&
          filteredTasks.length > 0 && (
            <section className="tasks-section">

              <div className="section-heading">

                <h2>
                  All Tasks
                </h2>

                <span>
                  {filteredTasks.length}{' '}
                  {filteredTasks.length === 1
                    ? 'task'
                    : 'tasks'}
                </span>

              </div>


              <div className="task-list">

                {filteredTasks.map((task) => {

                  const dueDate = task.dueDate
                    ? new Date(task.dueDate)
                    : null

                  let dueClass = 'due-date'
                  let dueLabel = 'Due: '

                  if (dueDate) {
                    const today = new Date()

                    dueDate.setHours(0, 0, 0, 0)
                    today.setHours(0, 0, 0, 0)

                    if (
                      dueDate < today &&
                      task.status !== 'Completed'
                    ) {
                      dueClass =
                        'due-date overdue'

                      dueLabel = 'Overdue: '
                    } else if (
                      dueDate.getTime() ===
                      today.getTime()
                    ) {
                      dueClass =
                        'due-date due-today'

                      dueLabel = 'Due today: '
                    }
                  }

                  return (
                    <div
                      className="task-card"
                      key={task._id}
                    >

                      <div className="task-card-header">

                        <div>

                          <h3
                            className={
                              task.status ===
                              'Completed'
                                ? 'task-title completed-title'
                                : 'task-title'
                            }
                          >
                            {task.title}
                          </h3>

                          <span
                            className={`status ${task.status
                              .toLowerCase()
                              .replace(
                                ' ',
                                '-'
                              )}`}
                          >
                            {task.status}
                          </span>

                        </div>

                      </div>


                      {task.description && (
                        <p className="task-description">
                          {task.description}
                        </p>
                      )}


                      <div className="task-details">

                        <span
                          className={`priority priority-${task.priority.toLowerCase()}`}
                        >
                          Priority: {task.priority}
                        </span>

                        {dueDate && (
                          <span className={dueClass}>
                            {dueLabel}
                            {dueDate.toLocaleDateString()}
                          </span>
                        )}

                      </div>


                      <div className="task-actions">

                        <button
                          onClick={() => {
                            setShowTaskForm(false)
                            setEditingTask(task)
                          }}
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteTask(
                              task._id
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </div>
                  )
                })}

              </div>

            </section>
          )}

      </main>

    </div>
  )
}

export default App