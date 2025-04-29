import {
  DndContext,
  DragOverlay,
  MouseSensor,
  pointerWithin,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useCallback, useState } from "react";
import KanbanColumn from "./KanbanColumn";
import TaskCard, { DragContext } from "./TaskCard";

export default function KanbanBoard({ tasksList }) {
  const [tasks, setTasks] = useState(tasksList);
  const [activeId, setActiveId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  // Track initial status of the active task
  const [initialStatus, setInitialStatus] = useState(null);

  // Define our columns/statuses
  const columns = ["To Do", "In Progress", "Completed", "Cancelled"];

  // Configure sensors
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 8,
      },
    })
  );

  // Custom collision detection that prioritizes columns
  const collisionDetectionStrategy = useCallback((args) => {
    // Force pointer events to go through cards to the columns
    const columnCollisions = args.droppableContainers
      .filter(container => container.data.current?.type === "column")
      .reduce((acc, container) => {
        const rect = args.droppableRects.get(container.id);
        
        if (rect) {
          const { top, left, right, bottom } = rect;
          const pointerX = args.pointerCoordinates.x;
          const pointerY = args.pointerCoordinates.y;
          
          // Check if pointer is inside this column
          if (
            pointerX >= left && 
            pointerX <= right && 
            pointerY >= top && 
            pointerY <= bottom
          ) {
            acc.push({
              id: container.id,
              data: {
                droppableContainer: container,
                value: 100 
              }
            });
          }
        }
        
        return acc;
      }, []);
    
    if (columnCollisions.length > 0) {
      return columnCollisions;
    }
    
    return pointerWithin(args);
  }, []);

  // Function to update task status and call API
  const updateTaskStatus = (taskId, previousStatus, newStatus) => {
    // Only log and call API if status actually changed
    if (previousStatus !== newStatus) {
      const task = tasks.find(t => t.$id === taskId);
      
      console.log('Task status update:', {
        taskId,
        title: task?.title,
        previousStatus,
        newStatus,
        timestamp: new Date().toISOString()
      });
      
      // Here you would make your API call
      /*
      fetch('your-api-endpoint', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId,
          previousStatus,
          newStatus,
        }),
      })
        .then(response => response.json())
        .then(data => {
          console.log('API response:', data);
        })
        .catch(error => {
          console.error('Error updating task status:', error);
        });
      */
    }
  };

  // Find tasks for a specific column
  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  // Handle drag start
  const handleDragStart = (event) => {
    const taskId = event.active.id;
    setActiveId(taskId);
    setIsDragging(true);
    
    // Save the initial status when drag starts
    const task = tasks.find(t => t.$id === taskId);
    if (task) {
      setInitialStatus(task.status);
    }
  };

  // Handle drag over - for visual updates only
  const handleDragOver = (event) => {
    const { active, over } = event;

    if (!over) return;

    // If dragging over a column
    if (
      over.data.current?.type === "column" &&
      active.data.current?.type !== "column"
    ) {
      const taskId = active.id;
      const newStatus = over.id;

      // Skip if task is already in this column
      const task = tasks.find((t) => t.$id === taskId);
      if (!task || task.status === newStatus) return;

      // Update task status for visual feedback only
      // We'll check if it actually changed at the end
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.$id === taskId ? { ...t, status: newStatus } : t
        )
      );
    }
  };

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Handle drops on tasks (reordering)
      if (over.data.current?.type !== "column") {
        setTasks((tasks) => {
          const oldIndex = tasks.findIndex((task) => task.$id === active.id);
          const newIndex = tasks.findIndex((task) => task.$id === over.id);
          
          return arrayMove(tasks, oldIndex, newIndex);
        });
      }
    }

    // Check if task status changed during the drag and call API
    if (initialStatus && activeId) {
      const task = tasks.find(t => t.$id === activeId);
      if (task && task.status !== initialStatus) {
        // This is where we log and make API call
        updateTaskStatus(activeId, initialStatus, task.status);
      }
    }

    // Reset state
    setActiveId(null);
    setIsDragging(false);
    setInitialStatus(null);
  };

  // Find the active task
  const activeTask = activeId
    ? tasks.find((task) => task.$id === activeId)
    : null;

  return (
    <DragContext.Provider value={{ isDragging }}>
      <div>
        <DndContext
          sensors={sensors}
          collisionDetection={collisionDetectionStrategy}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
              gap: "16px",
            }}
          >
            {columns.map((column) => (
              <KanbanColumn
                key={column}
                id={column}
                title={column}
                tasks={getTasksByStatus(column)}
                isDragging={isDragging}
              />
            ))}
          </div>

          <DragOverlay>
            {activeId && activeTask ? (
              <TaskCard 
                task={activeTask} 
                isDragOverlay={true} 
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </DragContext.Provider>
  );
}
