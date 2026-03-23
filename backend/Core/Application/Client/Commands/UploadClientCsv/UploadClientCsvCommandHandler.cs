using MediatR;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Client.Commands.UploadClientCsv
{
    public class UploadClientCsvCommandHandler : IRequestHandler<UploadClientCsvCommandRequest, string>
    {
        public async Task<string> Handle(UploadClientCsvCommandRequest request, CancellationToken cancellationToken)
        {
            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "Csv");

            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            var fileName = $"{Guid.NewGuid()}_{request.FileName}";
            var filePath = Path.Combine(folderPath, fileName);

            await File.WriteAllBytesAsync(filePath, request.FileContent, cancellationToken);

            return filePath;
        }
    }
}

