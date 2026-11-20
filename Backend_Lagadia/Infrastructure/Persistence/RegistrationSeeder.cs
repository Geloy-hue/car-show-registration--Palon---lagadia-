using System;
using System.Collections.Generic;
using System.Text;


namespace Infrastructure.Persistence;

using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

public static class RegistrationSeeder
{
    public static async Task SeedAsync(AppDbContext dbContext)
    {
        if (await dbContext.Registrations.AnyAsync())
        {
            return;
        }

        string[] names =
        {
            "Juan Dela Cruz", "Maria Santos", "Pedro Reyes",
            "Ana Garcia", "Jose Mendoza", "Carlo Ramos",
            "Angela Flores", "Mark Bautista", "Sofia Torres",
            "Daniel Cruz", "Miguel Lopez", "Ella Fernandez",
            "Gabriel Rivera", "Nicole Castillo", "Joshua Aquino",
            "Isabella Gomez", "Adrian Morales", "Patricia Diaz",
            "Christian Perez", "Camille Navarro", "Rafael Lim",
            "Andrea Valdez", "Nathan Villanueva", "Bea Santiago",
            "Enzo Martinez"
        };

        var registrations = new List<Registration>();

        for (int i = 0; i < 25; i++)
        {
            var type = (RegistrationType)(i % 3);
            var status = (RegistrationStatus)(i % 4);
            var paymentStatus = (PaymentStatus)(i % 3);

            decimal fee = type switch
            {
                RegistrationType.Exhibitor => 1500m,
                RegistrationType.Competitor => 2500m,
                RegistrationType.VIP => 5000m,
                _ => 1500m
            };

            decimal amountPaid = paymentStatus switch
            {
                PaymentStatus.Unpaid => 0m,
                PaymentStatus.Partial => fee / 2,
                PaymentStatus.Paid => fee,
                _ => 0m
            };

            registrations.Add(new Registration
            {
                Id = Guid.NewGuid(),
                RegistrationNumber = $"CS27-{i + 1:D4}",
                RegistrationDate = DateTime.UtcNow.AddDays(-i),
                ParticipantName = names[i],
                ContactNumber = $"09{123456789 + i}",
                Email = $"participant{i + 1}@example.com",
                Address = $"Sample Address {i + 1}, Philippines",
                CarMakeModel = $"Toyota Model {i + 1}",
                PlateNumber = $"CS27ABC{i + 1:D2}",
                RegistrationType = type,
                Status = status,
                RegistrationFee = fee,
                AmountPaid = amountPaid
            });
        }

        await dbContext.Registrations.AddRangeAsync(registrations);
        await dbContext.SaveChangesAsync();
    }
}

