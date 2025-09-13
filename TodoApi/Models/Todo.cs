using System.ComponentModel.DataAnnotations;

namespace TodoApi.Models;

public class Todo
{
  public int Id { get; set; }

  [Required]
  public string Text { get; set; } = string.Empty;

  public bool Completed { get; set; }
}
