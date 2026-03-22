using FluentValidation;

namespace Application.Client.Queries.ClientByDocumentQuery
{
    public class ClientByDocumentQueryValidator : AbstractValidator<ClientByDocumentQueryRequest>
    {
        public ClientByDocumentQueryValidator()
        {
            RuleFor(x => x.Document)
                .NotEmpty()
                .WithMessage("O número do documento é obrigatório para realizar a busca.");
        }
    }
}