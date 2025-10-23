'use client'
import React,{useCallback, useEffect, useState} from 'react'
import {FileRejection, useDropzone} from 'react-dropzone'
import { Card, CardContent } from '../ui/card';
import { cn } from '@/lib/utils';
import {RenderEmptyState,RenderErrorState,RenderUploadedState} from './render-state';
import { toast } from 'sonner';
import {v4 as uuid} from 'uuid'

import { Progress } from '../ui/progress';
import { useConstructUrl } from '@/hooks/use-construct-url';

interface FileUploaderProps {
    id: string | null,
  file: File | null,
  uploading: boolean,
  progress: number,
  key?: string ,
  isDeleting:boolean,
  objectUrl?:string,
  error:boolean,
  fileType: 'image' | 'video' ,
}
interface UploadFormDataProps {
    value?: string,
    onChange?:(value:string) => void,
    fileTypeAccepted: 'image' | 'video',
}

export default function FileUploader({onChange,value,fileTypeAccepted}:UploadFormDataProps) {
    const fileUrl = useConstructUrl(value || '');
const [fileState, setFileState] = useState<FileUploaderProps>({
    id: null,
    error: false,
    file: null,
    uploading: false,
    progress: 0,
    key: value,

    isDeleting: false,
    objectUrl: value ? fileUrl : undefined,

    fileType: fileTypeAccepted,
});
const uploadFile = useCallback(  async (file:File) => {
    setFileState((prev) => ({
        ...prev,
        uploading:true,
        progress:0,
    }))
    try{
        // get presigned url from our api
        const presignedResponse = await fetch('/api/s3/upload',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                fileName:file.name,
                contentType:file.type,
                size:file.size,
                isImage: fileTypeAccepted === 'image' ? true : false,
            }) // our api will use this to get presigned url from s3 
        })
        if(!presignedResponse.ok) {
            toast.error('Failed to get presigned url')
            setFileState((prev) => ({
                ...prev,
                uploading:false,
                error:true,
                progress:0,
            }))
            return;
        }

        const {   presignedUrl, key } = await presignedResponse.json();
        await new Promise<void>((resolve,reject) => {
            const xhr = new XMLHttpRequest(); // to upload file to s3
            xhr.upload.onprogress= (event) => {
                if(event.lengthComputable) {
                    const percenttageCompleted = (event.loaded / event.total) * 100;
                    setFileState((prev) => ({
                        ...prev,
                        progress: Math.round(percenttageCompleted),
                    }))
                }
            }

            xhr.onload = () => { {
                if(xhr.status === 200 || xhr.status === 204) {
                  setFileState((prev) => ({
                    ...prev,
                   
                    progress:100,
                     uploading:false,
                    key:key,
                
                  })) // successfully uploaded

                  onChange?.(key); // notify parent component of the new file key





                  toast.success('File uploaded successfully')
                    resolve()
                } else {
                    reject(new Error('Upload failed...'))
                }
              
               
            } }
              xhr.onerror = () => {
                    reject(new Error('Upload failed...'))
                }
             xhr.open('PUT',  presignedUrl) // upload file to this url
                xhr.setRequestHeader('Content-Type', file.type);
                xhr.send(file)
        })  
    }
    catch {
        toast.error('Failed to upload file')
        setFileState((prev) => ({
            ...prev,
        
            error:true,
            progress:0,
                uploading:false,
        }))
    }
},[onChange,fileTypeAccepted]) // dependencies

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if(acceptedFiles.length > 0) {

            // clean memory when ever we get a new file
            if(fileState.objectUrl && !fileState.objectUrl.startsWith('http')) {
                URL.revokeObjectURL(fileState.objectUrl);
            }



    
            const file = acceptedFiles[0];
            setFileState({
                file:file,
                uploading:false,
                progress:0,
                objectUrl:URL.createObjectURL(file),
                error:false,
                id: uuid(),
                
             
                isDeleting:false,
                fileType: fileTypeAccepted,
            })

            uploadFile(file);

        }
    


        
  }, [fileState.objectUrl,fileTypeAccepted,uploadFile]) // dependencies


