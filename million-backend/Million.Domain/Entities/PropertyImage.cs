namespace Million.Domain.Entities
{
    public class PropertyImage
    {
        public Guid IdPropertyImage { get; set; }
        public Guid IdProperty { get; set; }
        public string File { get; set; } = string.Empty; // URL de Cloudinary
        public string PublicId { get; set; } = string.Empty; // ID público de Cloudinary
        public bool Enabled { get; set; }
        public virtual Property? Property { get; set; }
    }
}
