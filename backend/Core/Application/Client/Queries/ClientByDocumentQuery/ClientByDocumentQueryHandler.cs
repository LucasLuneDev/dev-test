using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Client.Queries.ClientByDocumentQuery
{
    public class ClientByDocumentQueryHandler : IRequestHandler<ClientByDocumentQueryRequest, IEnumerable<ClientByDocumentQueryResponse>>
    {
        private readonly IClientControlContext _context;

        public ClientByDocumentQueryHandler(IClientControlContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ClientByDocumentQueryResponse>> Handle(ClientByDocumentQueryRequest request, CancellationToken cancellationToken)
        {
            var clients = await _context.Clients
                .Where(c => c.DocumentNumber == request.Document)
                .ToListAsync(cancellationToken);

            return clients.Select(c => new ClientByDocumentQueryResponse
            {
                Id = c.Id,
                FirstName = c.FirstName,
                LastName = c.LastName,
                DocumentNumber = c.DocumentNumber,
                BirthDate = c.BirthDate,
                Email = c.Email,
                PhoneNumber = c.PhoneNumber,
                CreatedAt = c.CreatedAt,
                Address = new Models.AddressModel
                {
                    PostalCode = c.Address?.PostalCode,
                    AddressLine = c.Address?.AddressLine,
                    Number = c.Address?.Number,
                    Complement = c.Address?.Complement,
                    Neighborhood = c.Address?.Neighborhood,
                    City = c.Address?.City,
                    State = c.Address?.State
                }
            });
        }
    }
}