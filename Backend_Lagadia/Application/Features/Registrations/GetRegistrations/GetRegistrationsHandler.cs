
namespace Application.Features.Registrations.GetRegistrations;

using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Domain.Common;
using Microsoft.EntityFrameworkCore;

public sealed class GetRegistrationsHandler
    : IQueryHandler<GetRegistrationsQuery, Result<GetRegistrationsResponse>>
{
    private readonly IAppDbContext _dbContext;

    public GetRegistrationsHandler(IAppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Result<GetRegistrationsResponse>> HandleAsync(
        GetRegistrationsQuery query,
        CancellationToken cancellationToken = default)
    {
        var registrations = _dbContext.Registrations
            .AsNoTracking()
            .AsQueryable();

        // Participant name filter
        if (!string.IsNullOrWhiteSpace(query.ParticipantName))
        {
            var name = query.ParticipantName.Trim().ToLower();

            registrations = registrations.Where(r =>
                r.ParticipantName.ToLower().Contains(name));
        }

        // Status filter
        if (query.Status.HasValue)
        {
            registrations = registrations.Where(r =>
                r.Status == query.Status.Value);
        }

        // Registration type filter
        if (query.Type.HasValue)
        {
            registrations = registrations.Where(r =>
                r.RegistrationType == query.Type.Value);
        }

        var totalCount = await registrations.CountAsync(cancellationToken);

        var page = Math.Max(1, query.Page);
        var pageSize = Math.Clamp(query.PageSize, 1, 50);

        var items = await registrations
            .OrderByDescending(r => r.RegistrationDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(r => new RegistrationItemResponse(
                r.Id,
                r.RegistrationNumber,
                r.RegistrationDate,
                r.ParticipantName,
                r.ContactNumber,
                r.Email,
                r.Address,
                r.CarMakeModel,
                r.PlateNumber,
                r.RegistrationType,
                r.Status,
                r.RegistrationFee,
                r.AmountPaid,
                r.PaymentStatus
            ))
            .ToListAsync(cancellationToken);

        var totalPages = (int)Math.Ceiling(
            (double)totalCount / pageSize);

        var response = new GetRegistrationsResponse(
            items,
            page,
            pageSize,
            totalCount,
            totalPages
        );

        return Result<GetRegistrationsResponse>.Success(response);
    }
}



