const priorityTypes = {
  HIGH: 'badge-warning',
  NORMAL: 'badge-primary',
  LOW: 'badge-info',
}

export const renderPriorityStyle = (priority: "HIGH" | "NORMAL" | "LOW") => {
  return priorityTypes[priority]
}