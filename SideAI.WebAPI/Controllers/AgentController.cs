using Microsoft.AspNetCore.Mvc;
using SideAI.Application.Common.Interfaces;
using SideAI.Application.DTOs;

namespace SideAI.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AgentController : ControllerBase
{
    private readonly IAgentService _agentService;

    public AgentController(IAgentService agentService)
    {
        _agentService = agentService;
    }

    [HttpPost("chat")]
    public async Task<ActionResult<AgentChatResponseDto>> Chat([FromBody] string prompt)
    {
        if (string.IsNullOrWhiteSpace(prompt))
            return BadRequest("Prompt boş olamaz.");

        var response = await _agentService.ProcessPromptAsync(prompt);
        return Ok(response);
    }
}