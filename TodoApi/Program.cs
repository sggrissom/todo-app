using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<TodoContext>(options =>
    options.UseSqlite("Data Source=todos.db"));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<TodoContext>();
    context.Database.EnsureCreated();
}

app.UseStaticFiles();
app.UseDefaultFiles();

app.MapGet("/todos", async (TodoContext context) =>
{
    return await context.Todos.ToListAsync();
})
.WithName("GetTodos")
.WithOpenApi();

app.MapPost("/todos", async (Todo newTodo, TodoContext context) =>
{
    newTodo.Id = 0;
    context.Todos.Add(newTodo);
    await context.SaveChangesAsync();
    return Results.Created($"/todos/{newTodo.Id}", newTodo);
})
.WithName("CreateTodo")
.WithOpenApi();

app.MapDelete("/todos/{id}", async (int id, TodoContext context) =>
{
    var todo = await context.Todos.FindAsync(id);
    if (todo == null) {
        return Results.NotFound();
    }

    context.Todos.Remove(todo);
    await context.SaveChangesAsync();
    return Results.Ok();
})
.WithName("DeleteTodo")
.WithOpenApi();

app.MapPut("/todos/{id}", async (int id, Todo updatedTodo, TodoContext context) =>
{
    var todo = await context.Todos.FindAsync(id);
    if (todo == null)
        return Results.NotFound();

    todo.Text = updatedTodo.Text;
    todo.Completed = updatedTodo.Completed;

    await context.SaveChangesAsync();
    return Results.Ok(todo);
})
.WithName("UpdateTodo")
.WithOpenApi();

app.MapFallbackToFile("index.html");

app.Run();
