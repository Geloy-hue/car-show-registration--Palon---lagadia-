
namespace Api.Features.Registrations;

using Api.Common.Extensions;
using Api.Common.Filters;
using Application.Abstractions.Messaging;
using Application.Features.Registrations.CreateRegistration;
using Application.Features.Registrations.GetRegistrations;
using Application.Features.Registrations.GetRegistrationById;
using Application.Features.Registrations.GetRegistrationSummary;
using Domain.Common;
using Microsoft.AspNetCore.Mvc;

public static class RegistrationEndpoints
{
    public static IEndpointRouteBuilder MapRegistrationEndpoints(
        this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/registrations")
            .WithTags("Registrations");

        group.MapPost("/", CreateRegistration)
            .AddEndpointFilter<ValidationFilter<CreateRegistrationCommand>>()
            .Produces<CreateRegistrationResponse>(201)
            .ProducesProblem(400)
            .ProducesProblem(409);

        group.MapGet("/", GetRegistrations)
            .AddEndpointFilter<ValidationFilter<GetRegistrationsQuery>>()
            .Produces<GetRegistrationsResponse>(200)
            .ProducesProblem(400);

        group.MapGet("/{id:guid}", GetRegistrationById)
            .Produces<GetRegistrationByIdResponse>(200)
            .ProducesProblem(404);

        group.MapGet("/summary", GetRegistrationSummary)
            .Produces<GetRegistrationSummaryResponse>(200);

        return app;
    }

    private static async Task<IResult> CreateRegistration(
        CreateRegistrationCommand command,
        ICommandHandler<CreateRegistrationCommand, Result<CreateRegistrationResponse>> handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.HandleAsync(command, cancellationToken);

        if (!result.IsSuccess)
            return result.ToProblemDetails();

        return Results.Created(
            $"/api/registrations/{result.Value!.Id}",
            result.Value);
    }

    private static async Task<IResult> GetRegistrations(
        [AsParameters] GetRegistrationsQuery query,
        IQueryHandler<GetRegistrationsQuery, Result<GetRegistrationsResponse>> handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.HandleAsync(query, cancellationToken);

        if (!result.IsSuccess)
            return result.ToProblemDetails();

        return Results.Ok(result.Value);
    }

    private static async Task<IResult> GetRegistrationById(
        Guid id,
        IQueryHandler<GetRegistrationByIdQuery, Result<GetRegistrationByIdResponse>> handler,
        CancellationToken cancellationToken)
    {
        var query = new GetRegistrationByIdQuery(id);
        var result = await handler.HandleAsync(query, cancellationToken);

        if (!result.IsSuccess)
            return result.ToProblemDetails();

        return Results.Ok(result.Value);
    }

    private static async Task<IResult> GetRegistrationSummary(
        IQueryHandler<GetRegistrationSummaryQuery, Result<GetRegistrationSummaryResponse>> handler,
        CancellationToken cancellationToken)
    {
        var result = await handler.HandleAsync(
            new GetRegistrationSummaryQuery(),
            cancellationToken);

        if (!result.IsSuccess)
            return result.ToProblemDetails();

        return Results.Ok(result.Value);
    }
}

