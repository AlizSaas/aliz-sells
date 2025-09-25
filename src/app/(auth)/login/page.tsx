import { getServerSession } from "@/lib/get-session"
import { redirect } from "next/navigation"
import LoginForm from "./_components/LoginForm"



export default async function Login() {
  const session = await getServerSession()
  if (session) {
    redirect('/')
  }


  return <LoginForm />
}
