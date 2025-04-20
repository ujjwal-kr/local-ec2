import { ServerIcon as ServerStack } from "lucide-react"

export function Header() {
  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center">
          <ServerStack className="h-8 w-8 text-yellow-400 mr-3" />
          <div>
            <h1 className="text-xl font-bold">Local EC2 Dashboard</h1>
            <p className="text-sm text-gray-400">Instance Management</p>
          </div>
        </div>
      </div>
    </header>
  )
}
