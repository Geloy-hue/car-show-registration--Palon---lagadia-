using System;
using System.Collections.Generic;
using System.Text;


namespace Application.Features.Registrations.CreateRegistration;

using Application.Abstractions.Data;
using Application.Abstractions.Messaging;
using Application.Features.Registrations;
using Domain.Common;
using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

public sealed class CreateRegistrationHandler
    : ICommandHandler<CreateRegistrationCommand, Result<CreateRegistrationResponse>>
{
    private readonly IAppDbContext _dbContext;
    private readonly RegistrationNumberGenerator _numberGenerator;

    public CreateRegistrationHandler(
        IAppDbContext dbContext,
        RegistrationNumberGenerator numberGenerator)
    {
        _dbContext = dbContext;
        _numberGenerator = numberGenerator;
    }

    public async Task<Result<CreateRegistrationResponse>> HandleAsync(
        CreateRegistrationCommand command,
        CancellationToken cancellationToken = default)
    {
        var duplicatePlate = await _dbContext.Registrations
            .AnyAsync(
                r => r.PlateNumber == command.PlateNumber,
                cancellationToken);

        if (duplicatePlate)
        {
            return Result<CreateRegistrationResponse>.Failure(
                new Error("Registration.DuplicatePlate",
                    "This plate number is already registered."));
        }

        var registrationFee =
            RegistrationFeeCalculator.Calculate(command.RegistrationType);

        if (command.AmountPaid < 0 ||
            command.AmountPaid > registrationFee)
        {
            return Result<CreateRegistrationResponse>.Failure(
                new Error("Registration.InvalidAmountPaid",
                    "Amount paid must be between zero and the registration fee."));
        }

        var registrationNumber =
            await _numberGenerator.GenerateAsync(cancellationToken);

        var registration = new Registration
        {
            Id = Guid.NewGuid(),
            RegistrationNumber = registrationNumber,
            RegistrationDate = DateTime.UtcNow,
            ParticipantName = command.ParticipantName,
            ContactNumber = command.ContactNumber,
            Email = command.Email,
            Address = command.Address,
            CarMakeModel = command.CarMakeModel,
            PlateNumber = command.PlateNumber,
            RegistrationType = command.RegistrationType,
            Status = RegistrationStatus.Pending,
            RegistrationFee = registrationFee,
            AmountPaid = command.AmountPaid
        };

        _dbContext.Registrations.Add(registration);

        await _dbContext.SaveChangesAsync(cancellationToken);

        var response = new CreateRegistrationResponse(
            registration.Id,
            registration.RegistrationNumber,
            registration.RegistrationDate,
            registration.ParticipantName,
            registration.ContactNumber,
            registration.Email,
            registration.Address,
            registration.CarMakeModel,
            registration.PlateNumber,
            registration.RegistrationType,
            registration.Status,
            registration.RegistrationFee,
            registration.AmountPaid,
            registration.PaymentStatus);

        return Result<CreateRegistrationResponse>.Success(response);
    }
}
