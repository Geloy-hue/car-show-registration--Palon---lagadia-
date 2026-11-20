
using Api.Common.Extensions;
using Api.Features.Registrations;

using Application.Abstractions.Data;
using Application.Abstractions.Messaging;

using Application.Features.Registrations;
using Application.Features.Registrations.CreateRegistration;
using Application.Features.Registrations.GetRegistrations;
using Application.Features.Registrations.GetRegistrationById;
using Application.Features.Registrations.GetRegistrationSummary;

using Domain.Common;
using FluentValidation;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Database - SQLite
builder.Services.AddDbContext<IAppDbContext, AppDbContext>(options =>
    options.UseSqlite(
        "Data Source=carshow.db",
        b => b.MigrationsAssembly("Infrastructure")));

// Validators
builder.Services.AddValidatorsFromAssembly(
    typeof(CreateRegistrationValidator).Assembly);

// Registration Number Generator
builder.Services.AddScoped<RegistrationNumberGenerator>();

// Command Handlers
builder.Services.AddScoped<
    ICommandHandler<CreateRegistrationCommand, Result<CreateRegistrationResponse>>,
    CreateRegistrationHandler>();

// Query Handlers
builder.Services.AddScoped<
    IQueryHandler<GetRegistrationsQuery, Result<GetRegistrationsResponse>>,
    GetRegistrationsHandler>();

builder.Services.AddScoped<
    IQueryHandler<GetRegistrationByIdQuery, Result<GetRegistrationByIdResponse>>,
    GetRegistrationByIdHandler>();

builder.Services.AddScoped<
    IQueryHandler<GetRegistrationSummaryQuery, Result<GetRegistrationSummaryResponse>>,
    GetRegistrationSummaryHandler>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Enum serialization
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(
        new JsonStringEnumConverter());
});

// OpenAPI and Scalar
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, _, _) =>
    {
        document.Info.Title = "Car Show Registration System";
        document.Info.Description = "Car Show Registration API";
        return Task.CompletedTask;
    });
});

var app = builder.Build();

// Database Migration and Seed Data
using (var scope = app.Services.CreateAsyncScope())
{
    var dbContext = scope.ServiceProvider
        .GetRequiredService<AppDbContext>();

    await dbContext.Database.MigrateAsync();

    await RegistrationSeeder.SeedAsync(dbContext);
}

// Middleware
app.UseCors("ReactFrontend");

// Scalar
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

// Welcome endpoint
app.MapGet("/", () =>
    "Welcome to the Car Show Registration API! Go to /scalar/v1 for API documentation.");

// Registration endpoints
app.MapRegistrationEndpoints();

app.Run();


