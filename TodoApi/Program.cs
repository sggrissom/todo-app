var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapGet("/todos", () =>
{
    var todos = new[]
    {
        new Todo(1, "completed todo", false),
        new Todo(2, "todo 1", true),
        new Todo(3, "todo 2", false),
        new Todo(4, "todo 3", false)
    };
    return todos;
})
.WithName("GetTodos")
.WithOpenApi();

app.MapPost("/todos", (Todo newTodo) =>
{
    var createdTodo = newTodo with { Id = Random.Shared.Next(1000, 9999) };
    return Results.Created($"/todos/{createdTodo.Id}", createdTodo);
})
.WithName("CreateTodo")
.WithOpenApi();

app.MapDelete("/todos/{id}", (int id) =>
{
    return Results.Ok($"Deleted todo {id}");
})
.WithName("DeleteTodo")
.WithOpenApi();

app.MapPut("/todos/{id}", (int id, Todo updatedTodo) =>
{
    return Results.Ok(updatedTodo with { Id = id });
})
.WithName("UpdateTodo")
.WithOpenApi();

app.Run();

record Todo(int Id, string Text, bool Completed);
