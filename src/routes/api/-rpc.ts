// TanStack Start API route handler
// This file exports HTTP method handlers for the /api/rpc endpoint
import { rpcHandler } from '../../server/rpc-handler'

// Debug: Log when route file is loaded
console.log('✅ RPC route handler loaded at /api/rpc')

// Export GET handler
export async function GET(request: Request) {
  console.log('📥 GET request to /api/rpc')
  try {
    return await rpcHandler(request)
  } catch (error) {
    console.error('RPC GET error:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

// Export POST handler
export async function POST(request: Request) {
  console.log('📥 POST request to /api/rpc')
  try {
    return await rpcHandler(request)
  } catch (error) {
    console.error('RPC POST error:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
