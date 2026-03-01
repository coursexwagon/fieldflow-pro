import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { uploadImage, deleteImage } from '@/lib/cloudinary';
import { supabase } from '@/lib/db';

// POST /api/jobs/[id]/photos - Add a photo to a job
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { file, caption } = body;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check if job belongs to user
    const job = await db.job.findFirst({
      where: { id, userId: user.id },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Upload to Cloudinary
    const result = await uploadImage(file, `fieldflow/jobs/${id}`);

    // Save to database
    const photo = await db.photo.create({
      data: {
        url: result.url,
        publicId: result.publicId,
        caption: caption || null,
        jobId: id,
      },
    });

    return NextResponse.json({ photo });
  } catch (error) {
    console.error('Add photo error:', error);
    return NextResponse.json({ error: 'Failed to add photo' }, { status: 500 });
  }
}

// DELETE /api/jobs/[id]/photos - Delete a photo from a job
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const photoId = searchParams.get('photoId');

    if (!photoId) {
      return NextResponse.json({ error: 'Photo ID required' }, { status: 400 });
    }

    // Check if job belongs to user
    const job = await db.job.findFirst({
      where: { id, userId: user.id },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Get the photo
    const { data: photos } = await supabase
      .from('photos')
      .select('*')
      .eq('id', photoId)
      .eq('jobId', id);

    const photo = photos?.[0];
    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    // Delete from Cloudinary
    await deleteImage(photo.publicId as string);

    // Delete from database
    await db.photo.delete({ where: { id: photoId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete photo error:', error);
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 });
  }
}
