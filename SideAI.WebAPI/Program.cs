using SideAI.Application.Common.Interfaces;
using SideAI.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Servis Kayıtları
builder.Services.AddSingleton<IAdminMetricsService, AdminMetricsService>();
builder.Services.AddHttpClient<IAgentService, GeminiAgentService>();
builder.Services.AddScoped<ITravelService, TravelService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run();