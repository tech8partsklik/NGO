<!-- Single Image Upload
<MediaUploader
  label="Banner Image"
  accept="image"
  multiple={false}
  value={existingImageURL}
  onChange={(file) => setForm({ ...form, file })}
/>



Upload Both (image/video)
<MediaUploader
  label="Media"
  accept="both"
  onChange={(file) => setFile(file)}
/>



Multi Upload (images gallery)
<MediaUploader
  label="Gallery Images"
  multiple={true}
  accept="image"
  onChange={(files) => setGallery(files)}
/> -->