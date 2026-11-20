using System;
using System.Collections.Generic;
using System.Text;


namespace Application.Features.Registrations;

using Application.Abstractions.Data;
using Microsoft.EntityFrameworkCore;

public sealed class RegistrationNumberGenerator
{
    private readonly IAppDbContext _dbContext;

    public RegistrationNumberGenerator(IAppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<string> GenerateAsync(
        CancellationToken cancellationToken = default)
    {
        var lastRegistrationNumber = await _dbContext.Registrations
            .AsNoTracking()
            .OrderByDescending(r => r.RegistrationNumber)
            .Select(r => r.RegistrationNumber)
            .FirstOrDefaultAsync(cancellationToken);

        var nextNumber = 1;

        if (!string.IsNullOrEmpty(lastRegistrationNumber))
        {
            var numberPart = lastRegistrationNumber.Replace("CS27-", "");

            if (int.TryParse(numberPart, out var currentNumber))
            {
                nextNumber = currentNumber + 1;
            }
        }

        return $"CS27-{nextNumber:D4}";
    }
}
