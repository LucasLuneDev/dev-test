using FluentValidation;

namespace Application.Client.Commands.UploadClientCsv
{
    public class UploadClientCsvCommandValidator : AbstractValidator<UploadClientCsvCommandRequest>
    {
        public UploadClientCsvCommandValidator()
        {
            RuleFor(x => x.FileName)
                .NotEmpty()
                .WithMessage("FileName obrigatório.")
                .Must(nome => !string.IsNullOrEmpty(nome) && nome.ToLower().EndsWith(".csv"))
                .WithMessage("Apenas arquivos com a extensão .csv são permitidos.");

            RuleFor(x => x.FileContent)
                .NotEmpty()
                .WithMessage("O conteúdo do arquivo não pode estar vazio.");
        }
    }
}