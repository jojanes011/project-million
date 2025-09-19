namespace Million.Domain.Entities
{
    public class Owner
    {
        public Guid IdOwner { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Photo { get; set; } = string.Empty;
        public DateTime Birthday { get; set; }
        public virtual ICollection<Property> Properties { get; set; } = new List<Property>();
    }
}
