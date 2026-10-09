using Microsoft.AspNetCore.Mvc;
using SideAI.Application.Common.Interfaces;
using SideAI.Application.DTOs;

namespace SideAI.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly IAdminMetricsService _metricsService;

    public AdminController(IAdminMetricsService metricsService)
    {
        _metricsService = metricsService;
    }

    [HttpGet("dashboard")]
    public ActionResult<AdminDashboardDto> GetDashboard()
    {
        var metrics = _metricsService.GetDashboardMetrics();
        return Ok(metrics);
    }
}