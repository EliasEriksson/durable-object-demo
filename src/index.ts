interface Environment {
  counter: DurableObjectNamespace
}

export default {
  async fetch(request: Request, environment: Environment): Promise<Response> {
    return await handleRequest(request, environment)
  }
}

const handleRequest = async (request: Request, environment: Environment): Promise<Response> => {
  const url = new URL(request.url)
  const match = url.pathname.match(/(?<=^|\/)([^/])+(?=\/|$)/g) /* /finds/these/words/ */
  if (!match || match.length > 3) return new Response("badly formatted url.", { status: 400}) 
  const [objectName] = match
  const id = environment.counter.idFromName(objectName)
  const stub = environment.counter.get(id)
  return await stub.fetch(request)
  
}

export class Counter {
  constructor(
    private readonly state: DurableObjectState, 
    private readonly environment: Environment
    ) {}
  handleResource = async (resource: string, method: string): Promise<Response> => {
    let current = await this.state.storage.get<number>(resource) ?? 0
    switch (method) {
      case "increment": await this.state.storage.put<number>(resource, ++current); break
      case "decrement": await this.state.storage.put<number>(resource, --current); break
      case "read": break
      default: return new Response("action not supported.", { status: 400 })
    }
    return new Response(JSON.stringify(current), { status: 200 })
  }
  handleList = async (): Promise<Response> => {
    return new Response(JSON.stringify(Object.fromEntries(await this.state.storage.list<number>()), null, 2), { status: 200})
  }

  async fetch(request: Request): Promise<Response>{
    const url = new URL(request.url)
    const match = url.pathname.match(/(?<=^|\/)([^/])+(?=\/|$)/g) /* /finds/these/words/ */
    if (!match || (match.length != 1 && match.length != 3)) return new Response("badly formatted url.", { status: 400 })
    const [_, resource, action] = match
    return resource ? this.handleResource(resource, action) : this.handleList()
  }
}