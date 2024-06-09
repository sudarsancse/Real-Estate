{
  /* Custom file input component */
}
export const FileInput = ({onChange, existingImageUrls}) => {
  return (
    <div>
      <input
        onChange={onChange}
        className="hidden" // Hide the default file input
        type="file"
        id="imageURL"
        accept="image/*"
        multiple
      />
      <div>
        {/* Display existing image URLs */}
        {existingImageUrls.map((url, index) => (
          <div key={index}>
            <p>{url}</p>
          </div>
        ))}
      </div>
      <label
        htmlFor="imageURL"
        className="p-3 border border-gray-300 rounded w-full cursor-pointer"
      >
        Choose Images
      </label>
    </div>
  );
};
