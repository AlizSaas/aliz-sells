'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'

import React from 'react'
import Menubar from './menubar'

interface Field {
     name: string
  value: any
  onChange: (event: any) => void
  onBlur: () => void
  ref: React.Ref<any>
}

export default function RichTextEditor({ field }: { field: Field }) {
    const editor = useEditor({
        extensions: [StarterKit,TextAlign.configure({
            types: ['heading', 'paragraph'],
        })],
        immediatelyRender: false,
        editorProps:{
            attributes:{
                class:'min-h-[300px]  p-4 focus:outline-none prose-sm sm:prose  lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none'

            }
        },
        onUpdate:({editor}) => {

            field.onChange(JSON.stringify(editor.getJSON())) // store the content as JSON string
        },
        content: field.value ? JSON.parse(field.value) : `<p>Hello world</p>`, // initialize with existing content if available
     
    })
  return (
    <div className='border border-input rounded-lg overflow-hidden dark:bg-input/30'>
        <Menubar editor={editor} />
        <EditorContent editor={editor} />
    </div>
  )
}
