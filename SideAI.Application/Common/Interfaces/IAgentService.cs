using SideAI.Application.DTOs;

namespace SideAI.Application.Common.Interfaces;

public interface IAgentService
{
    Task<AgentChatResponseDto> ProcessPromptAsync(string prompt);
}