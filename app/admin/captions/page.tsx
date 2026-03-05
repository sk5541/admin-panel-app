"use client"
import { useEffect, useState } from "react"
import supabase from "@/lib/supabaseClient"

export default function CaptionsPage() {
    const [captions, setCaptions ] = useState<any[]>([])
    useEffect(() => {
        getCaptions()
    }, [])

    async function getCaptions() {
        const { data } = await supabase
            .from("captions")
            .select("*")

        setCaptions(data || [])
    }

    return (
        <div>
            <h1>Captions</h1>
            {captions.map((caption) => (
                <div key={caption.id}>
                    <p>{caption.content}</p>
                </div>
            ))}
        </div>
    )
}