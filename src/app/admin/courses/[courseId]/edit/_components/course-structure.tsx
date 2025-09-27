'use client'
import React, {ReactNode, useEffect, useState} from 'react';
import {
  DndContext, 
rectIntersection,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DraggableSyntheticListeners,
  DragEndEvent,
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
import { toast } from 'sonner';
import { reOrderChapters, reOrderLessons } from '../action';
import NewChapterModal from './new-chapter-model';
import NewLessonModal from './new-lesson-model';
import DeleteLesson from './delete-lesson';
import DeleteChapter from './delete-chapter';


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
    id: chapter.id, // unique id for DnD
    title: chapter.title,
    order: chapter.position,
    isOpen: true, // default to expanded,
    lessons: chapter.lessons.map((lesson) => ({
      id: lesson.id, // unique id for DnD
      title: lesson.title,
      order: lesson.position,
  
    })),

  })) || [];
    const [items, setItems] = useState(initialItems);

    useEffect(() => {
      setItems((prevItems) => {
        const updatedItems = data.chapter.map((chapter) => ({
          id: chapter.id,
          title: chapter.title,
          order: chapter.position,
          isOpen: prevItems.find((item) => item.id === chapter.id)?.isOpen ?? true, // Preserve isOpen state
          lessons: chapter.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            order: lesson.position,
          })),
        })) || [];

        return updatedItems;
      });
    }, [data]); // Update items when data changes





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
     function handleDragEnd(event:DragEndEvent) {
    const {active, over} = event;
    if(!over || active.id === over.id) return; // If no valid drop target or dropped in the same place, do nothing


const activeId = active.id; // id of the item being dragged
const overId = over.id; // id of the item being dragged over
const activeType =  active.data.current?.type as 'chapter' | 'lesson'; // type of the item being dragged
const overType = over.data.current?.type as 'chapter' | 'lesson'; // type of the item being dragged over

const courseId = data.id; // course id from props\

if(activeType === 'chapter') {
    let targetChapterId = null;

    if(overType === 'chapter') {
      targetChapterId = overId;
    } else if(overType === 'lesson') {
      targetChapterId = over.data.current?.chapterId ?? null
    }

    if(!targetChapterId) {
      toast.error('Could not determine target chapter for reordering');
      return
    }

    const oldIndex = items.findIndex(item => item.id === activeId);
    const newIndex = items.findIndex(item => item.id === targetChapterId);

    if(oldIndex === -1 || newIndex === -1) {
      toast.error('Could not find chapter to reorder');
      return;
    }

    const reordedLocalChapters = arrayMove(items, oldIndex, newIndex);
 const updatedChapterForState = reordedLocalChapters.map((item, index) => ({
      ...item,
      order: index + 1, // Update order based on new position
    }));

    const previousItems = [...items];
    setItems(updatedChapterForState);

    if(courseId) {
      const chapterToUpdate = updatedChapterForState.map((chapter) => ({
        id: chapter.id,
        position: chapter.order,
      }));
      const reorderChapterPromise = () => reOrderChapters(chapterToUpdate, courseId);


      toast.promise(reorderChapterPromise(),{
        loading: 'Reordering chapters...',
        success: (result) => {
          if(result.status === 'success')   return result.message
           
            throw new Error(result.message)
          
        },
        error: (err) => {
          setItems(previousItems); // Revert to previous state on error
          return err?.message || 'Could not reorder chapters'
        }
      })
    }

    return 





} // End of if activeType is chapter


if(activeType === 'lesson' && overType === 'lesson') {
  const chapterId = active.data.current?.chapterId; // chapter id of the lesson being dragged
  const overChapterId = over.data.current?.chapterId; // chapter id of the lesson being dragged over
  if(!chapterId || chapterId !== overChapterId) {
    toast.error('lesson move betweeen chapters or invalid chapter id is not allowed');
    return
  }

  const chapterIndex = items.findIndex(item => item.id === chapterId); // Find the chapter index

  if(chapterIndex === -1) {
    toast.error('Could not find chapter for reordering lessons');
    return;
  }


  const chapterToUpdate = items[chapterIndex]; // Get the chapter to update

  const oldLessonIndex = chapterToUpdate.lessons.findIndex(lesson => lesson.id === activeId);
  const newLessonIndex = chapterToUpdate.lessons.findIndex(lesson => lesson.id === overId);

  if(oldLessonIndex === -1 || newLessonIndex === -1) {
    toast.error('Could not find lesson to reorder');
    return;
  }


  const reorderedLessons = arrayMove(chapterToUpdate.lessons, oldLessonIndex, newLessonIndex);



  const updatedLessonForState = reorderedLessons.map((lesson, index) => ({
      ...lesson,
      order: index + 1, // Update order based on new position
    }));
  


  const newItems = [...items]; // Create a copy of the items array

  newItems[chapterIndex] = {
    ...chapterToUpdate,
    lessons: updatedLessonForState, // Update the lessons with the reordered array
  };

  const prevItem  = [...items];

  setItems(newItems);
if(courseId) {

  const lessonToUpdate = reorderedLessons.map((lesson) => ({
      id: lesson.id,
      position: lesson.order,
    }));

    const reorderLessonPromise = () => reOrderLessons(chapterId, lessonToUpdate, courseId);

    toast.promise(reorderLessonPromise(),{
      loading: 'Reordering lessons...',
      success: (result) => {
        if(result.status === 'success')  return result.message
        throw new Error(result.message)

   
        

      },
      error: (err) => {
        setItems(prevItem); // Revert to previous state on error
        return err?.message || 'Could not reorder lessons'
      }
    })

}


return










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
     <Card className=''>
        <CardHeader
        
        className='flex flex-row items-center justify-between border-b border-border'>
            <CardTitle>
                Chapters
            </CardTitle>

            <NewChapterModal courseId={data.id} />

        </CardHeader>
        <CardContent className='space-y-8'>

            <SortableContext strategy={verticalListSortingStrategy} items={items} >
                {
                  items.map((item) => (
                    <SortableItem key={item.id} id={item.id} data={{type: 'chapter'}} className=''>
                      {(listeners) => (
                        <Card className=''>
                      <Collapsible open={item.isOpen} onOpenChange={() => toggleChapter(item.id)}>
                      <div className='flex items-center justify-between p-3 border-b border-border '>
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

                     <DeleteChapter
                       chapterId={item.id}
                       courseId={data.id}
                     />

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
                                      className='cursor-grab opacity-60 hover:opacity-100'
                                      
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
                                
                                  <DeleteLesson 
                                  chapterId={item.id}

                                  lessonId={lesson.id}
                                  courseId={data.id}
                                  
                                  />
                                   


                                  </div>

                                )}


                              </SortableItem>
                            ))
                          }


                        </SortableContext>

                        <div className='p-2 '>
                         <NewLessonModal courseId={data.id} chapterId={item.id} />

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