async function handleRemoveFile() {
    if(fileState.isDeleting || !fileState.objectUrl) return // prevent multiple clicks or no file to delete 
    try {
        setFileState((prev)  => ({
            ...prev,
            isDeleting:true,
        }))

        const response = await fetch('/api/s3/delete', {
            method:'DELETE',
            headers:{ 'Content-Type':'application/json'},
            body: JSON.stringify({
                key: fileState.key,
            })
        })

        if(!response.ok) {
            toast.error('Failed to delete file from server')
            setFileState((prev) => ({
                ...prev,
                isDeleting:false,
                error:true,
            }))
            return;
        }
          if(fileState.objectUrl && !fileState.objectUrl.startsWith('http')) {
            URL.revokeObjectURL(fileState.objectUrl);
        }   
            onChange?.(''); // notify parent component that file has been removed
        setFileState(() =>({
            file:null,
            uploading:false,
            progress:0,
            objectUrl:undefined,
            error:false,
            id:null,
            
            isDeleting:false,
            key:undefined,
            fileType: fileTypeAccepted,
        }))
           
        toast.success('File deleted successfully')

        
        
    } catch (error) {
        toast.error('Failed to delete file')
        setFileState((prev) => ({
            ...prev,
            isDeleting:false,
            error:true,
        }) )
        console.error(error)
        
    }
    
}

  function rejectedFile(fileRejection: FileRejection[]) {
    if(fileRejection.length) {
        const tooManyFiles = fileRejection.find((rejection) =>rejection.errors[0].code === 'too-many-files');
            const fileTooLarge = fileRejection.find((rejection) =>rejection.errors[0].code === 'file-too-large');
        if(tooManyFiles) {
            toast.error('Too many files selected, max is 1')
        }
        if(fileTooLarge) {
            toast.error('File is too large, max size is 5MB')
        }
    }
  }     
  
  function renderContent(){
    if(fileState.uploading) {
        return (
            <RenderUploadingState progress={fileState.progress} file={fileState.file as File}/>
        )
    }
    if(fileState.error) {
        return <RenderErrorState/>;
    }
    if(fileState.objectUrl){
        return (
            <RenderUploadedState
            fileType={fileState.fileType}
            previewUrl={fileState.objectUrl} isDeleting={fileState.isDeleting} handleRemoveFile={handleRemoveFile}/>
        )
    }

    return <RenderEmptyState isDragActive={isDragActive}/>;


  }

  useEffect(() =>{

    return () => {
        if(fileState.objectUrl && !fileState.objectUrl.startsWith('http')) {
            URL.revokeObjectURL(fileState.objectUrl);
        }   
    }

  },[fileState.objectUrl])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept: fileTypeAccepted === 'image' ? {
            'image/*': []
        } : {
            'video/*': []
        },
        
        maxFiles:1,
        multiple:false,
        
        maxSize: fileTypeAccepted === 'image' ? 5 * 1024 * 1024 : 50 * 1024 * 1024, // 5MB for image and 50MB for video
        onDropRejected: rejectedFile,
        disabled: fileState.uploading || !!fileState.objectUrl, // disable when uploading or deleting




      })
 
  return (
    <Card {...getRootProps()} className={cn(' relative border border-dashed transition-colors duration-200 ease-in-out w-full h-60',
        isDragActive ? 'border-primary bg-primary/10 border-solid' : 'border-border hover:border-primary'




    )}>
        <CardContent className='flex items-center justify-center h-full w-full p-4'> 
      <input {...getInputProps()} />
      
  {renderContent()}

      </CardContent>
       
    </Card>
  )
}



export function RenderUploadingState({progress,file}:{progress:number,file:File}) {
    return (
    <div className='text-center flex justify-center items-center flex-col'>
        <Progress value={progress} className='w-48'/>
        <p className='mt-2 text-sm font-medium text-muted-foreground'>
            uploading
        </p>
        <p className='mt-1 text-sx text-muted-foreground truncate max-w-xs'>
            {file.name}
        </p>

    </div>
    )
}