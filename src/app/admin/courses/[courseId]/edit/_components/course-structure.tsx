'use client'
import React, {ReactNode, useState} from 'react';
import {
  DndContext, 
rectIntersection,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DraggableSyntheticListeners,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {CSS} from '@dnd-kit/utilities';
import { AdminCourseSingularType } from '@/data/admin/admin-get-course';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, FileText, GripVerticalIcon, Trash2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CollapsibleContent } from '@radix-ui/react-collapsible';
import Link from 'next/link';

interface CourseStructureProps {
  data: AdminCourseSingularType
}
interface SortableItemProps {
  id:string,
  children: (listener:DraggableSyntheticListeners) => ReactNode,
  className?: string,
  data?:{
    type: 'chapter' | 'lesson',
    chapterId?: string, // only for lessons
  }
}

export default function CourseStructure({data}:CourseStructureProps) {

  const initialItems = data.chapter.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    order: chapter.position,
    isOpen: true, // default to expanded,
    lessons: chapter.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      order: lesson.position,
  
    })),

  })) || [];
    const [items, setItems] = useState(initialItems);




 function SortableItem({id, children, className, data}:SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({id,data});
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <div ref={setNodeRef} style={style} {...attributes} className={cn('touch-none', className,isDragging ? 'z-10' : '')} >
      
    {children(listeners)}
      
    </div>
  );
}
     function handleDragEnd(event) {
    const {active, over} = event;
    
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
  function toggleChapter(chapterId: string) {
    setItems((prevItems) => prevItems.map((item) => item.id === chapterId ? {...item, isOpen: !item.isOpen} : item)); // Toggle the isOpen state of the chapter
  }

   const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );


 

  return (
  <DndContext 
      sensors={sensors}
      collisionDetection={rectIntersection}
        onDragEnd={handleDragEnd}

    >
     <Card>
        <CardHeader className='flex flex-row items-center justify-between border-b border-border'>
            <CardTitle>
                Chapters
            </CardTitle>

        </CardHeader>
        <CardContent>

            <SortableContext strategy={verticalListSortingStrategy} items={items}>
                {
                  items.map((item) => (
                    <SortableItem key={item.id} id={item.id} data={{type: 'chapter'}}>
                      {(listeners) => (
                        <Card >
                      <Collapsible open={item.isOpen} onOpenChange={() => toggleChapter(item.id)}>
                      <div className='flex items-center justify-between p-3 border-b border-border'>
                        <div className='flex gap-2 items-center'>
                       <Button size={'icon'} variant={'ghost'} {...listeners} className='cursor-grab opacity-60 hover:opacity-100'>
                        <GripVerticalIcon className='cursor-grab size-4' />
                       </Button>
                       <CollapsibleTrigger asChild >
                       <Button size={'icon'} variant={'ghost'}  className='flex items-center' >
                        {
                          item.isOpen ? (
                            <ChevronDown className='size-4'/> 
                          ):(
                            <ChevronRight className='size-4'/>
                          )
                        }

                       </Button>
                       
                       </CollapsibleTrigger>
                       <p className='cursor-pointer hover:text-primary'>
                        {item.title}
                       </p>
                        </div>

                        <Button variant={'outline'} size={'icon'}>
                          <Trash2Icon className='size-4'/>
                        </Button>

                      </div>

                      <CollapsibleContent>
                      <div className='p-1 '>
                        <SortableContext items={item.lessons.map(lesson => lesson.id)} strategy={verticalListSortingStrategy}>
                          {
                            item.lessons.map((lesson) => (
                              <SortableItem key={lesson.id} id={lesson.id} data={{type: 'lesson', chapterId: item.id}}>
                                {(lessonListener) => (
                                  <div className='flex items-center justify-between p-2 hover:bg-accent rounded-sm '>
                                    <div className='flex items-center gap-2'>
                                      <Button
                                      
                                      size={'icon'} variant={'ghost'} {...lessonListener} >
                                        <GripVerticalIcon className='size-4 opacity-60 hover:opacity-100'  />
                                      </Button>
                                      <FileText className='size-4 opacity-60' />
                                      <Link href={`/admin/courses/${data.id}/${item.id}/${lesson.id}`} className='hover:text-primary'>
                                      <p className='cursor-pointer text-sm font-normal ml-2' >
                                        {lesson.title} 
                                      </p>
                                      </Link>

                                    </div>
                                    <Button variant={'outline'} size={'icon'}>
                                      <Trash2Icon className='size-4'/>
                                    </Button>


                                  </div>

                                )}


                              </SortableItem>
                            ))
                          }


                        </SortableContext>

                        <div className='p-2'>
                          <Button className='w-full' variant={'outline'} >
                            Create New Lesson
                          </Button>

                        </div>

                      </div>
                      </CollapsibleContent>
                      </Collapsible>
                        </Card>
                      )}
                    </SortableItem>
                  ))
                }

            </SortableContext>
        </CardContent>


     </Card>
    </DndContext>
  )
}
