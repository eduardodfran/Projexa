import React, { useState, useEffect, useContext, useMemo } from 'react'
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay,
  useDroppable, // Import useDroppable
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import TaskContext from '../../context/TaskContext'

// Individual Task Card Component (Sortable)
const TaskCard = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id, data: { type: 'Task', task } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  // Priority badge styling
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Low':
        return 'bg-blue-100 text-blue-800'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'High':
        return 'bg-orange-100 text-orange-800'
      case 'Urgent':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-[#111827] border border-[#4A5568] rounded-lg mb-3 p-4 shadow-md hover:shadow-lg transition-all duration-200 cursor-grab touch-none`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-[#FFFFFF] break-words">{task.title}</h4>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(
            task.priority
          )}`}
        >
          {task.priority}
        </span>
      </div>
      {task.description && (
        <p className="mt-2 text-sm text-[#E2E8F0] line-clamp-2">
          {task.description}
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#E2E8F0]">
        {task.assignedTo ? (
          <div className="flex items-center">
            <div className="h-5 w-5 rounded-full bg-[#3182CE] flex items-center justify-center text-white text-xs mr-1">
              {task.assignedTo.name
                ? task.assignedTo.name.charAt(0).toUpperCase()
                : '?'}
            </div>
            <span>{task.assignedTo.name || 'Unknown'}</span>
          </div>
        ) : (
          <div className="text-[#E2E8F0] text-xs">Unassigned</div>
        )}
        {task.deadline && (
          <div className="flex items-center">
            <svg
              className="h-3 w-3 mr-1"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{new Date(task.deadline).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// Column Component (Droppable & Sortable Context)
const Column = ({ id, title, tasks, color }) => {
  const taskIds = useMemo(() => tasks.map((task) => task._id), [tasks])
  const { setNodeRef } = useDroppable({
    id: id, // Use the column id as the droppable id
    data: {
      type: 'Column', // Add type for identification in drag events
      columnId: id,
    },
  })

  return (
    <div
      ref={setNodeRef} // Apply the droppable ref here
      className={`bg-[#1A202C] border-t-4 ${color} rounded-lg shadow-xl overflow-hidden flex flex-col`}
    >
      <div className="p-4 border-b border-[#4A5568]">
        <h3 className="text-lg font-semibold text-[#FFFFFF]">
          {title}
          <span className="ml-2 text-sm font-normal text-[#E2E8F0]">
            ({tasks.length})
          </span>
        </h3>
      </div>
      <div className="p-4 flex-grow min-h-[400px] space-y-3">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="text-center py-5 text-[#E2E8F0] italic">
            No tasks in this column
          </div>
        )}
      </div>
    </div>
  )
}

