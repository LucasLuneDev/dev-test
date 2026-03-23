using Application.Client.Commands.CreateClient;
using Application.Client.Models;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace WebApi.BackgroundServices
{
    public class CsvProcessingBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<CsvProcessingBackgroundService> _logger;

        public CsvProcessingBackgroundService(IServiceProvider serviceProvider, ILogger<CsvProcessingBackgroundService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "Csv");

            while (!stoppingToken.IsCancellationRequested)
            {
                if (Directory.Exists(folderPath))
                {
                    var files = Directory.GetFiles(folderPath, "*.csv");

                    foreach (var file in files)
                    {
                        try
                        {
                            await ProcessFileAsync(file, stoppingToken);
                            File.Delete(file);
                            _logger.LogInformation($"Arquivo {file} processado e deletado com sucesso.");
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex, $"Erro ao processar o arquivo {file}");
                        }
                    }
                }

                await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);
            }
        }

        private async Task ProcessFileAsync(string filePath, CancellationToken stoppingToken)
        {
            using var scope = _serviceProvider.CreateScope();
            var mediator = scope.ServiceProvider.GetRequiredService<IMediator>();

            var lines = await File.ReadAllLinesAsync(filePath, stoppingToken);

            for (int i = 1; i < lines.Length; i++)
            {
                var line = lines[i];
                if (string.IsNullOrWhiteSpace(line)) continue;

                var columns = line.Split(',');

                if (columns.Length >= 13)
                {
                    var request = new CreateClientCommandRequest
                    {
                            FirstName = columns[0].Trim(),
                            LastName = columns[1].Trim(),
                            PhoneNumber = columns[2].Trim(),
                            Email = columns[3].Trim(),
                            DocumentNumber = columns[4].Trim(),
                            BirthDate = DateTime.TryParse(columns[5].Trim(), out var date) ? date : DateTime.MinValue,
                            Address = new AddressModel
                            {
                                PostalCode = columns[6].Trim(),
                                AddressLine = columns[7].Trim(),
                                Number = columns[8].Trim(),
                                Complement = columns[9].Trim(),
                                Neighborhood = columns[10].Trim(),
                                City = columns[11].Trim(),
                                State = columns[12].Trim()
                            }
                        };

                        try
                    {
                        await mediator.Send(request, stoppingToken);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError($"Erro ao salvar cliente da linha {i}: {ex.Message}");
                    }
                }
            }
        }
    }
}