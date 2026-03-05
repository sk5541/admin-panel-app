"use client"
import { useEffect, useState } from "react"
import supabase from "@/lib/supabaseClient"

export default function UsersPage() {
    const [users, setUsers ] = useState<any[]>([])
    useEffect(() => {
        getUsers()
    }, [])

    async function getUsers() {
        const { data } = await supabase
            .from("profiles")
            .select("*")

        setUsers(data || [])
    }

    return (
        <div>
            <h1>Users</h1>
            {users.map((user) => (
                <div key={user.id}>
                    <p>Name: {user.firt_name} {user.last_name}</p>
                    <p>Email: {user.email}</p>
                    <p>Superadmin: {user.is_superadmin ? "Yes" : "No"}</p>
                    <hr/>
                </div>
            ))}
        </div>
    )
}