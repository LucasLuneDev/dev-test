using Application.Client.Commands.CreateClient;
using Application.Client.Queries.AllClientsQuery;
using Application.Client.Queries.ClientByIdQuery;
using Application.Client.Queries.ClientByDocumentQuery;
using Application.Client.Commands.UpdateClient;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System;
using Application.Client.Commands.UploadClientCsv;
using System.IO;    
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ClientController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ClientController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        [ProducesResponseType(typeof(Guid), StatusCodes.Status200OK)]
        public async Task<IActionResult> Create([FromBody] CreateClientCommandRequest request)
        {
            var response = await _mediator.Send(request);
            return Ok(response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateClientCommandRequest request)
        {
            request.Id = id;
            await _mediator.Send(request);
            return NoContent();
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<AllClientsQueryResponse>), StatusCodes.Status200OK)]
        public async Task<IActionResult> ListAll(
        [FromQuery] string document)
        {
            if (!string.IsNullOrWhiteSpace(document))
            {
                var filtered = await _mediator.Send(new ClientByDocumentQueryRequest { Document = document });
                return Ok(filtered);
            }

            var response = await _mediator.Send(new AllClientsQueryRequest());
            return Ok(response);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ClientByIdQueryResponse), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetById([FromRoute] Guid id)
        {
            var response = await _mediator.Send(new ClientByIdQueryRequest { Id = id });

            return Ok(response);
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadCsv(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "Nenhum arquivo enviado." });
            }

            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);

            var request = new UploadClientCsvCommandRequest
            {
                FileName = file.FileName,
                FileContent = memoryStream.ToArray()
            };

            var filePath = await _mediator.Send(request);

            return Ok(new { message = "Arquivo CSV recebido e salvo com sucesso.", filePath });
        }
    }
}
