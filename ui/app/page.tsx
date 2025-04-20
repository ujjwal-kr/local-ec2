"use client"

import { useEffect, useState } from "react"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { LaunchInstanceForm } from "@/components/launch-instance-form"
import { InstancesTable } from "@/components/instances-table"
import { Header } from "@/components/header"
import { fetchInstances, terminateInstance } from "@/lib/api"
import type { Instance } from "@/lib/types"

export default function Dashboard() {
  const [instances, setInstances] = useState<Instance[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const { toast } = useToast()

  // Fetch instances on load and when refreshTrigger changes
  useEffect(() => {
    const getInstances = async () => {
      try {
        setLoading(true)
        const data = await fetchInstances()
        setInstances(data)
      } catch (error) {
        toast({
          title: "Error fetching instances",
          description: "Could not retrieve instance data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    getInstances()

    // Set up polling every 10 seconds
    const intervalId = setInterval(() => {
      getInstances()
    }, 10000)

    return () => clearInterval(intervalId)
  }, [refreshTrigger, toast])

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleTerminate = async (instanceId: string) => {
    try {
      await terminateInstance(instanceId)
      toast({
        title: "Instance terminated",
        description: `Instance ${instanceId} has been terminated successfully.`,
      })
      handleRefresh()
    } catch (error) {
      toast({
        title: "Error terminating instance",
        description: "Could not terminate the instance. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <LaunchInstanceForm onLaunch={handleRefresh} />
          </div>
          <div className="lg:col-span-2">
            <InstancesTable
              instances={instances}
              loading={loading}
              onRefresh={handleRefresh}
              onTerminate={handleTerminate}
            />
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  )
}