// Main Kanban Board Component
const KanbanBoard = ({ projectId }) => {
  const { tasks, updateTask, loading: tasksLoading } = useContext(TaskContext)

  const [columns, setColumns] = useState({
    'To Do': [],
    'In Progress': [],
    Done: [],
  })

  const [activeTask, setActiveTask] = useState(null)

  // Memoize column definitions to prevent unnecessary re-renders
  const columnDefs = useMemo(
    () => ({
      'To Do': { title: 'To Do', color: 'border-yellow-500' },
      'In Progress': {
        title: 'In Progress',
        color: 'border-blue-500',
      },
      Done: { title: 'Done', color: 'border-green-500' },
    }),
    []
  )

  // Update columns when tasks change
  useEffect(() => {
    if (!tasks || !projectId) return

    // Filter tasks for the current project
    // Ensure task.project exists and has an _id before comparing
    const projectTasks = tasks.filter(
      (task) => task.project && task.project._id === projectId
    )

    // Organize tasks into columns by status
    setColumns({
      'To Do': projectTasks.filter((task) => task.status === 'To Do'),
      'In Progress': projectTasks.filter(
        (task) => task.status === 'In Progress'
      ),
      Done: projectTasks.filter((task) => task.status === 'Done'),
    })
  }, [tasks, projectId])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require drag movement of 8px to initiate drag
      },
    }),
    useSensor(KeyboardSensor)
  )

  const findColumnForTask = (taskId) => {
    return Object.keys(columns).find((columnId) =>
      columns[columnId].some((task) => task._id === taskId)
    )
  }

  const handleDragStart = (event) => {
    const { active } = event
    if (active.data.current?.type === 'Task') {
      setActiveTask(active.data.current.task)
    }
  }

  const handleDragOver = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const activeId = active.id
    const overId = over.id

    const isActiveATask = active.data.current?.type === 'Task'
    // Check if 'over' is a Column container OR a Task within a column
    const isOverAColumn = over.data.current?.type === 'Column'
    const isOverATask = over.data.current?.type === 'Task'

    if (!isActiveATask) return

    // Find the source column of the active task
    const activeColumn = findColumnForTask(activeId)

    // Determine the target column ID
    let overColumnId = null
    if (isOverAColumn) {
      overColumnId = over.id // Dropped directly onto a column container
    } else if (isOverATask) {
      overColumnId = findColumnForTask(overId) // Dropped onto a task, find its column
    }

    // Handle moving the task if source and target columns are different and valid
    if (activeColumn && overColumnId && activeColumn !== overColumnId) {
      setColumns((prev) => {
        const activeItems = prev[activeColumn]
        const overItems = prev[overColumnId] || [] // Ensure overItems is an array even if column was empty
        const activeIndex = activeItems.findIndex((t) => t._id === activeId)

        // Check if task exists in activeItems before proceeding
        if (activeIndex === -1) {
          console.warn(`Task ${activeId} not found in column ${activeColumn}`)
          return prev // Return previous state if task not found
        }

        const taskToMove = activeItems[activeIndex]

        // Determine where to insert in the target column
        let newIndexInOverColumn = overItems.length // Default to end if dropping on column or empty column

        if (isOverATask) {
          // If dropping over a task, find its index to insert above it
          const overIndex = overItems.findIndex((t) => t._id === overId)
          if (overIndex !== -1) {
            newIndexInOverColumn = overIndex
          }
        }

        return {
          ...prev,
          [activeColumn]: activeItems.filter((t) => t._id !== activeId),
          [overColumnId]: [
            ...overItems.slice(0, newIndexInOverColumn),
            taskToMove,
            ...overItems.slice(newIndexInOverColumn),
          ],
        }
      })
    } else if (activeColumn && overColumnId && activeColumn === overColumnId) {
      // Handle reordering within the same column
      if (isOverATask) {
        setColumns((prev) => {
          const currentItems = prev[activeColumn]
          const oldIndex = currentItems.findIndex((t) => t._id === activeId)
          const newIndex = currentItems.findIndex((t) => t._id === overId)
          if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
            return {
              ...prev,
              [activeColumn]: arrayMove(currentItems, oldIndex, newIndex),
            }
          }
          return prev
        })
      }
    }
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event
    setActiveTask(null) // Clear active task regardless of outcome

    if (!over) return // Dropped outside any droppable area

    const activeId = active.id
    const overId = over.id
    const task = tasks.find((t) => t._id === activeId) // Get the full task object

    if (!task) return // Should not happen if drag started correctly

    // Find the source column *before* potential state update in handleDragOver
    // We need the original source column ID here.
    // Let's re-find the source column based on the original tasks state if needed,
    // or rely on the state *before* handleDragOver potentially modified it.
    // A simpler approach for handleDragEnd is to determine the final target column.

    let targetColumnId = null
    const isOverAColumn = over.data.current?.type === 'Column'
    const isOverATask = over.data.current?.type === 'Task'

    if (isOverAColumn) {
      targetColumnId = over.id
    } else if (isOverATask) {
      // Find the column of the task it was dropped over *in the current state*
      targetColumnId = Object.keys(columns).find((colId) =>
        columns[colId].some((t) => t._id === overId)
      )
    }

    // Find the source column based on the task's original status before drag
    const originalSourceColumn = task.status

    if (!targetColumnId) return // Could not determine target column

    // If the column changed, update the task status via API
    if (originalSourceColumn !== targetColumnId) {
      try {
        // Ensure the task object passed includes necessary fields, or just update status
        await updateTask(activeId, { status: targetColumnId })
        // UI is already updated optimistically by handleDragOver
      } catch (error) {
        console.error('Failed to update task status:', error)
        // Revert UI changes on error - This is complex.
        // A simple revert might involve refetching tasks or restoring previous state.
        // For now, log the error. Consider implementing a robust revert strategy.
        alert(`Error updating task: ${error.message}. Please refresh.`)
        // Ideally, trigger a refetch of tasks here.
      }
    } else {
      // Handle reordering persistence if needed
      // If dropped in the same column but position changed
      const currentItems = columns[targetColumnId]
      const oldIndex = tasks
        .filter((t) => t.status === targetColumnId)
        .findIndex((t) => t._id === activeId) // Index in original list for this status
      const newIndex = currentItems.findIndex((t) => t._id === activeId) // Index in current UI state

      if (oldIndex !== newIndex) {
        console.log(
          `Task ${activeId} reordered in ${targetColumnId}. Persistence logic can be added here.`
        )
        // API call to save order if required by backend.
      }
    }
  }

  if (tasksLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3182CE]"></div>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.keys(columnDefs).map((columnId) => (
            <Column
              key={columnId}
              id={columnId} // Pass columnId as id for SortableContext
              title={columnDefs[columnId].title}
              tasks={columns[columnId] || []} // Ensure tasks is always an array
              color={columnDefs[columnId].color}
            />
          ))}
        </div>
      </div>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  )
}

export default KanbanBoard
