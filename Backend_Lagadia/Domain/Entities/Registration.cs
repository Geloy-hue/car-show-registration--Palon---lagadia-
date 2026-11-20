using System;
using System.Collections.Generic;
using System.Text;


namespace Domain.Entities;

using Domain.Enums;
using System.ComponentModel.DataAnnotations.Schema;

public class Registration
{
    public Guid Id { get; set; }

    public string RegistrationNumber { get; set; } = string.Empty;

    public DateTime RegistrationDate { get; set; }

    public string ParticipantName { get; set; } = string.Empty;

    public string ContactNumber { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;

    public string CarMakeModel { get; set; } = string.Empty;

    public string PlateNumber { get; set; } = string.Empty;

    public RegistrationType RegistrationType { get; set; }

    public RegistrationStatus Status { get; set; } =
        RegistrationStatus.Pending;

    public decimal RegistrationFee { get; set; }

    public decimal AmountPaid { get; set; } = 0;

    [NotMapped]
    public PaymentStatus PaymentStatus =>
        AmountPaid == 0
            ? PaymentStatus.Unpaid
            : AmountPaid < RegistrationFee
                ? PaymentStatus.Partial
                : PaymentStatus.Paid;
}

