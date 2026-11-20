
namespace Api.Common.Extensions;

using Domain.Common;
using Microsoft.AspNetCore.Mvc;

public static class ResultExtensions
{
    public static IResult ToProblemDetails<T>(this Result<T> result)
    {
        if (result.IsSuccess)
        {
            throw new InvalidOperationException(
                "Cannot convert a successful result to ProblemDetails.");
        }

        var error = result.Error!;

        // Return a field-specific validation error for invalid payment.
        if (error.Code == "Registration.InvalidAmountPaid")
        {
            return Results.ValidationProblem(
                new Dictionary<string, string[]>
                {
                    ["AmountPaid"] = new[] { error.Message }
                });
        }

        var problemDetails = new ProblemDetails
        {
            Title = error.Code,
            Detail = error.Message,
            Status = GetStatusCode(error.Code)
        };

        return Results.Problem(problemDetails);
    }

    private static int GetStatusCode(string errorCode)
    {
        return errorCode switch
        {
            string code when code.Contains("NotFound") => 404,
            string code when code.Contains("Validation") => 400,
            string code when code.Contains("InvalidAmountPaid") => 400,
            string code when code.Contains("Conflict")
                || code.Contains("Duplicate") => 409,
            _ => 500
        };
    }
}



