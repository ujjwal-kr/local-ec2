"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { launchInstance } from "@/lib/api"
import { Loader2 } from "lucide-react"

interface LaunchInstanceFormProps {
  onLaunch: () => void
}

export function LaunchInstanceForm({ onLaunch }: LaunchInstanceFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    ssh_port: 2222,
    mem: 512,
    cpus: 1,
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "name" ? value : Number(value),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await launchInstance(formData)
      toast({
        title: "Instance launching",
        description: `Instance ${formData.name} is being created.`,
      })
      setFormData({
        name: "",
        ssh_port: 2222,
        mem: 512,
        cpus: 1,
      })
      onLaunch()
    } catch (error) {
      toast({
        title: "Launch failed",
        description: "Could not launch the instance. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-yellow-400/20">
      <CardHeader className="bg-yellow-50 border-b border-yellow-100">
        <CardTitle className="text-gray-800">Launch Instance</CardTitle>
        <CardDescription>Configure and launch a new EC2 instance</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Instance Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="my-instance"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ssh_port">SSH Port</Label>
            <Input
              id="ssh_port"
              name="ssh_port"
              type="number"
              value={formData.ssh_port}
              onChange={handleChange}
              min={1024}
              max={65535}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mem">Memory (MB)</Label>
            <Input
              id="mem"
              name="mem"
              type="number"
              value={formData.mem}
              onChange={handleChange}
              min={128}
              step={128}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpus">CPUs</Label>
            <Input
              id="cpus"
              name="cpus"
              type="number"
              value={formData.cpus}
              onChange={handleChange}
              min={1}
              max={16}
              step={1}
              required
            />
          </div>

          <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Launching...
              </>
            ) : (
              "Launch Instance"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
