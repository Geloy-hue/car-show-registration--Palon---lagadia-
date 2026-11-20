
namespace Application.Features.Registrations.GetRegistrations;

using FluentValidation;

public sealed class GetRegistrationsValidator
    : AbstractValidator<GetRegistrationsQuery>
{
    public GetRegistrationsValidator()
    {
        RuleFor(x => x.Page)
            .GreaterThanOrEqualTo(1)
            .WithMessage("Page must be at least 1.");

        RuleFor(x => x.PageSize)
            .InclusiveBetween(1, 50)
            .WithMessage("Page size must be between 1 and 50.");

        RuleFor(x => x.ParticipantName)
            .MaximumLength(150)
            .When(x => !string.IsNullOrWhiteSpace(x.ParticipantName));
    }
}


