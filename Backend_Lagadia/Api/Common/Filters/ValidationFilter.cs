
namespace Api.Common.Filters;

using FluentValidation;
using Microsoft.AspNetCore.Http;

public sealed class ValidationFilter<T> : IEndpointFilter
    where T : notnull
{
    public async ValueTask<object?> InvokeAsync(
        EndpointFilterInvocationContext context,
        EndpointFilterDelegate next)
    {
        var validator = context.HttpContext.RequestServices
            .GetService<IValidator<T>>();

        if (validator is null)
        {
            return await next(context);
        }

        var argument = context.Arguments
            .OfType<T>()
            .FirstOrDefault();

        if (argument is null)
        {
            return await next(context);
        }

        var validationResult = await validator.ValidateAsync(
            argument,
            context.HttpContext.RequestAborted);

        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors
                .Select(error => new
                {
                    error.PropertyName,
                    error.ErrorMessage
                });

            return Results.ValidationProblem(
                validationResult.Errors
                    .GroupBy(error => error.PropertyName)
                    .ToDictionary(
                        group => group.Key,
                        group => group
                            .Select(error => error.ErrorMessage)
                            .ToArray()));
        }

        return await next(context);
    }
}

