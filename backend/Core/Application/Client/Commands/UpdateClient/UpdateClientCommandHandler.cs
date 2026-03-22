using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Client.Commands.UpdateClient
{
    public class UpdateClientCommandHandler : IRequestHandler<UpdateClientCommandRequest, Unit>
    {
        private readonly IClientControlContext _context;

        public UpdateClientCommandHandler(IClientControlContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(UpdateClientCommandRequest request, CancellationToken cancellationToken)
        {
            var client = await _context.Clients
                .Include(c => c.Address)
                .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

            if (client == null)
                throw new NotFoundException(nameof(Client), request.Id);

            client.Update(
                request.FirstName,
                request.LastName,
                request.PhoneNumber,
                request.Email,
                request.DocumentNumber,
                request.BirthDate
            );

            if (client.Address != null)
            {
                client.Address.Update(
                    request.Address.PostalCode,
                    request.Address.AddressLine,
                    request.Address.Number,
                    request.Address.Complement,
                    request.Address.Neighborhood,
                    request.Address.City,
                    request.Address.State
                );
            }

            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}