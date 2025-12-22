import { getSession } from "@/lib/getSession"

export async function GET() {
  const session = await getSession()
  return Response.json(session)
}
