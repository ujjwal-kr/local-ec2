import axios from "axios"
import type { Instance, LaunchInstanceParams } from "./types"

// Base URL for the API
const API_BASE_URL = "http://localhost:6969"

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Fetch all instances
export const fetchInstances = async (): Promise<Instance[]> => {
  try {
    const response = await api.get("/describe_instances")
    return response.data
  } catch (error) {
    console.error("Error fetching instances:", error)
    throw error
  }
}

// Launch a new instance
export const launchInstance = async (params: LaunchInstanceParams): Promise<any> => {
  try {
    const response = await api.post("/run_instances", params)
    return response.data
  } catch (error) {
    console.error("Error launching instance:", error)
    throw error
  }
}

// Terminate an instance
export const terminateInstance = async (instanceId: string): Promise<any> => {
  try {
    const response = await api.post("/terminate_instances", { instance_id: instanceId })
    return response.data
  } catch (error) {
    console.error("Error terminating instance:", error)
    throw error
  }
}
