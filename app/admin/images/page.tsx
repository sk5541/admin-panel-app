"use client"
import { useEffect, useState } from "react"
import supabase from "@/lib/supabaseClient"

export default function ImagesPage() {
    const [images, setImages] = useState<any[]>([])
    const [url, setUrl ] = useState("")
    const [editingId, setEditingId] = useState<number | null>(null)

    useEffect(() => {
        getImages()
    }, [])

    async function getImages() {
        const { data } = await supabase
            .from("images")
            .select("*")
        setImages(data || [])
    }

    async function createImage() {
        await supabase
            .from("images")
            .insert([{ url }])
        
        setUrl("")
        getImages()
    }

    async function updateImage(id: number) {
        await supabase
            .from("images")
            .update({ url })
            .eq("id", id)
        
        setEditingId(null)
        setUrl("")
        getImages()
    }

    async function deleteImage(id: number) {
        await supabase
            .from("images")
            .delete()
            .eq("id", id)
        
        getImages()
    }

    return (
        <div>
            <h1>Images</h1>
            <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Image URL"
            />

            {editingId ? (
                <button onClick={() => updateImage(editingId)}>Update</button>
            ) : (
                <button onClick={createImage}>Add Image</button>
            )}

            {images.map((image) => (
                <div key={image.id}>
                    <p>{image.url}</p>
                    <button onClick={() => {
                        setEditingId(image.id)
                        setUrl(image.url)
                    }}>
                        Edit
                    </button>
                    <button onClick={() => deleteImage(image.id)}>
                        Delete
                    </button>
                </div>
            ))}
        </div>
    )
}