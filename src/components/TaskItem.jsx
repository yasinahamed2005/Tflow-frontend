import React, { useState, useEffect } from "react";
import TaskModal from "./TaskModal";
import DeleteModal from "./DeleteModal";
import axios from "axios";
import { getPriorityBadgeColor, TI_CLASSES, getPriorityColor, MENU_OPTIONS } from "../assets/dummy";
import { CheckCircle2, MoreVertical, Calendar, Clock } from "lucide-react";
import { format, isToday } from 'date-fns';

const API_BASE = "http://localhost:5000/api/tasks"; // ✅ matches backend

const TaskItem = ({ task, onRefresh, onLogout, showCompleteCheckbox = true }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isCompleted, setIsCompleted] = useState(
    [true, 1, "yes"].includes(typeof task.completed === "string" ? task.completed.toLowerCase() : task.completed)
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [subtasks, setSubtasks] = useState(task.subtasks || []);

  useEffect(() => {
    setIsCompleted(
      [true, 1, "yes"].includes(typeof task.completed === "string" ? task.completed.toLowerCase() : task.completed)
    );
  }, [task.completed]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token found");
    return { Authorization: `Bearer ${token}` };
  };

  const borderColor = isCompleted ? "border-green-500" : getPriorityColor(task.priority).split(" ")[0];

  // ✅ Toggle Complete / Incomplete
  const handleComplete = async () => {
    try {
      const newStatus = isCompleted ? "No" : "Yes";
      await axios.put(`${API_BASE}/${task._id}/gp`, 
        { completed: newStatus }, 
        { headers: getAuthHeaders() }
      );
      setIsCompleted(!isCompleted);
      onRefresh?.();
    } catch (err) {
      console.error("Complete task error:", err.response?.data || err.message);
      if (err.response?.status === 401) onLogout?.();
    }
  };

  // ✅ Confirmed delete (now uses /:id/gp)
  const handleDelete = async () => {
    try {
await axios.delete(`${API_BASE}/${task._id}/gp`, { headers: getAuthHeaders() });

      setShowDeleteModal(false); 
      onRefresh?.();
    } catch (err) {
      console.error("Delete task error:", err.response?.data || err.message);
      if (err.response?.status === 401) onLogout?.();
    }
  };

  // Menu action (edit/delete)
  const handleAction = (action) => {
    setShowMenu(false);
    if (action === "edit") setShowEditModal(true);
    if (action === "delete") setShowDeleteModal(true);
  };

  // ✅ Save updated task (still /:id/gp)
  const handleSave = async (updatedTask) => {
    try {
      const payload = (({ title, description, priority, dueDate, completed }) => 
        ({ title, description, priority, dueDate, completed })
      )(updatedTask);

      await axios.put(`${API_BASE}/${task._id}/gp`, payload, {
        headers: getAuthHeaders(),
      });

      setShowEditModal(false);
      onRefresh?.();
    } catch (err) {
      console.error("Error updating task:", err.response?.data || err.message);
      if (err.response?.status === 401) onLogout?.();
    }
  };

  const progress = subtasks.length ? (subtasks.filter(st => st.completed).length / subtasks.length) * 100 : 0;

  return (
    <>
      <div className={`${TI_CLASSES.wrapper} ${borderColor}`}>
        <div className={TI_CLASSES.leftContainer}>
          {showCompleteCheckbox && (
            <button 
              onClick={handleComplete}
              className={`${TI_CLASSES.completeBtn} ${isCompleted ? "text-green-500" : "text-gray-300"}`}
            >
              <CheckCircle2 
                size={18} 
                className={`${TI_CLASSES.checkboxIconBase} ${isCompleted ? "fill-green-500" : ""}`} 
              />
            </button>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-1 flex-wrap">
              <h3 className={`${TI_CLASSES.titleBase} ${isCompleted ? "text-gray-400 line-through" : "text-gray-800"}`}>
                {task.title}
              </h3>
              <span className={`${TI_CLASSES.priorityBadge} ${getPriorityBadgeColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
            {task.description && <p className={TI_CLASSES.description}>{task.description}</p>}
          </div>
        </div>

        <div className={TI_CLASSES.rightContainer}>
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className={TI_CLASSES.menuButton}>
              <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" size={18} />
            </button>
            {showMenu && (
              <div className={TI_CLASSES.menuDropdown}>
                {MENU_OPTIONS.map((opt) => (
                  <button
                    key={opt.action}
                    onClick={() => handleAction(opt.action)}
                    className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-purple-50 flex items-center gap-2 transition-colors duration-200"
                  >
                    {opt.icon} {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <div className={`${TI_CLASSES.dateRow} ${task.dueDate && isToday(new Date(task.dueDate))
              ? 'text-fuchsia-600' : 'text-gray-500'}`}>
              <Calendar className="w-3.5 h-3.5" />
              {task.dueDate ? isToday(new Date(task.dueDate)) ? "Today" : format(new Date(task.dueDate), "MMM dd") : "-"}
            </div>
            <div className={TI_CLASSES.createdRow}>
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {task.createdAt ? `Created ${format(new Date(task.createdAt), 'MMM dd')}` : 'No date'}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <TaskModal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)}
        taskToEdit={task}
        onSave={handleSave} 
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        taskTitle={task.title}
      />
    </>
  );
};

export default TaskItem;
