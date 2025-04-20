// Instance type definition
export interface Instance {
  id: string
  name: string
  status: string
  ip_addr: string
  ports: {
    [key: string]: { HostPort: string }[]
  }
}

// Launch instance parameters
export interface LaunchInstanceParams {
  name: string
  ssh_port: number
  mem: number
  cpus: number
}
