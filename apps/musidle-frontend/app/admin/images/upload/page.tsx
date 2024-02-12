'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import axios, { AxiosError } from 'axios';
import React, { useState } from 'react';

interface IImageData {
  description: string;
}

function ImageUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<IImageData>({ description: '' });

  const onUpload = async (file: File, data: IImageData) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/externalApi/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 201) {
        return toast({
          title: 'Success',
          description: 'Image uploaded successfully',
        });
      }
      throw new Error('Image upload failed');
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: 'Error',
          description: error.response?.data.message || 'Image upload failed',
          variant: 'destructive',
        });
      }
      console.error(error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files ? event.target.files[0] : null);
  };

  const handleDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (file) {
      onUpload(file, data);
    }
  };

  return (
    <div className="container h-4/5">
      <Card className="h-full w-full flex items-center justify-center ">
        <form onSubmit={handleSubmit} className="grid gap-4 ">
          <Input type="file" onChange={handleFileChange} className=" cursor-pointer" />
          <Input
            type="text"
            name="description"
            value={data.description}
            onChange={handleDataChange}
            placeholder="Description"
          />
          <Button type="submit" className="w-full">
            Upload
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default ImageUpload;
