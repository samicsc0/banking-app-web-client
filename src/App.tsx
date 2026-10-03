import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function App() {
  return (
    <div className="flex min-h-svh flex-col gap-6 bg-background p-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button>Primary</Button>
        <Button variant="soft">Soft</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button size="compact">Compact</Button>
        <Button size="compact" variant="outline">
          Compact outline
        </Button>
        <Button disabled>Disabled</Button>
      </div>
      <div className="flex max-w-sm flex-col gap-3">
        <Input placeholder="Account number" defaultValue="100234" />
        <Input placeholder="Placeholder only" />
        <Input placeholder="Disabled field" disabled defaultValue="Frozen" />
      </div>
    </div>
  )
}

export default App
