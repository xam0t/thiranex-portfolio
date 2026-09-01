function TaskCard({ task }) {
  return (
    <div className="task-card">

      <div className="task-card-content">
        <h3>{task.title}</h3>

        <p>{task.description}</p>

        <div className="task-meta">
          <span className={`task-status ${task.status.toLowerCase().replace(' ', '-')}`}>
            {task.status}
          </span>

          <span className="task-priority">
            {task.priority}
          </span>
        </div>
      </div>

      <div className="task-actions">
        <button className="edit-button">
          Edit
        </button>

        <button className="delete-button">
          Delete
        </button>
      </div>

    </div>
  )
}

export default TaskCard