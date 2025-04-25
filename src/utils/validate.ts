import { EventInsert } from "@/types/database"

export const validateEvent = (event: EventInsert) => {
  if (!event.title) {
    return { error: "title is required" }
  }
  if (event.title.length > 255) {
    return { error: "title must be less than 255 characters" }
  } else if (event.title.length < 1) {
    return { error: "title is too short" }
  }

  if (!event.location) {
    return { error: "location is required" }
  }
  if (event.location.length > 255) {
    return { error: "location must be less than 255 characters" }
  } else if (event.location.length < 1) {
    return { error: "location is too short" }
  }

  if (!event.scheduled_at) {
    return { error: "scheduled_at is required" }
  }

  return null
}

export const validateTodo = (todo: EventInsert) => {
  if (!todo.title) {
    return { error: "title is required" }
  }
  if (todo.title.length > 255) {
    return { error: "title must be less than 255 characters" }
  } else if (todo.title.length < 1) {
    return { error: "title is too short" }
  }

  if (!todo.location) {
    return { error: "location is required" }
  }
  if (todo.location.length > 255) {
    return { error: "location must be less than 255 characters" }
  } else if (todo.location.length < 1) {
    return { error: "location is too short" }
  }

  if (!todo.scheduled_at) {
    return { error: "scheduled_at is required" }
  }

  return null
}
