using MediatR;

namespace Application.Client.Commands.UploadClientCsv
{
    public class UploadClientCsvCommandRequest : IRequest<string>
    {
        public string FileName { get; set; }
        public byte[] FileContent { get; set; }
    }
}