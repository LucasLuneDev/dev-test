using MediatR;
using System.Collections.Generic;

namespace Application.Client.Queries.ClientByDocumentQuery
{
    public class ClientByDocumentQueryRequest : IRequest<IEnumerable<ClientByDocumentQueryResponse>>
    {
        public string Document { get; set; }
    }
}