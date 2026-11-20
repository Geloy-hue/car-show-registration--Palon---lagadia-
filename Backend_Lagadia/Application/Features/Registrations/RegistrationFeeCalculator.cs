using System;
using System.Collections.Generic;
using System.Text;


namespace Application.Features.Registrations;

using Domain.Enums;

public static class RegistrationFeeCalculator
{
    public static decimal Calculate(RegistrationType registrationType)
    {
        return registrationType switch
        {
            RegistrationType.Exhibitor => 1500m,
            RegistrationType.Competitor => 2500m,
            RegistrationType.VIP => 5000m,
            _ => throw new ArgumentOutOfRangeException(
                nameof(registrationType),
                "Invalid registration type."
            )
        };
    }
}

