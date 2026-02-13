namespace Portfolio.Api.Models;

public class Project
{
    public int Id { get; set; }

    public string Title { get; set; } = "";
    public string Tagline { get; set; } = "";
    public string Description { get; set; } = "";
    public string Wallpaper { get; set; } = "";
    public string BgClass { get; set; } = "";
    public string ExploreText { get; set; } = "";
    public string? LiveUrl { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}