"use client"
import { Editor } from "@tiptap/react"
import React from "react"
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "../ui/tooltip"
import { Toggle } from "../ui/toggle"
import {
  Bold,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Redo,
  Undo,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"

interface MenubarProps {
  editor: Editor | null
}

export default function Menubar({ editor }: MenubarProps) {
  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2 border  border-t-0 border-x-0 border-input rounded-t-lg bg-card items-center ">
    <TooltipProvider>
      <div className="flex p-2 gap-2 flex-wrap">
        {/* Bold */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("bold")}
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={cn(
                editor.isActive("bold") && "bg-muted text-muted-foreground"
              )}
            >
              <Bold className="size-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bold</p>
          </TooltipContent>
        </Tooltip>

        {/* Italic */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("italic")}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={cn(
                editor.isActive("italic") && "bg-muted text-muted-foreground"
              )}
            >
              <Italic className="size-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>
            <p>Italic</p>
          </TooltipContent>
        </Tooltip>

        {/* Strike */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("strike")}
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={cn(
                editor.isActive("strike") && "bg-muted text-muted-foreground"
              )}
            >
              <Strikethrough className="size-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>
            <p>Strikethrough</p>
          </TooltipContent>
        </Tooltip>

        {/* Heading 1 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("heading", { level: 1 })}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={cn(
                editor.isActive("heading", { level: 1 }) &&
                  "bg-muted text-muted-foreground"
              )}
            >
              <Heading1Icon className="size-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>
            <p>Heading 1</p>
          </TooltipContent>
        </Tooltip>

        {/* Heading 2 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("heading", { level: 2 })}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={cn(
                editor.isActive("heading", { level: 2 }) &&
                  "bg-muted text-muted-foreground"
              )}
            >
              <Heading2Icon className="size-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>
            <p>Heading 2</p>
          </TooltipContent>
        </Tooltip>

        {/* Heading 3 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("heading", { level: 3 })}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={cn(
                editor.isActive("heading", { level: 3 }) &&
                  "bg-muted text-muted-foreground"
              )}
            >
              <Heading3Icon className="size-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>
            <p>Heading 3</p>
          </TooltipContent>
        </Tooltip>

        {/* Bullet List */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("bulletList")}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={cn(
                editor.isActive("bulletList") && "bg-muted text-muted-foreground"
              )}
            >
              <List className="size-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bullet List</p>
          </TooltipContent>
        </Tooltip>

        {/* Ordered List */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive("orderedList")}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={cn(
                editor.isActive("orderedList") &&
                  "bg-muted text-muted-foreground"
              )}
            >
              <ListOrdered className="size-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ordered List</p>
          </TooltipContent>
        </Tooltip>
<div className="w-px h-6 bg-border mx-2">


</div>
<div className="flex flex-wrap gap-1">
      <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive({textalign: 'left'})}
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={cn(
                editor.isActive({textalign: 'left'}) &&
                  "bg-muted text-muted-foreground"
              )}
            >
              <AlignLeft className="size-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>
            <p>Align Left</p>
          </TooltipContent>
        </Tooltip>
      <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive({textalign: 'center'})}
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={cn(
                editor.isActive({textalign: 'center'}) &&
                  "bg-muted text-muted-foreground"
              )}
            >
              <AlignCenter className="size-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>
            <p>Align Center</p>
          </TooltipContent>
        </Tooltip>
      <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              size="sm"
              pressed={editor.isActive({textalign: 'right'})}
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={cn(
                editor.isActive({textalign: 'right'}) &&
                  "bg-muted text-muted-foreground"
              )}
            >
              <AlignRight className="size-4" />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>
            <p>Align Right</p>
          </TooltipContent>
        </Tooltip>

</div>
<div className="w-px h-6 bg-border mx-2">
    <div className="flex ">
          <Tooltip>
          <TooltipTrigger asChild>
            <Button 
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()} // disable if cannot undo
            size={'sm'} variant={'ghost'} type="button">
                <Undo className="size-4" />

            </Button>
           
          </TooltipTrigger>
          <TooltipContent>
           Undo
          </TooltipContent>
        </Tooltip>

          <Tooltip>
          <TooltipTrigger asChild>
            <Button 
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()} // disable if cannot redo
            size={'sm'} variant={'ghost'} type="button">
                <Redo className="size-4" />

            </Button>
           
          </TooltipTrigger>
          <TooltipContent>
           Undo
          </TooltipContent>
        </Tooltip>

    </div>

</div>
   
      </div>
    </TooltipProvider>
    </div>

  )
}
